-- v11.5.26: student plans (Primary/Secondary Free, Primary Pro $10, Secondary Pro $15, Complete $20, School).
-- Entitlements live in their own table with no client grants, so a student cannot upgrade themselves.
-- Server-enforced: 15 recorded questions/day on free, AI tutor + AI step marking for paid only,
-- 3 hints/day on free, free question rewards capped at 15/day. Teacher-assigned work is not
-- counted against the free limit. Students in a licensed school get the full plan.
-- Requires 20261011_02 (daily attempts table) to be applied first.

create table if not exists public.mathsexpress_entitlements (
  user_id uuid primary key references public.account_profiles(user_id) on delete cascade,
  plan text not null check (plan in ('primary_pro','secondary_pro','complete')),
  expires_at timestamptz not null,
  source text not null check (source in ('stripe','owner','promo')),
  reference text,
  updated_at timestamptz not null default now()
);
alter table public.mathsexpress_entitlements enable row level security;
revoke all on public.mathsexpress_entitlements from public, anon, authenticated;

create table if not exists public.mathsexpress_plan_payments (
  reference text primary key,
  user_id uuid not null references public.account_profiles(user_id) on delete cascade,
  plan text not null,
  amount_cents integer,
  currency text,
  created_at timestamptz not null default now()
);
alter table public.mathsexpress_plan_payments enable row level security;
revoke all on public.mathsexpress_plan_payments from public, anon, authenticated;

create table if not exists public.mathsexpress_school_licences (
  school_id uuid primary key references public.mathrift_schools(id) on delete cascade,
  active boolean not null default true,
  expires_at timestamptz,
  note text,
  updated_at timestamptz not null default now()
);
alter table public.mathsexpress_school_licences enable row level security;
revoke all on public.mathsexpress_school_licences from public, anon, authenticated;
-- Keep every school that exists today on full access (no change for current classes).
insert into public.mathsexpress_school_licences(school_id,active,note)
  select id,true,'Existing school when plans launched' from public.mathrift_schools
  on conflict (school_id) do nothing;

create table if not exists public.mathsexpress_hint_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  hint_key text not null check (char_length(hint_key) between 1 and 200),
  used_at timestamptz not null default now(),
  primary key (user_id,hint_key)
);
alter table public.mathsexpress_hint_usage enable row level security;
revoke all on public.mathsexpress_hint_usage from public, anon, authenticated;

create or replace function private.mx_sydney_day_start() returns timestamptz
language sql stable set search_path='public','private','pg_temp' as $$
  select (date_trunc('day',now() at time zone 'Australia/Sydney')) at time zone 'Australia/Sydney'
$$;

-- {plan, source, expires_at, paid, year_level}
create or replace function private.mx_plan_info(p_user uuid) returns jsonb
language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare v_role text; v_year int; v_plan text:='free'; v_source text:=null; v_expires timestamptz:=null; v_paid boolean;
begin
  select role, year_level into v_role, v_year from public.account_profiles where user_id=p_user;
  if v_role is not null and v_role<>'player' then
    return jsonb_build_object('plan','staff','source','role','expires_at',null,'paid',true,'year_level',v_year);
  end if;
  if exists(
    select 1 from public.mathrift_class_members m
    join public.mathrift_classes c on c.id=m.class_id and not c.archived
    join public.mathsexpress_school_licences l on l.school_id=c.school_id
    where m.student_id=p_user and l.active and (l.expires_at is null or l.expires_at>now())
  ) or exists(
    select 1 from public.mathrift_school_students s
    join public.mathsexpress_school_licences l on l.school_id=s.school_id
    where s.student_id=p_user and l.active and (l.expires_at is null or l.expires_at>now())
  ) then
    return jsonb_build_object('plan','school','source','school','expires_at',null,'paid',true,'year_level',v_year);
  end if;
  select plan, source, expires_at into v_plan, v_source, v_expires
    from public.mathsexpress_entitlements where user_id=p_user and expires_at>now();
  if not found then v_plan:='free'; v_source:=null; v_expires:=null; end if;
  v_paid := v_plan='complete'
         or (v_plan='primary_pro' and coalesce(v_year,0)<=6)
         or (v_plan='secondary_pro' and coalesce(v_year,12)>=7);
  return jsonb_build_object('plan',v_plan,'source',v_source,'expires_at',v_expires,'paid',v_paid,'year_level',v_year);
end $$;

create or replace function private.mx_is_paid(p_user uuid) returns boolean
language sql stable security definer set search_path='public','private','pg_temp' as $$
  select coalesce((private.mx_plan_info(p_user)->>'paid')::boolean,false)
$$;

-- A daily-attempt key of the form asg:<assignment uuid>:... is teacher-set work. It is only
-- exempt while the student really has that assignment open (started, not completed, < 6 h).
create or replace function private.mx_is_open_assignment_key(p_user uuid, p_key text) returns boolean
language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare v_id text:=substring(p_key from '^asg:([0-9a-fA-F-]{36}):');
begin
  if v_id is null then return false; end if;
  return exists(select 1 from public.mathrift_assignment_attempts t
                where t.student_id=p_user and t.assignment_id::text=lower(v_id)
                  and t.completed_at is null and t.started_at>now()-interval '6 hours');
end $$;

create or replace function private.mx_free_questions_today(p_user uuid) returns integer
language sql stable security definer set search_path='public','private','pg_temp' as $$
  select count(*)::int from public.mathsexpress_daily_question_attempts
  where student_id=p_user and attempted_at>=private.mx_sydney_day_start() and event_key not like 'asg:%'
$$;

create or replace function public.mathsexpress_my_plan()
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare v_info jsonb; v_paid boolean; v_used int; v_hints int;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  v_info:=private.mx_plan_info(auth.uid());
  v_paid:=(v_info->>'paid')::boolean;
  v_used:=private.mx_free_questions_today(auth.uid());
  select count(*) into v_hints from public.mathsexpress_hint_usage where user_id=auth.uid() and used_at>=private.mx_sydney_day_start();
  return v_info || jsonb_build_object(
    'daily_question_limit', case when v_paid then null else 15 end,
    'questions_today', v_used,
    'questions_left', case when v_paid then null else greatest(0,15-v_used) end,
    'daily_hint_limit', case when v_paid then null else 3 end,
    'hints_today', v_hints,
    'features', jsonb_build_object('ai_tutor',v_paid,'adaptive',v_paid,'step_solutions',v_paid,'tests',v_paid,
      'revision',v_paid,'daily_challenges',v_paid,'all_topics',v_paid,'all_games',v_paid,'full_history',v_paid,
      'advanced_progress',v_paid,'priority_support',v_paid,'full_rewards',v_paid,'all_achievements',v_paid));
end $$;

-- Daily attempts: free plans stop at 15 per Sydney day (teacher-set work excluded).
create or replace function public.mathsexpress_record_daily_question_attempt(
  p_event_key text, p_correct boolean
) returns jsonb language plpgsql security definer
set search_path = 'public', 'private', 'pg_temp'
as $mx$
declare
  v_uid uuid := auth.uid();
  v_key text := btrim(coalesce(p_event_key,''));
  v_inserted boolean;
  v_paid boolean;
  v_used int;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  if char_length(v_key) not between 1 and 180 then raise exception 'Invalid question key'; end if;
  if v_key like 'asg:%' and not private.mx_is_open_assignment_key(v_uid,v_key) then
    raise exception 'That assignment is not open';
  end if;
  v_paid := private.mx_is_paid(v_uid);
  if not v_paid and v_key not like 'asg:%' then
    perform 1 from public.account_profiles where user_id=v_uid for update;
    v_used := private.mx_free_questions_today(v_uid);
    if v_used>=15 and not exists(select 1 from public.mathsexpress_daily_question_attempts where student_id=v_uid and event_key=v_key) then
      raise exception 'FREE_LIMIT: You have used your 15 free questions today. Upgrade for unlimited practice or come back tomorrow.';
    end if;
  end if;
  insert into public.mathsexpress_daily_question_attempts(student_id,event_key,correct)
    values(v_uid,v_key,p_correct)
    on conflict do nothing returning true into v_inserted;
  v_used := private.mx_free_questions_today(v_uid);
  return jsonb_build_object('recorded',coalesce(v_inserted,false),'questions_today',v_used,
    'questions_left',case when v_paid then null else greatest(0,15-v_used) end);
end
$mx$;
revoke all on function public.mathsexpress_record_daily_question_attempt(text,boolean) from public, anon, authenticated;
grant execute on function public.mathsexpress_record_daily_question_attempt(text,boolean) to authenticated;

-- Question rewards: unchanged, except free plans earn rewards for at most 15 questions a day.
create or replace function public.mathsexpress_award_question_reward(p_event_key text, p_correct boolean, p_xp integer default 0, p_game_time_seconds integer default 10)
returns jsonb language plpgsql security definer set search_path to 'public', 'private', 'pg_temp' as $function$
declare v_key text:=left(trim(coalesce(p_event_key,'')),220); v_xp integer:=greatest(0,least(20,coalesce(p_xp,0)));
  v_game integer:=case when coalesce(p_game_time_seconds,0)>0 then 10 else 0 end; v_inserted integer:=0; v_today integer:=0; v_recent timestamptz;
  v_cap integer;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if v_key='' then raise exception 'Reward event key required'; end if;
  if not coalesce(p_correct,false) then return public.mathsexpress_player_state(); end if;
  if exists(select 1 from public.mathsexpress_reward_events where user_id=auth.uid() and event_key=v_key) then
    return public.mathsexpress_player_state() || jsonb_build_object('duplicate',true); end if;
  v_cap := case when private.mx_is_paid(auth.uid()) then 300 else 15 end;
  select count(*),max(created_at) into v_today,v_recent from public.mathsexpress_reward_events
    where user_id=auth.uid() and event_type='question' and created_at>=date_trunc('day',now());
  if v_today>=v_cap then return public.mathsexpress_player_state() || jsonb_build_object('reward_capped',true,'plan_limited',v_cap=15); end if;
  if v_recent is not null and v_recent>now()-interval '2 seconds' then
    return public.mathsexpress_player_state() || jsonb_build_object('reward_throttled',true); end if;
  insert into public.mathsexpress_reward_events(user_id,event_key,event_type,coins,xp,game_time_seconds)
    values(auth.uid(),v_key,'question',1,v_xp,v_game) on conflict do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted=1 then
    update public.account_profiles set coins=least(2000000,coins+1), xp=least(2000000000,xp+v_xp),
      game_time_seconds=least(300,game_time_seconds+v_game) where user_id=auth.uid();
  end if;
  return public.mathsexpress_player_state();
end; $function$;

-- AI: the tutor and AI step marking are paid features. Handwriting input stays available to all.
create or replace function public.mathsexpress_consume_ai_quota(p_kind text)
returns jsonb language plpgsql security definer set search_path to 'public', 'private', 'pg_temp' as $function$
declare v_kind text:=lower(trim(coalesce(p_kind,''))); v_limit integer; v_count integer;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if v_kind not in ('ai','mark-step','handwriting') then raise exception 'Invalid AI quota kind'; end if;
  if v_kind in ('ai','mark-step') and not private.mx_is_paid(auth.uid()) then
    raise exception 'PLAN_REQUIRED: The AI maths tutor is included with Primary Pro, Secondary Pro and Complete.';
  end if;
  v_limit:=case v_kind when 'ai' then 30 when 'mark-step' then 100 else 20 end;
  delete from private.mathsexpress_ai_usage where user_id=auth.uid() and used_at < now()-interval '1 hour';
  select count(*) into v_count from private.mathsexpress_ai_usage where user_id=auth.uid() and kind=v_kind and used_at >= now()-interval '10 minutes';
  if v_count >= v_limit then raise exception 'AI rate limit reached. Please wait a few minutes and try again.'; end if;
  insert into private.mathsexpress_ai_usage(user_id,kind) values(auth.uid(),v_kind);
  return jsonb_build_object('ok',true,'remaining',greatest(0,v_limit-v_count-1),'window_seconds',600);
end; $function$;

-- Hints: 3 per day on free plans. Re-opening the same hint does not use another one.
create or replace function public.mathsexpress_use_hint(p_hint_key text)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare v_key text:=left(btrim(coalesce(p_hint_key,'')),200); v_used int; v_paid boolean;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if v_key='' then raise exception 'Invalid hint'; end if;
  v_paid:=private.mx_is_paid(auth.uid());
  if exists(select 1 from public.mathsexpress_hint_usage where user_id=auth.uid() and hint_key=v_key) then
    return jsonb_build_object('allowed',true,'repeat',true);
  end if;
  select count(*) into v_used from public.mathsexpress_hint_usage where user_id=auth.uid() and used_at>=private.mx_sydney_day_start();
  if not v_paid and v_used>=3 then
    raise exception 'PLAN_REQUIRED: Free plans include 3 hints a day. Upgrade for unlimited hints.';
  end if;
  insert into public.mathsexpress_hint_usage(user_id,hint_key) values(auth.uid(),v_key) on conflict do nothing;
  return jsonb_build_object('allowed',true,'hints_today',v_used+1,'hints_left',case when v_paid then null else greatest(0,2-v_used) end);
end $$;

-- Payment fulfilment. Only the Worker (service role) may call this, after verifying a Stripe
-- webhook signature. Idempotent per payment reference; extends an active plan.
create or replace function public.mathsexpress_grant_plan(p_user uuid, p_plan text, p_days integer, p_source text,
  p_reference text, p_amount_cents integer default null, p_currency text default null)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare v_inserted int; v_until timestamptz;
begin
  if p_plan not in ('primary_pro','secondary_pro','complete') then raise exception 'Unknown plan'; end if;
  if p_days not between 1 and 800 then raise exception 'Invalid plan length'; end if;
  if p_source not in ('stripe','owner','promo') then raise exception 'Invalid source'; end if;
  if coalesce(p_reference,'')='' then raise exception 'Payment reference required'; end if;
  if not exists(select 1 from public.account_profiles where user_id=p_user) then raise exception 'Account not found'; end if;
  insert into public.mathsexpress_plan_payments(reference,user_id,plan,amount_cents,currency)
    values(p_reference,p_user,p_plan,p_amount_cents,p_currency) on conflict do nothing;
  get diagnostics v_inserted=row_count;
  if v_inserted=0 then return jsonb_build_object('ok',true,'duplicate',true); end if;
  insert into public.mathsexpress_entitlements(user_id,plan,expires_at,source,reference)
    values(p_user,p_plan,now()+make_interval(days=>p_days),p_source,p_reference)
  on conflict (user_id) do update set
    plan=excluded.plan,
    expires_at=greatest(public.mathsexpress_entitlements.expires_at,now())+make_interval(days=>p_days),
    source=excluded.source, reference=excluded.reference, updated_at=now()
  returning expires_at into v_until;
  return jsonb_build_object('ok',true,'duplicate',false,'plan',p_plan,'expires_at',v_until);
end $$;
revoke all on function public.mathsexpress_grant_plan(uuid,text,integer,text,text,integer,text) from public, anon, authenticated;
grant execute on function public.mathsexpress_grant_plan(uuid,text,integer,text,text,integer,text) to service_role;

-- Owner/admin: set or remove a student's plan by hand (for school sales, refunds, testing).
create or replace function public.mathsexpress_owner_set_user_plan(p_user uuid, p_plan text, p_days integer default 365)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare v_res jsonb;
begin
  if not public.mathsexpress_is_platform_admin() then raise exception 'Owner or admin access required'; end if;
  if p_plan='free' then
    delete from public.mathsexpress_entitlements where user_id=p_user;
    v_res:=jsonb_build_object('ok',true,'plan','free');
  else
    v_res:=public.mathsexpress_grant_plan(p_user,p_plan,p_days,'owner','owner:'||auth.uid()||':'||gen_random_uuid());
  end if;
  insert into public.mathsexpress_audit_log(actor_user_id,action,target,details)
    values(auth.uid(),'owner-set-plan',p_user::text,jsonb_build_object('plan',p_plan,'days',p_days));
  return v_res || jsonb_build_object('info',private.mx_plan_info(p_user));
end $$;

-- Owner/admin: turn a school licence on or off.
create or replace function public.mathsexpress_owner_set_school_licence(p_school_id uuid, p_active boolean, p_expires_at timestamptz default null)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
begin
  if not public.mathsexpress_is_platform_admin() then raise exception 'Owner or admin access required'; end if;
  insert into public.mathsexpress_school_licences(school_id,active,expires_at,updated_at) values(p_school_id,p_active,p_expires_at,now())
    on conflict (school_id) do update set active=excluded.active, expires_at=excluded.expires_at, updated_at=now();
  insert into public.mathsexpress_audit_log(actor_user_id,action,target,details)
    values(auth.uid(),'owner-set-school-licence',p_school_id::text,jsonb_build_object('active',p_active,'expires_at',p_expires_at));
  return jsonb_build_object('ok',true,'school_id',p_school_id,'active',p_active,'expires_at',p_expires_at);
end $$;

do $$ declare f text; begin
  foreach f in array array['public.mathsexpress_my_plan()','public.mathsexpress_use_hint(text)',
    'public.mathsexpress_owner_set_user_plan(uuid,text,integer)','public.mathsexpress_owner_set_school_licence(uuid,boolean,timestamptz)',
    'public.mathsexpress_award_question_reward(text,boolean,integer,integer)','public.mathsexpress_consume_ai_quota(text)'] loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
