-- MathsExpress Learning Engagement Compass RPC.
--
-- deploy-app.js (openLearningEngagementCompass) calls
-- public.mathsexpress_engagement_scatter(p_class_id, p_start_at, p_end_at),
-- but the function has never existed. PostgREST answers with "Could not find
-- the function public.mathsexpress_engagement_scatter(p_class_id, p_end_at,
-- p_start_at) in the schema cache", which teachers see as "Engagement report
-- unavailable". The same missing function is why the Compass modal sat on its
-- spinner: the call rejected and the modal was never replaced.
--
-- Returns {"students": [...]} because the client reads data.students and then
-- plots weekly_questions on x and skill_gains_per_week on y.
--
-- Everything below is computed from columns that exist today:
--   mathrift_activity        questions, correct, active_seconds, occurred_at
--   mathrift_skill_mastery   mastery, evidence_count, last_worked_at
--   mathrift_assignments     class_id
--   mathrift_assignment_targets  assignment_id, student_id
-- Assignment scores are not stored anywhere, so task completion and average
-- score are derived from assignment-linked activity rather than invented.

create or replace function public.mathsexpress_engagement_scatter(
  p_class_id uuid,
  p_start_at timestamptz default (now() - interval '30 days'),
  p_end_at timestamptz default now()
)
returns jsonb
language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare
  v_start timestamptz := least(coalesce(p_start_at, now() - interval '30 days'), coalesce(p_end_at, now()));
  v_end timestamptz := greatest(coalesce(p_end_at, now()), coalesce(p_start_at, now() - interval '30 days'));
  v_weeks numeric;
  v_students jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not (private.mathrift_is_owner() or private.mathrift_teaches(p_class_id)) then
    raise exception 'Teacher access required';
  end if;

  -- A window shorter than a week would inflate the per-week rates.
  v_weeks := greatest(1.0, extract(epoch from (v_end - v_start)) / 604800.0);

  with members as (
    select m.student_id
    from public.mathrift_class_members m
    where m.class_id = p_class_id
  ),
  activity as (
    select
      a.student_id,
      sum(a.questions)::numeric as questions,
      sum(a.correct)::numeric as correct,
      sum(a.active_seconds)::numeric as active_seconds,
      count(distinct (a.occurred_at at time zone 'UTC')::date) as active_days
    from public.mathrift_activity a
    join members mm on mm.student_id = a.student_id
    where a.class_id = p_class_id
      and a.occurred_at >= v_start
      and a.occurred_at <= v_end
    group by a.student_id
  ),
  -- A skill counts as secure at 100; gains are the secure skills last worked
  -- inside the window, which is the only dated evidence the table carries.
  mastery as (
    select
      s.student_id,
      count(*) filter (where s.mastery >= 100) as secure_skills,
      count(*) filter (where s.mastery >= 100
                         and s.last_worked_at >= v_start
                         and s.last_worked_at <= v_end) as secure_in_window
    from public.mathrift_skill_mastery s
    join members mm on mm.student_id = s.student_id
    group by s.student_id
  ),
  -- Assigned work: targeted assignments where present, otherwise everything
  -- set for the class.
  assigned as (
    select mm.student_id, count(distinct asg.id) as assigned_count
    from members mm
    join public.mathrift_assignments asg on asg.class_id = p_class_id
    left join public.mathrift_assignment_targets t on t.assignment_id = asg.id
    where t.assignment_id is null or t.student_id = mm.student_id
    group by mm.student_id
  ),
  attempted as (
    select
      a.student_id,
      count(distinct a.assignment_id) as attempted_count,
      sum(a.questions)::numeric as task_questions,
      sum(a.correct)::numeric as task_correct
    from public.mathrift_activity a
    join members mm on mm.student_id = a.student_id
    where a.class_id = p_class_id
      and a.assignment_id is not null
      and a.occurred_at >= v_start
      and a.occurred_at <= v_end
    group by a.student_id
  ),
  rows as (
    select
      mm.student_id,
      coalesce(p.display_name, p.email, 'Student') as display_name,
      coalesce(act.questions, 0) as questions,
      coalesce(act.correct, 0) as correct,
      coalesce(act.active_seconds, 0) as active_seconds,
      coalesce(act.active_days, 0) as active_days,
      coalesce(m.secure_skills, 0) as secure_skills,
      round(coalesce(act.questions, 0) / v_weeks, 2) as weekly_questions,
      round(coalesce(m.secure_in_window, 0) / v_weeks, 2) as skill_gains_per_week,
      case when coalesce(act.questions, 0) > 0
           then round(coalesce(act.correct, 0) * 100.0 / act.questions, 1)
           else 0 end as accuracy,
      case when coalesce(asg.assigned_count, 0) > 0
           then round(least(coalesce(att.attempted_count, 0), asg.assigned_count) * 100.0 / asg.assigned_count, 1)
           else 0 end as completion,
      case when coalesce(att.task_questions, 0) > 0
           then round(att.task_correct * 100.0 / att.task_questions, 1)
           else 0 end as avg_score
    from members mm
    left join public.account_profiles p on p.user_id = mm.student_id
    left join activity act on act.student_id = mm.student_id
    left join mastery m on m.student_id = mm.student_id
    left join assigned asg on asg.student_id = mm.student_id
    left join attempted att on att.student_id = mm.student_id
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'student_id', r.student_id,
      'display_name', r.display_name,
      -- Thresholds are deliberate and stated in the UI: 20 questions a week is
      -- sustained effort, half a secure skill a week is real progress.
      'profile', case
        when r.questions = 0 or r.active_days = 0 then 'Inactive'
        when r.skill_gains_per_week >= 0.5 and r.weekly_questions >= 20 then 'Persevering'
        when r.skill_gains_per_week >= 0.5 then 'Efficient'
        when r.weekly_questions >= 20 then 'Struggling'
        else 'Sporadic'
      end,
      'weekly_questions', r.weekly_questions,
      'skill_gains_per_week', r.skill_gains_per_week,
      'accuracy', r.accuracy,
      'questions', r.questions,
      'secure_skills', r.secure_skills,
      'active_days', r.active_days,
      'active_seconds', r.active_seconds,
      'completion', r.completion,
      'avg_score', r.avg_score
    )
    order by r.weekly_questions desc, r.display_name
  ), '[]'::jsonb)
  into v_students
  from rows r;

  return jsonb_build_object(
    'students', v_students,
    'class_id', p_class_id,
    'start_at', v_start,
    'end_at', v_end,
    'weeks', round(v_weeks, 2)
  );
end $$;

grant execute on function public.mathsexpress_engagement_scatter(uuid, timestamptz, timestamptz) to authenticated;
