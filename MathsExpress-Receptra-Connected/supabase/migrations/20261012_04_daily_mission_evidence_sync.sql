-- v11.5.33: Daily Missions use one verifiable source of truth.
-- Reconcile older questions that earned a server reward before the daily-attempts hook existed.
-- Never award for local-only quest counters.

create or replace function public.mathsexpress_my_daily_missions()
returns jsonb language plpgsql stable security definer
set search_path='public','private','pg_temp' as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'Australia/Sydney')::date;
  v_start timestamptz := date_trunc('day', now() at time zone 'Australia/Sydney') at time zone 'Australia/Sydney';
  v_answered int := 0;
  v_correct int := 0;
  v_rewarded_correct int := 0;
  v_xp int := 0;
  v_claimed text[];
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  select (select count(*) from public.mathsexpress_daily_question_attempts
            where student_id=v_uid and attempted_at >= v_start)
       + (select count(*) from public.mathrift_question_attempts
            where student_id=v_uid and created_at >= v_start)
    into v_answered;
  select (select count(*) from public.mathsexpress_daily_question_attempts
            where student_id=v_uid and correct and attempted_at >= v_start)
       + (select count(*) from public.mathrift_question_attempts
            where student_id=v_uid and correct and created_at >= v_start)
    into v_correct;
  select count(*) into v_rewarded_correct
    from public.mathsexpress_reward_events
    where user_id=v_uid and event_type='question' and created_at >= v_start;
  v_correct := greatest(v_correct, v_rewarded_correct);
  v_answered := greatest(v_answered, v_rewarded_correct);
  select coalesce(sum(xp),0) into v_xp
    from public.mathsexpress_reward_events
    where user_id=v_uid and event_type<>'mission' and created_at >= v_start;
  select coalesce(array_agg(split_part(event_key,':',2)),array[]::text[])
    into v_claimed
    from public.mathsexpress_reward_events
    where user_id=v_uid and event_type='mission'
      and event_key in ('mission:answer-5:'||v_day::text,
                        'mission:correct-3:'||v_day::text,
                        'mission:earn-40-xp:'||v_day::text);
  return jsonb_build_object(
    'day',v_day::text,
    'missions',jsonb_build_object(
      'answer-5',jsonb_build_object('progress',least(v_answered,5),'target',5,'complete',v_answered>=5,'claimed','answer-5'=any(v_claimed)),
      'correct-3',jsonb_build_object('progress',least(v_correct,3),'target',3,'complete',v_correct>=3,'claimed','correct-3'=any(v_claimed)),
      'earn-40-xp',jsonb_build_object('progress',least(v_xp,40),'target',40,'complete',v_xp>=40,'claimed','earn-40-xp'=any(v_claimed))
    )
  );
end $$;
revoke all on function public.mathsexpress_my_daily_missions() from public,anon,authenticated;
grant execute on function public.mathsexpress_my_daily_missions() to authenticated;

-- Record once per unique question. A student who improves from an incorrect
-- first attempt to a correct retry may now complete the correct-answer mission.
-- Existing recorded attempts and daily free-plan limits are preserved.
create or replace function public.mathsexpress_record_daily_question_attempt(
  p_event_key text, p_correct boolean
) returns jsonb language plpgsql security definer
set search_path='public','private','pg_temp' as $$
declare
  v_uid uuid := auth.uid();
  v_key text := btrim(coalesce(p_event_key,''));
  v_recorded boolean;
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
    if v_used>=15 and not exists(select 1 from public.mathsexpress_daily_question_attempts
      where student_id=v_uid and event_key=v_key) then
      raise exception 'FREE_LIMIT: You have used your 15 free questions today. Upgrade for unlimited practice or come back tomorrow.';
    end if;
  end if;
  insert into public.mathsexpress_daily_question_attempts(student_id,event_key,correct)
    values(v_uid,v_key,coalesce(p_correct,false))
    on conflict (student_id,event_key) do update
      set correct=true
      where public.mathsexpress_daily_question_attempts.correct=false and excluded.correct=true
    returning true into v_recorded;
  v_used := private.mx_free_questions_today(v_uid);
  return jsonb_build_object('recorded',coalesce(v_recorded,false),'questions_today',v_used,
    'questions_left',case when v_paid then null else greatest(0,15-v_used) end);
end $$;
revoke all on function public.mathsexpress_record_daily_question_attempt(text,boolean) from public,anon,authenticated;
grant execute on function public.mathsexpress_record_daily_question_attempt(text,boolean) to authenticated;

-- Keep the eligibility check aligned with the read-only progress RPC.
create or replace function public.mathsexpress_claim_daily_mission(p_mission_id text)
returns jsonb language plpgsql security definer
set search_path='public','private','pg_temp' as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'Australia/Sydney')::date;
  v_key text;
  v_coins int;
  v_xp int;
  v_target int;
  v_progress int;
  v_inserted int;
  v_status jsonb;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  case p_mission_id
    when 'answer-5' then v_coins:=5;v_xp:=20;v_target:=5;
    when 'correct-3' then v_coins:=5;v_xp:=25;v_target:=3;
    when 'earn-40-xp' then v_coins:=10;v_xp:=20;v_target:=40;
    else raise exception 'Unknown mission';
  end case;
  v_key:='mission:'||p_mission_id||':'||v_day::text;
  if exists(select 1 from public.mathsexpress_reward_events where user_id=v_uid and event_key=v_key) then
    return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',true);
  end if;
  v_status := public.mathsexpress_my_daily_missions();
  v_progress := coalesce((v_status->'missions'->p_mission_id->>'progress')::integer,0);
  if v_progress < v_target then
    raise exception 'Mission not complete yet (% of % recorded today)',v_progress,v_target;
  end if;
  insert into public.mathsexpress_reward_events(user_id,event_key,event_type,coins,xp,game_time_seconds)
  values(v_uid,v_key,'mission',v_coins,v_xp,0) on conflict do nothing;
  get diagnostics v_inserted=row_count;
  if v_inserted=1 then
    update public.account_profiles
      set coins=least(2000000,coins+v_coins),xp=least(2000000000,xp+v_xp)
      where user_id=v_uid;
    return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',false);
  end if;
  return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',true);
end $$;
revoke all on function public.mathsexpress_claim_daily_mission(text) from public,anon,authenticated;
grant execute on function public.mathsexpress_claim_daily_mission(text) to authenticated;
