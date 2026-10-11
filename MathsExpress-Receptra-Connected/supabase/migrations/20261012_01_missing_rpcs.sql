-- MathsExpress v11.5.24: backends for every RPC the client or Worker calls that did not exist
-- (re-audited against the live project on 12 Oct 2026: 25 missing; v7_rollover_class already existed and is untouched). Requires 20261011_02 first
-- (claim_daily_mission reads mathsexpress_daily_question_attempts).
-- Conventions: SECURITY DEFINER, fixed search_path, auth.uid() checks, EXECUTE for authenticated only,
-- new tables have RLS on and no direct grants. Every report reads real rows; nothing is invented.

-- ---------------------------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------------------------
create or replace function private.mx_mastery(p_theta numeric) returns numeric
language sql immutable as $$ select round((100/(1+exp(-1.25*coalesce(p_theta,0))))::numeric,1) $$;

create or replace function private.mx_active_role() returns text
language sql stable security definer set search_path='public','pg_temp' as $$
  select role from public.account_profiles where user_id=auth.uid() and status='active'
$$;

-- Staff who may contact a student's guardians: owner, school student managers, or a teacher of a
-- class in that school the student belongs to (same rule as mathsexpress_teacher_send_parent_message).
create or replace function private.mx_can_contact_guardians(p_school_id uuid, p_student_id uuid) returns boolean
language sql stable security definer set search_path='public','private','pg_temp' as $$
  select coalesce(private.mathrift_is_owner()
    or private.mathrift_school_can_manage_students(p_school_id)
    or exists(select 1 from public.mathrift_classes c
              join public.mathrift_class_members m on m.class_id=c.id and m.student_id=p_student_id
              where c.school_id=p_school_id and private.mathrift_teaches(c.id)), false)
$$;

-- ---------------------------------------------------------------------------------------------
-- Owner console: rewards and profile
-- ---------------------------------------------------------------------------------------------
create or replace function public.mathsexpress_owner_adjust_user_rewards(
  p_user_id uuid, p_coins_delta integer, p_xp_delta integer, p_game_time_delta integer)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare p public.account_profiles;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not public.mathsexpress_is_platform_admin() then raise exception 'Owner or Admin access required'; end if;
  if abs(coalesce(p_coins_delta,0))>2000000 or abs(coalesce(p_xp_delta,0))>2000000000 or abs(coalesce(p_game_time_delta,0))>300 then
    raise exception 'Adjustment is out of range';
  end if;
  update public.account_profiles set
    coins=greatest(0,least(2000000,coins+coalesce(p_coins_delta,0))),
    xp=greatest(0,least(2000000000,xp+coalesce(p_xp_delta,0))),
    game_time_seconds=greatest(0,least(300,game_time_seconds+coalesce(p_game_time_delta,0)))
  where user_id=p_user_id returning * into p;
  if not found then raise exception 'User not found'; end if;
  insert into public.mathsexpress_audit_log(actor_user_id,action,target,details)
  values(auth.uid(),'owner-adjust-rewards',p_user_id::text,
         jsonb_build_object('coins_delta',p_coins_delta,'xp_delta',p_xp_delta,'game_time_delta',p_game_time_delta,
                            'coins',p.coins,'xp',p.xp,'game_time_seconds',p.game_time_seconds));
  return jsonb_build_object('ok',true,'user_id',p.user_id,'coins',p.coins,'xp',p.xp,'game_time_seconds',p.game_time_seconds,
                            'gameTimeSeconds',p.game_time_seconds);
end $$;

create or replace function public.mathsexpress_owner_update_user_profile(
  p_user_id uuid, p_display_name text, p_username text, p_year_level integer)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare v_name text; v_username text; p public.account_profiles;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not public.mathsexpress_is_platform_admin() then raise exception 'Owner or Admin access required'; end if;
  if not exists(select 1 from public.account_profiles where user_id=p_user_id) then raise exception 'User not found'; end if;
  if p_display_name is not null then
    v_name:=left(regexp_replace(trim(p_display_name),'\s+',' ','g'),40);
    if char_length(v_name)<2 then raise exception 'Display name must be at least 2 characters'; end if;
  end if;
  if p_username is not null and trim(p_username)<>'' then
    v_username:=lower(regexp_replace(trim(p_username),'[^A-Za-z0-9_]','','g'));
    if char_length(v_username) not between 3 and 24 then raise exception 'Username must be 3-24 letters, numbers or underscores'; end if;
    if exists(select 1 from public.account_profiles where lower(username)=v_username and user_id<>p_user_id) then
      raise exception 'That username is already taken';
    end if;
  end if;
  -- account_profiles.year_level is constrained to 1-12 (Kindergarten is not stored on profiles).
  if p_year_level is not null and p_year_level not between 1 and 12 then raise exception 'Year level must be 1-12'; end if;
  update public.account_profiles set
    display_name=coalesce(v_name,display_name),
    username=case when p_username is null then username else nullif(v_username,'') end,
    year_level=coalesce(p_year_level,year_level)
  where user_id=p_user_id returning * into p;
  insert into public.mathsexpress_audit_log(actor_user_id,action,target,details)
  values(auth.uid(),'owner-update-profile',p_user_id::text,
         jsonb_build_object('display_name',v_name,'username',v_username,'year_level',p_year_level));
  return jsonb_build_object('ok',true,'user_id',p.user_id,'display_name',p.display_name,'username',p.username,'year_level',p.year_level);
end $$;

-- ---------------------------------------------------------------------------------------------
-- Daily missions: completion is checked against server evidence for the Sydney school day,
-- and each mission pays once per day through the existing reward-event ledger.
-- ---------------------------------------------------------------------------------------------
create or replace function public.mathsexpress_claim_daily_mission(p_mission_id text)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare
  v_uid uuid:=auth.uid();
  v_day_start timestamptz:=(date_trunc('day',now() at time zone 'Australia/Sydney')) at time zone 'Australia/Sydney';
  v_key text; v_coins int; v_xp int; v_progress int; v_target int; v_inserted int;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  case p_mission_id
    when 'answer-5' then v_coins:=5; v_xp:=20; v_target:=5;
      select (select count(*) from public.mathsexpress_daily_question_attempts where student_id=v_uid and attempted_at>=v_day_start)
           + (select count(*) from public.mathrift_question_attempts where student_id=v_uid and created_at>=v_day_start)
        into v_progress;
    when 'correct-3' then v_coins:=5; v_xp:=25; v_target:=3;
      select (select count(*) from public.mathsexpress_daily_question_attempts where student_id=v_uid and correct and attempted_at>=v_day_start)
           + (select count(*) from public.mathrift_question_attempts where student_id=v_uid and correct and created_at>=v_day_start)
        into v_progress;
    when 'earn-40-xp' then v_coins:=10; v_xp:=20; v_target:=40;
      select coalesce(sum(xp),0) into v_progress from public.mathsexpress_reward_events
       where user_id=v_uid and event_type<>'mission' and created_at>=v_day_start;
    else raise exception 'Unknown mission';
  end case;
  v_key:='mission:'||p_mission_id||':'||to_char(now() at time zone 'Australia/Sydney','YYYY-MM-DD');
  if exists(select 1 from public.mathsexpress_reward_events where user_id=v_uid and event_key=v_key) then
    return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',true);
  end if;
  if v_progress<v_target then
    raise exception 'Mission not complete yet (% of % recorded today)', v_progress, v_target;
  end if;
  insert into public.mathsexpress_reward_events(user_id,event_key,event_type,coins,xp,game_time_seconds)
  values(v_uid,v_key,'mission',v_coins,v_xp,0) on conflict do nothing;
  get diagnostics v_inserted=row_count;
  if v_inserted=1 then
    update public.account_profiles set coins=least(2000000,coins+v_coins), xp=least(2000000000,xp+v_xp) where user_id=v_uid;
    return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',false);
  end if;
  return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',true);
end $$;

-- ---------------------------------------------------------------------------------------------
-- Reviewed Question Studio (human-authored questions) on the existing custom-question table
-- ---------------------------------------------------------------------------------------------
alter table public.mathsexpress_custom_questions
  add column if not exists year_level integer,
  add column if not exists strand text,
  add column if not exists skill_id text,
  add column if not exists worked_solution text,
  add column if not exists source_label text,
  add column if not exists review_status text not null default 'draft',
  add column if not exists reviewed_by uuid,
  add column if not exists reviewed_at timestamptz;
do $$ begin
  alter table public.mathsexpress_custom_questions add constraint mathsexpress_custom_questions_review_status_check
    check (review_status in ('draft','review','published','archived'));
exception when duplicate_object then null; end $$;

create or replace function private.mx_is_question_reviewer() returns boolean
language sql stable security definer set search_path='public','private','pg_temp' as $$
  select coalesce(private.mx_active_role() in ('owner','admin','content_editor'),false)
$$;

create or replace function private.mx_can_see_authored(q public.mathsexpress_custom_questions) returns boolean
language sql stable security definer set search_path='public','private','pg_temp' as $$
  select q.created_by=auth.uid() or private.mx_is_question_reviewer()
      or (q.school_id is not null and private.mathrift_school_role(q.school_id) is not null)
$$;

create or replace function public.mathsexpress_save_authored_question(
  p_school_id uuid, p_year_level integer, p_strand text, p_topic text, p_skill_id text, p_difficulty text,
  p_question_type text, p_prompt text, p_answer jsonb, p_worked_solution text, p_source_label text,
  p_submit_for_review boolean)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare v_id bigint; v_answer text; v_type text;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if coalesce(private.mx_active_role(),'') not in ('teacher','admin','owner','content_editor') then
    raise exception 'Teacher or content editor access required';
  end if;
  if p_school_id is not null and private.mathrift_school_role(p_school_id) is null and not public.mathsexpress_is_platform_admin() then
    raise exception 'School staff access required';
  end if;
  if char_length(trim(coalesce(p_prompt,'')))<5 then raise exception 'Write the question prompt'; end if;
  v_answer:=trim(coalesce(case jsonb_typeof(p_answer) when 'object' then p_answer->>'value' when 'string' then p_answer#>>'{}' else p_answer::text end,''));
  if v_answer='' then raise exception 'An answer is required'; end if;
  if p_year_level is not null and p_year_level not between 0 and 12 then raise exception 'Year level must be K-12'; end if;
  v_type:=case p_question_type when 'numeric' then 'numeric' when 'multiple-choice' then 'multiple-choice'
                               when 'graph' then 'graph' else 'written' end;
  insert into public.mathsexpress_custom_questions(school_id,class_id,created_by,prompt,question_type,options,answer,topic,difficulty,favourite,
      year_level,strand,skill_id,worked_solution,source_label,review_status)
  values(p_school_id,null,auth.uid(),left(trim(p_prompt),1500),v_type,'[]'::jsonb,left(v_answer,500),
      left(coalesce(nullif(trim(p_topic),''),'Mathematics'),100),
      case when p_difficulty in ('easy','medium','hard') then p_difficulty else 'medium' end,false,
      p_year_level,left(nullif(trim(coalesce(p_strand,'')),''),80),left(nullif(trim(coalesce(p_skill_id,'')),''),120),
      left(nullif(trim(coalesce(p_worked_solution,'')),''),4000),left(nullif(trim(coalesce(p_source_label,'')),''),200),
      case when coalesce(p_submit_for_review,false) then 'review' else 'draft' end)
  returning id into v_id;
  return jsonb_build_object('ok',true,'id',v_id,'status',case when coalesce(p_submit_for_review,false) then 'review' else 'draft' end);
end $$;

create or replace function public.mathsexpress_list_authored_questions(p_school_id uuid, p_status text, p_limit integer)
returns table(id bigint, school_id uuid, prompt text, question_type text, answer text, topic text, strand text, skill_id text,
              year_level integer, difficulty text, worked_solution text, source_label text, status text,
              author_name text, created_by uuid, created_at timestamptz, reviewed_at timestamptz)
language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_school_id is not null and private.mathrift_school_role(p_school_id) is null and not private.mx_is_question_reviewer() then
    raise exception 'School staff access required';
  end if;
  return query
  select q.id,q.school_id,q.prompt,q.question_type,q.answer,q.topic,q.strand,q.skill_id,q.year_level,q.difficulty,
         q.worked_solution,q.source_label,q.review_status,coalesce(ap.display_name,'Author'),q.created_by,q.created_at,q.reviewed_at
  from public.mathsexpress_custom_questions q
  left join public.account_profiles ap on ap.user_id=q.created_by
  where private.mx_can_see_authored(q)
    and (p_school_id is null or q.school_id=p_school_id)
    and (case when p_status is null then q.review_status<>'archived' else q.review_status=p_status end)
  order by q.created_at desc
  limit greatest(1,least(coalesce(p_limit,80),300));
end $$;

create or replace function public.mathsexpress_authored_question_stats(p_school_id uuid)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare r jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_school_id is not null and private.mathrift_school_role(p_school_id) is null and not private.mx_is_question_reviewer() then
    raise exception 'School staff access required';
  end if;
  select jsonb_build_object(
    'published',count(*) filter (where q.review_status='published'),
    'review',count(*) filter (where q.review_status='review'),
    'draft',count(*) filter (where q.review_status='draft'),
    'archived',count(*) filter (where q.review_status='archived'),
    'total',count(*) filter (where q.review_status<>'archived'))
  into r
  from public.mathsexpress_custom_questions q
  where private.mx_can_see_authored(q) and (p_school_id is null or q.school_id=p_school_id);
  return r;
end $$;

create or replace function public.mathsexpress_review_authored_question(p_question_id bigint, p_status text)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not private.mx_is_question_reviewer() then raise exception 'Reviewer access required (Owner, Admin or Content editor)'; end if;
  if p_status not in ('draft','review','published','archived') then raise exception 'Unsupported status'; end if;
  update public.mathsexpress_custom_questions
     set review_status=p_status, reviewed_by=auth.uid(), reviewed_at=now(), updated_at=now()
   where id=p_question_id;
  if not found then raise exception 'Question not found'; end if;
  insert into public.mathsexpress_audit_log(actor_user_id,action,target,details)
  values(auth.uid(),'review-authored-question',p_question_id::text,jsonb_build_object('status',p_status));
  return jsonb_build_object('ok',true,'id',p_question_id,'status',p_status);
end $$;

-- ---------------------------------------------------------------------------------------------
-- Task reports: per-question results from real answers (latest answer per student per question)
-- ---------------------------------------------------------------------------------------------
create or replace function private.mx_assert_assignment_teacher(p_assignment_id uuid) returns uuid
language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare v_class uuid;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select class_id into v_class from public.mathrift_assignments where id=p_assignment_id;
  if v_class is null then raise exception 'Assignment not found'; end if;
  if not private.mathrift_teaches(v_class) and not private.mathrift_is_owner() then raise exception 'Teacher access required'; end if;
  return v_class;
end $$;

create or replace function public.mathsexpress_task_question_report(p_assignment_id uuid)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare r jsonb;
begin
  perform private.mx_assert_assignment_teacher(p_assignment_id);
  with latest as (
    select distinct on (qa.student_id,qa.question_id) qa.*
    from public.mathrift_question_attempts qa
    where qa.assignment_id=p_assignment_id
    order by qa.student_id,qa.question_id,qa.created_at desc
  ), st as (
    select l.*, case when l.correct then 'correct' when l.partial then 'partial' else 'incorrect' end status from latest l
  )
  select jsonb_build_object(
    'questions',coalesce((select jsonb_agg(q order by q->>'question_id') from (
        select jsonb_build_object('question_id',question_id,'attempts',count(*),
          'correct',count(*) filter (where status='correct'),'partial',count(*) filter (where status='partial'),
          'incorrect',count(*) filter (where status='incorrect'),
          'average_score',round(avg(case when score_possible>0 then 100*score_awarded/score_possible end),1)) q
        from st group by question_id) s),'[]'::jsonb),
    'grid',coalesce((select jsonb_agg(jsonb_build_object('student_id',st.student_id,'display_name',coalesce(ap.display_name,'Student'),
          'question_id',st.question_id,'status',st.status,'score_awarded',st.score_awarded,'score_possible',st.score_possible))
        from st left join public.account_profiles ap on ap.user_id=st.student_id),'[]'::jsonb))
  into r;
  return r;
end $$;

create or replace function public.mathsexpress_task_question_detail(p_assignment_id uuid, p_question_id text)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
begin
  perform private.mx_assert_assignment_teacher(p_assignment_id);
  return coalesce((select jsonb_agg(x order by x->>'display_name') from (
    select distinct on (qa.student_id) jsonb_build_object('student_id',qa.student_id,'display_name',coalesce(ap.display_name,'Student'),
      'answer_text',qa.answer_text,'correct',qa.correct,'partial',qa.partial,'score_awarded',qa.score_awarded,
      'score_possible',qa.score_possible,'time_seconds',qa.time_seconds,'feedback',qa.feedback,
      'marking_rationale',qa.marking_rationale,'working',qa.working,'retries',qa.retries,'answered_at',qa.created_at) x
    from public.mathrift_question_attempts qa left join public.account_profiles ap on ap.user_id=qa.student_id
    where qa.assignment_id=p_assignment_id and qa.question_id=p_question_id
    order by qa.student_id, qa.created_at desc) d),'[]'::jsonb);
end $$;

-- Reassign = a fresh copy of the task (same questions, settings and targets) with a new due date.
create or replace function public.mathsexpress_reassign_assignment(p_assignment_id uuid, p_due_at timestamptz, p_title text)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare a public.mathrift_assignments; v_new uuid:=gen_random_uuid();
begin
  perform private.mx_assert_assignment_teacher(p_assignment_id);
  if p_due_at is null or p_due_at<=now() then raise exception 'Choose a due date in the future'; end if;
  select * into a from public.mathrift_assignments where id=p_assignment_id;
  a.id:=v_new; a.created_by:=auth.uid(); a.start_at:=now(); a.due_at:=p_due_at; a.created_at:=now(); a.updated_at:=now();
  a.title:=left(coalesce(nullif(trim(p_title),''),a.title),160); a.results_released:=false;
  insert into public.mathrift_assignments select a.*;
  insert into public.mathrift_assignment_targets(assignment_id,student_id)
    select v_new,student_id from public.mathrift_assignment_targets where assignment_id=p_assignment_id;
  insert into public.mathsexpress_audit_log(actor_user_id,action,target,details)
  values(auth.uid(),'reassign-assignment',p_assignment_id::text,jsonb_build_object('new_assignment_id',v_new,'due_at',p_due_at));
  return jsonb_build_object('ok',true,'id',v_new,'due_at',p_due_at);
end $$;

-- ---------------------------------------------------------------------------------------------
-- School reports
-- ---------------------------------------------------------------------------------------------
create or replace function private.mx_assert_school_leader(p_school_id uuid) returns void
language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not (public.mathsexpress_is_platform_admin() or private.mathrift_school_can_create_classes(p_school_id)) then
    raise exception 'School leadership access required';
  end if;
end $$;

create or replace function private.mx_class_engagement(p_school_id uuid, p_start timestamptz, p_end timestamptz)
returns table(class_id uuid, name text, year_level integer, students integer, active_students integer, questions bigint,
              correct bigint, active_seconds bigint, accuracy numeric, completion numeric, avg_score numeric)
language sql stable security definer set search_path='public','private','pg_temp' as $$
  select c.id, coalesce(c.display_name,c.name), c.year_level,
    (select count(*) from public.mathrift_class_members m where m.class_id=c.id)::int,
    (select count(distinct a.student_id) from public.mathrift_activity a where a.class_id=c.id and a.occurred_at between p_start and p_end)::int,
    coalesce((select sum(a.questions) from public.mathrift_activity a where a.class_id=c.id and a.occurred_at between p_start and p_end),0),
    coalesce((select sum(a.correct) from public.mathrift_activity a where a.class_id=c.id and a.occurred_at between p_start and p_end),0),
    coalesce((select sum(a.active_seconds) from public.mathrift_activity a where a.class_id=c.id and a.occurred_at between p_start and p_end),0),
    coalesce((select round(100.0*sum(a.correct)/nullif(sum(a.questions),0),1) from public.mathrift_activity a where a.class_id=c.id and a.occurred_at between p_start and p_end),0),
    -- completion: completed (student, task) pairs over assigned pairs, for tasks due/created in range
    coalesce((select round(100.0*count(distinct (t.aid,t.sid)) filter (where t.done)/nullif(count(distinct (t.aid,t.sid)),0),1) from (
        select asg.id aid, m.student_id sid,
               exists(select 1 from public.mathrift_assignment_attempts at where at.assignment_id=asg.id and at.student_id=m.student_id and at.completed_at is not null) done
        from public.mathrift_assignments asg join public.mathrift_class_members m on m.class_id=asg.class_id
        where asg.class_id=c.id and coalesce(asg.due_at,asg.created_at) between p_start and p_end
          and (not exists(select 1 from public.mathrift_assignment_targets tg where tg.assignment_id=asg.id)
               or exists(select 1 from public.mathrift_assignment_targets tg where tg.assignment_id=asg.id and tg.student_id=m.student_id))) t),0),
    coalesce((select round(avg(at.score_percent),1) from public.mathrift_assignment_attempts at join public.mathrift_assignments asg on asg.id=at.assignment_id
              where asg.class_id=c.id and at.completed_at between p_start and p_end),0)
  from public.mathrift_classes c
  where c.school_id=p_school_id and not c.archived
$$;

create or replace function public.mathsexpress_school_usage_dashboard(p_school_id uuid, p_start_at timestamptz, p_end_at timestamptz)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare v_start timestamptz:=coalesce(p_start_at,now()-interval '30 days'); v_end timestamptz:=coalesce(p_end_at,now()); r jsonb;
begin
  perform private.mx_assert_school_leader(p_school_id);
  if v_end<v_start or v_end-v_start>interval '400 days' then raise exception 'Choose a range of up to one year'; end if;
  select jsonb_build_object(
    'start_at',v_start,'end_at',v_end,
    'counts',jsonb_build_object(
      'students',(select count(*) from public.mathrift_school_students s where s.school_id=p_school_id),
      'active_students',(select count(distinct a.student_id) from public.mathrift_activity a join public.mathrift_classes c on c.id=a.class_id
                          where c.school_id=p_school_id and a.occurred_at between v_start and v_end),
      'questions',coalesce((select sum(a.questions) from public.mathrift_activity a join public.mathrift_classes c on c.id=a.class_id
                          where c.school_id=p_school_id and a.occurred_at between v_start and v_end),0),
      'active_seconds',coalesce((select sum(a.active_seconds) from public.mathrift_activity a join public.mathrift_classes c on c.id=a.class_id
                          where c.school_id=p_school_id and a.occurred_at between v_start and v_end),0)),
    'daily',coalesce((select jsonb_agg(jsonb_build_object('activity_day',d.day,'questions',d.q,'active_students',d.s) order by d.day) from (
        select (a.occurred_at at time zone 'Australia/Sydney')::date as day, sum(a.questions) q, count(distinct a.student_id) s
        from public.mathrift_activity a join public.mathrift_classes c on c.id=a.class_id
        where c.school_id=p_school_id and a.occurred_at between v_start and v_end group by 1) d),'[]'::jsonb),
    'classes',coalesce((select jsonb_agg(to_jsonb(e) order by e.name) from private.mx_class_engagement(p_school_id,v_start,v_end) e),'[]'::jsonb))
  into r;
  return r;
end $$;

create or replace function public.mathsexpress_engagement_class_comparison(p_school_id uuid, p_start_at timestamptz, p_end_at timestamptz)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare v_start timestamptz:=coalesce(p_start_at,now()-interval '30 days'); v_end timestamptz:=coalesce(p_end_at,now());
        v_weeks numeric; r jsonb;
begin
  perform private.mx_assert_school_leader(p_school_id);
  if v_end<v_start or v_end-v_start>interval '400 days' then raise exception 'Choose a range of up to one year'; end if;
  v_weeks:=greatest(1,extract(epoch from (v_end-v_start))/604800.0);
  -- Transparent formula: participation = % of students active; practice = questions per student per week
  -- against a target of 20 (same threshold as the Engagement Compass), capped at 100.
  select jsonb_build_object('start_at',v_start,'end_at',v_end,'practice_target_per_week',20,
    'classes',coalesce(jsonb_agg(to_jsonb(e) || jsonb_build_object(
        'participation',case when e.students>0 then round(100.0*e.active_students/e.students,1) else 0 end,
        'practice',case when e.students>0 then least(100,round(100.0*e.questions/e.students/v_weeks/20,1)) else 0 end)
      order by e.name),'[]'::jsonb))
  into r from private.mx_class_engagement(p_school_id,v_start,v_end) e;
  return r;
end $$;

create or replace function public.mathsexpress_standards_growth(p_school_id uuid, p_start_at timestamptz, p_end_at timestamptz, p_year_level integer)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare v_start timestamptz:=coalesce(p_start_at,now()-interval '90 days'); v_end timestamptz:=coalesce(p_end_at,now()); r jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if private.mathrift_school_role(p_school_id) is null and not public.mathsexpress_is_platform_admin() then
    raise exception 'School staff access required';
  end if;
  with students as (
    select s.student_id from public.mathrift_school_students s
    where s.school_id=p_school_id and (p_year_level is null or s.year_level=p_year_level)
  ), ev as (
    select e.user_id,e.skill_id,
           (array_agg(e.theta_before order by e.created_at asc))[1] t0,
           (array_agg(e.theta_after order by e.created_at desc))[1] t1
    from public.mathsexpress_irt_events e join students st on st.student_id=e.user_id
    where e.created_at between v_start and v_end
    group by e.user_id,e.skill_id
  )
  select jsonb_build_object('start_at',v_start,'end_at',v_end,'year_level',p_year_level,
    'skills',coalesce(jsonb_agg(jsonb_build_object('skill_id',x.skill_id,'students',x.n,
       'start_proficiency',x.p0,'end_proficiency',x.p1,'growth',round(x.p1-x.p0,1)) order by (x.p1-x.p0) desc),'[]'::jsonb))
  into r from (
    select skill_id, count(*) n, round(avg(private.mx_mastery(t0)),1) p0, round(avg(private.mx_mastery(t1)),1) p1
    from ev group by skill_id) x;
  return r;
end $$;

create or replace function public.mathsexpress_school_standards_proficiency(p_school_id uuid)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare r jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if private.mathrift_school_role(p_school_id) is null and not public.mathsexpress_is_platform_admin() then
    raise exception 'School staff access required';
  end if;
  with st as (
    select s.user_id,s.skill_id,private.mx_mastery(s.theta) m
    from public.mathsexpress_irt_skill_state s
    join public.mathrift_school_students ss on ss.student_id=s.user_id and ss.school_id=p_school_id
  )
  select jsonb_build_object(
    'students',(select count(distinct user_id) from st),
    'average_mastery',coalesce((select round(avg(m),1) from st),0),
    'skills',coalesce((select jsonb_agg(jsonb_build_object('skill_id',skill_id,'students',n,'average_mastery',am,
                         'secure',sec) order by skill_id) from (
        select skill_id,count(*) n,round(avg(m),1) am,count(*) filter (where m>=80) sec from st group by skill_id) k),'[]'::jsonb))
  into r;
  return r;
end $$;

-- ---------------------------------------------------------------------------------------------
-- Parent email outbox (queued in the database; the Worker sends through Resend when configured)
-- ---------------------------------------------------------------------------------------------
create table if not exists public.mathsexpress_parent_email_outbox (
  id bigint generated always as identity primary key,
  school_id uuid not null references public.mathrift_schools(id) on delete cascade,
  student_id uuid not null,
  kind text not null check (kind in ('teacher-message','progress-report')),
  body text,
  status text not null default 'queued' check (status in ('queued','sent','failed')),
  attempts integer not null default 0,
  last_error text,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create index if not exists mathsexpress_parent_email_outbox_creator_idx on public.mathsexpress_parent_email_outbox(created_by,created_at desc);
alter table public.mathsexpress_parent_email_outbox enable row level security;
revoke all on public.mathsexpress_parent_email_outbox from public, anon, authenticated;

create or replace function private.mx_guardian_recipients(p_school_id uuid, p_student_id uuid) returns jsonb
language sql stable security definer set search_path='public','pg_temp' as $$
  select coalesce(jsonb_agg(distinct jsonb_build_object('email',lower(l.guardian_email),'name',l.guardian_name)),'[]'::jsonb)
  from public.mathsexpress_parent_links l
  where l.student_id=p_student_id and l.school_id=p_school_id and l.status<>'revoked' and position('@' in l.guardian_email)>1
$$;

create or replace function public.mathsexpress_teacher_parent_message_email_payload(p_school_id uuid, p_student_id uuid, p_body text)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not private.mx_can_contact_guardians(p_school_id,p_student_id) then raise exception 'Teacher access required'; end if;
  if char_length(trim(coalesce(p_body,'')))=0 then raise exception 'Message cannot be empty'; end if;
  return jsonb_build_object('kind','teacher-message',
    'student_name',(select coalesce(display_name,'Student') from public.account_profiles where user_id=p_student_id),
    'teacher_name',(select coalesce(display_name,'A teacher') from public.account_profiles where user_id=auth.uid()),
    'school_name',(select coalesce(display_name,name) from public.mathrift_schools where id=p_school_id),
    'body',left(trim(p_body),2000),
    'recipients',private.mx_guardian_recipients(p_school_id,p_student_id));
end $$;

create or replace function public.mathsexpress_parent_progress_email_payload(p_school_id uuid, p_student_id uuid)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare v_since timestamptz:=now()-interval '30 days';
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not private.mx_can_contact_guardians(p_school_id,p_student_id) then raise exception 'Teacher access required'; end if;
  return jsonb_build_object('kind','progress-report','period_days',30,
    'student_name',(select coalesce(display_name,'Student') from public.account_profiles where user_id=p_student_id),
    'school_name',(select coalesce(display_name,name) from public.mathrift_schools where id=p_school_id),
    'weekly_points',(select coalesce(weekly_points,0) from public.account_profiles where user_id=p_student_id),
    'assignments',(select jsonb_build_object('started',count(distinct assignment_id),
                      'completed',count(distinct assignment_id) filter (where completed_at is not null),
                      'average_score',coalesce(round(avg(score_percent) filter (where completed_at is not null),1),0))
                   from public.mathrift_assignment_attempts where student_id=p_student_id and started_at>=v_since),
    'questions',(select jsonb_build_object('attempted',coalesce(sum(questions),0),'correct',coalesce(sum(correct),0))
                 from public.mathrift_activity where student_id=p_student_id and occurred_at>=v_since),
    'weak_skills',coalesce((select jsonb_agg(jsonb_build_object('skill_id',skill_id,'mastery',m) order by m) from (
        select skill_id,private.mx_mastery(theta) m from public.mathsexpress_irt_skill_state
        where user_id=p_student_id and evidence_count>=3 and private.mx_mastery(theta)<60
        order by theta asc limit 5) w),'[]'::jsonb),
    'recipients',private.mx_guardian_recipients(p_school_id,p_student_id));
end $$;

create or replace function public.mathsexpress_queue_parent_email(p_school_id uuid, p_student_id uuid, p_kind text, p_body text)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare v_id bigint;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_kind not in ('teacher-message','progress-report') then raise exception 'Unsupported parent email type'; end if;
  if not private.mx_can_contact_guardians(p_school_id,p_student_id) then raise exception 'Teacher access required'; end if;
  if p_kind='teacher-message' and char_length(trim(coalesce(p_body,'')))=0 then raise exception 'Message cannot be empty'; end if;
  if jsonb_array_length(private.mx_guardian_recipients(p_school_id,p_student_id))=0 then
    raise exception 'No parent or guardian email is linked to this student';
  end if;
  if (select count(*) from public.mathsexpress_parent_email_outbox where created_by=auth.uid() and created_at>now()-interval '1 hour')>=60 then
    raise exception 'Too many parent emails in the last hour';
  end if;
  insert into public.mathsexpress_parent_email_outbox(school_id,student_id,kind,body,created_by)
  values(p_school_id,p_student_id,p_kind,case when p_kind='teacher-message' then left(trim(p_body),2000) end,auth.uid())
  returning id into v_id;
  if p_kind='teacher-message' then
    insert into public.mathsexpress_parent_messages(school_id,student_id,sender_user_id,sender_role,body)
    values(p_school_id,p_student_id,auth.uid(),'teacher',left(trim(p_body),2000));
  end if;
  return jsonb_build_object('ok',true,'id',v_id,'outbox_id',v_id,'status','queued');
end $$;

create or replace function private.mx_outbox_row_for_staff(p_outbox_id bigint) returns public.mathsexpress_parent_email_outbox
language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare o public.mathsexpress_parent_email_outbox;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select * into o from public.mathsexpress_parent_email_outbox where id=p_outbox_id;
  if not found then raise exception 'Queued email not found'; end if;
  if o.created_by<>auth.uid() and not private.mathrift_is_owner() and not private.mathrift_school_can_manage_students(o.school_id) then
    raise exception 'Teacher access required';
  end if;
  return o;
end $$;

create or replace function public.mathsexpress_parent_email_outbox_payload(p_outbox_id bigint)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare o public.mathsexpress_parent_email_outbox;
begin
  o:=private.mx_outbox_row_for_staff(p_outbox_id);
  if o.status='sent' then raise exception 'This email was already sent'; end if;
  if o.kind='teacher-message' then
    return public.mathsexpress_teacher_parent_message_email_payload(o.school_id,o.student_id,o.body) || jsonb_build_object('outbox_id',o.id);
  end if;
  return public.mathsexpress_parent_progress_email_payload(o.school_id,o.student_id) || jsonb_build_object('outbox_id',o.id);
end $$;

create or replace function public.mathsexpress_mark_parent_email_outbox(p_outbox_id bigint, p_status text, p_error text)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare o public.mathsexpress_parent_email_outbox;
begin
  o:=private.mx_outbox_row_for_staff(p_outbox_id);
  if p_status not in ('sent','failed') then raise exception 'Unsupported status'; end if;
  update public.mathsexpress_parent_email_outbox
     set status=p_status, attempts=attempts+1, last_error=case when p_status='failed' then left(p_error,500) end,
         sent_at=case when p_status='sent' then now() else sent_at end
   where id=o.id;
  return jsonb_build_object('ok',true,'id',o.id,'status',p_status);
end $$;

create or replace function public.mathsexpress_my_parent_email_outbox(p_limit integer)
returns table(id bigint, school_id uuid, student_id uuid, student_name text, email_kind text, status text,
              attempts integer, last_error text, created_at timestamptz, sent_at timestamptz)
language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  return query
  select o.id,o.school_id,o.student_id,coalesce(ap.display_name,'Student'),o.kind,o.status,o.attempts,o.last_error,o.created_at,o.sent_at
  from public.mathsexpress_parent_email_outbox o left join public.account_profiles ap on ap.user_id=o.student_id
  where o.created_by=auth.uid()
  order by o.created_at desc limit greatest(1,least(coalesce(p_limit,20),100));
end $$;

-- ---------------------------------------------------------------------------------------------
-- Canvas grade passback: mappings + a real queue of completed attempts. The Worker only sends when
-- the deployment has Canvas credentials; nothing here claims a grade was sent.
-- ---------------------------------------------------------------------------------------------
create table if not exists public.mathsexpress_canvas_grade_queue (
  id bigint generated always as identity primary key,
  school_id uuid not null,
  assignment_id uuid not null references public.mathrift_assignments(id) on delete cascade,
  student_id uuid not null,
  attempt_id uuid not null,
  score_percent numeric not null,
  status text not null default 'queued' check (status in ('queued','sent','failed')),
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (assignment_id, student_id)
);
alter table public.mathsexpress_canvas_grade_queue enable row level security;
revoke all on public.mathsexpress_canvas_grade_queue from public, anon, authenticated;

create or replace function public.mathsexpress_save_canvas_assignment_map(p_assignment_id uuid, p_course_id text, p_canvas_assignment_id text, p_auto boolean)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare v_class uuid; v_school uuid;
begin
  v_class:=private.mx_assert_assignment_teacher(p_assignment_id);
  select school_id into v_school from public.mathrift_classes where id=v_class;
  if trim(coalesce(p_course_id,''))!~'^[0-9]{1,20}$' or trim(coalesce(p_canvas_assignment_id,''))!~'^[0-9]{1,20}$' then
    raise exception 'Canvas course and assignment IDs are numbers';
  end if;
  delete from public.mathsexpress_canvas_assignment_map where assignment_id=p_assignment_id;
  insert into public.mathsexpress_canvas_assignment_map(school_id,assignment_id,canvas_course_id,canvas_assignment_id,pushed_at,pushed_by,metadata)
  values(v_school,p_assignment_id,trim(p_course_id),trim(p_canvas_assignment_id),now(),auth.uid(),jsonb_build_object('auto',coalesce(p_auto,true)));
  return jsonb_build_object('ok',true);
end $$;

create or replace function public.mathsexpress_save_canvas_user_map(p_school_id uuid, p_student_id uuid, p_canvas_user_id text)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not private.mx_can_contact_guardians(p_school_id,p_student_id) then raise exception 'Teacher access required'; end if;
  if trim(coalesce(p_canvas_user_id,''))!~'^[0-9]{1,20}$' then raise exception 'Canvas user IDs are numbers'; end if;
  delete from public.mathsexpress_external_roster_map
   where school_id=p_school_id and provider='canvas' and entity_type='student' and (local_id=p_student_id or external_id=trim(p_canvas_user_id));
  insert into public.mathsexpress_external_roster_map(school_id,provider,entity_type,external_id,local_id,metadata,updated_at)
  values(p_school_id,'canvas','student',trim(p_canvas_user_id),p_student_id,jsonb_build_object('mapped_by',auth.uid()),now());
  return jsonb_build_object('ok',true);
end $$;

create or replace function public.mathsexpress_canvas_grade_queue(p_school_id uuid, p_limit integer)
returns table(id bigint, assignment_id uuid, assignment_title text, student_id uuid, student_name text, score_percent numeric,
              status text, attempts integer, last_error text, canvas_course_id text, canvas_assignment_id text, canvas_user_id text,
              updated_at timestamptz)
language plpgsql security definer set search_path='public','private','pg_temp' as $$
#variable_conflict use_column
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if private.mathrift_school_role(p_school_id) is null and not private.mathrift_is_owner() then raise exception 'School staff access required'; end if;
  -- Queue the latest completed attempt for each mapped (assignment, student). A newer attempt re-queues.
  insert into public.mathsexpress_canvas_grade_queue(school_id,assignment_id,student_id,attempt_id,score_percent)
  select distinct on (at.assignment_id,at.student_id) p_school_id,at.assignment_id,at.student_id,at.id,at.score_percent
  from public.mathsexpress_canvas_assignment_map am
  join public.mathrift_assignment_attempts at on at.assignment_id=am.assignment_id and at.completed_at is not null
  join public.mathsexpress_external_roster_map um on um.school_id=p_school_id and um.provider='canvas' and um.entity_type='student' and um.local_id=at.student_id
  where am.school_id=p_school_id and coalesce((am.metadata->>'auto')::boolean,true)
  order by at.assignment_id,at.student_id,at.completed_at desc
  on conflict (assignment_id,student_id) do update
    set attempt_id=excluded.attempt_id,score_percent=excluded.score_percent,status='queued',attempts=0,last_error=null,updated_at=now()
    where mathsexpress_canvas_grade_queue.attempt_id<>excluded.attempt_id;
  return query
  select q.id,q.assignment_id,a.title,q.student_id,coalesce(ap.display_name,'Student'),q.score_percent,q.status,q.attempts,q.last_error,
         am.canvas_course_id,am.canvas_assignment_id,um.external_id,q.updated_at
  from public.mathsexpress_canvas_grade_queue q
  join public.mathrift_assignments a on a.id=q.assignment_id
  join public.mathsexpress_canvas_assignment_map am on am.assignment_id=q.assignment_id
  left join public.mathsexpress_external_roster_map um on um.school_id=q.school_id and um.provider='canvas' and um.entity_type='student' and um.local_id=q.student_id
  left join public.account_profiles ap on ap.user_id=q.student_id
  where q.school_id=p_school_id
  order by (q.status='sent'), q.updated_at desc
  limit greatest(1,least(coalesce(p_limit,100),500));
end $$;

create or replace function public.mathsexpress_mark_canvas_grade_queue(p_queue_id bigint, p_status text, p_error text)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare v_school uuid;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select school_id into v_school from public.mathsexpress_canvas_grade_queue where id=p_queue_id;
  if v_school is null then raise exception 'Queue item not found'; end if;
  if private.mathrift_school_role(v_school) is null and not private.mathrift_is_owner() then raise exception 'School staff access required'; end if;
  if p_status not in ('sent','failed') then raise exception 'Unsupported status'; end if;
  update public.mathsexpress_canvas_grade_queue
     set status=p_status,attempts=attempts+1,last_error=case when p_status='failed' then left(p_error,500) end,
         sent_at=case when p_status='sent' then now() else sent_at end,updated_at=now()
   where id=p_queue_id;
  return jsonb_build_object('ok',true);
end $$;

-- ---------------------------------------------------------------------------------------------
-- Grants: authenticated only, never anon/public
-- ---------------------------------------------------------------------------------------------
do $$
declare f text;
begin
  foreach f in array array[
    'mathsexpress_owner_adjust_user_rewards(uuid,integer,integer,integer)',
    'mathsexpress_owner_update_user_profile(uuid,text,text,integer)',
    'mathsexpress_claim_daily_mission(text)',
    'mathsexpress_save_authored_question(uuid,integer,text,text,text,text,text,text,jsonb,text,text,boolean)',
    'mathsexpress_list_authored_questions(uuid,text,integer)',
    'mathsexpress_authored_question_stats(uuid)',
    'mathsexpress_review_authored_question(bigint,text)',
    'mathsexpress_task_question_report(uuid)',
    'mathsexpress_task_question_detail(uuid,text)',
    'mathsexpress_reassign_assignment(uuid,timestamptz,text)',
    'mathsexpress_school_usage_dashboard(uuid,timestamptz,timestamptz)',
    'mathsexpress_engagement_class_comparison(uuid,timestamptz,timestamptz)',
    'mathsexpress_standards_growth(uuid,timestamptz,timestamptz,integer)',
    'mathsexpress_school_standards_proficiency(uuid)',
    'mathsexpress_teacher_parent_message_email_payload(uuid,uuid,text)',
    'mathsexpress_parent_progress_email_payload(uuid,uuid)',
    'mathsexpress_queue_parent_email(uuid,uuid,text,text)',
    'mathsexpress_parent_email_outbox_payload(bigint)',
    'mathsexpress_mark_parent_email_outbox(bigint,text,text)',
    'mathsexpress_my_parent_email_outbox(integer)',
    'mathsexpress_save_canvas_assignment_map(uuid,text,text,boolean)',
    'mathsexpress_save_canvas_user_map(uuid,uuid,text)',
    'mathsexpress_canvas_grade_queue(uuid,integer)',
    'mathsexpress_mark_canvas_grade_queue(bigint,text,text)'
  ] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
revoke all on function private.mx_active_role() from public, anon;
notify pgrst, 'reload schema';
