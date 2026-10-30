-- MathsExpress 2.0: teacher reports, built only from saved lesson attempts that the server marked.
--
-- Every function checks that the caller teaches the class, and reports only on students who are
-- in that class now. Periods filter attempts by their last activity and tasks by their due date;
-- a null bound means "no limit".

create type public.student_progress_summary as (
  student_id uuid,
  first_name text,
  last_name text,
  year_level smallint,
  lessons_completed integer,
  questions_answered integer,
  first_try_correct integer,
  hints_used integer,
  tasks_assigned integer,
  tasks_completed integer,
  last_active_at timestamptz
);

create type public.student_attempt_result as (
  attempt_id uuid,
  content_id text,
  content_title text,
  strand text,
  topic text,
  started_at timestamptz,
  last_activity_at timestamptz,
  completed_at timestamptz,
  question_count integer,
  questions_answered integer,
  first_try_correct integer,
  hints_used integer
);

create type public.topic_progress as (
  content_id text,
  content_title text,
  strand text,
  topic text,
  class_size integer,
  students_started integer,
  students_completed integer,
  questions_answered integer,
  first_try_correct integer
);

create type public.recent_completion as (
  student_id uuid,
  first_name text,
  last_name text,
  class_id uuid,
  class_name text,
  content_title text,
  completed_at timestamptz,
  question_count integer,
  first_try_correct integer
);

-- The attempts a class's current students made in a period.
create function private.class_attempts(target_class uuid, since timestamptz, until timestamptz)
returns setof public.lesson_attempts
language sql
stable
security definer
set search_path = ''
as $$
  select a.*
  from public.lesson_attempts a
  join public.class_members m on m.student_id = a.student_id and m.class_id = target_class
  where (since is null or a.last_activity_at >= since)
    and (until is null or a.last_activity_at < until);
$$;

-- Each current student's learning in the class for the period.
create function public.class_progress(
  class_id uuid,
  since timestamptz default null,
  until timestamptz default null
)
returns setof public.student_progress_summary
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_class_teacher(class_progress.class_id);
  return query
    with attempts as (
      select * from private.class_attempts(class_progress.class_id, class_progress.since,
        class_progress.until)
    ),
    answers as (
      select a.student_id, q.*
      from attempts a
      join public.attempt_questions q on q.attempt_id = a.id
    ),
    class_tasks as (
      select t.*
      from public.tasks t
      where t.class_id = class_progress.class_id
        and t.status = 'published'
        and (class_progress.since is null or t.due_at >= class_progress.since)
        and (class_progress.until is null or t.due_at < class_progress.until)
    )
    select
      m.student_id, p.first_name, p.last_name, m.year_level::smallint,
      (select count(distinct a.content_id)::integer from attempts a
         where a.student_id = m.student_id and a.completed_at is not null),
      (select count(*)::integer from answers x where x.student_id = m.student_id),
      (select count(*)::integer from answers x
         where x.student_id = m.student_id and x.first_try_correct),
      (select coalesce(sum(x.hints_used), 0)::integer from answers x
         where x.student_id = m.student_id),
      (select count(*)::integer from class_tasks t
         where private.task_assigned_to(t, m.student_id)),
      (select count(*)::integer from class_tasks t
         cross join lateral private.task_result(t, m.student_id) r
         where private.task_assigned_to(t, m.student_id) and r.status = 'completed'),
      (select max(a.last_activity_at) from attempts a where a.student_id = m.student_id)
    from public.class_members m
    join public.profiles p on p.id = m.student_id
    where m.class_id = class_progress.class_id
    order by p.last_name, p.first_name;
end;
$$;

-- One current student's attempts in the period, newest first.
create function public.student_results(
  class_id uuid,
  student_id uuid,
  since timestamptz default null,
  until timestamptz default null
)
returns setof public.student_attempt_result
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_class_teacher(student_results.class_id);
  if not exists (
    select 1 from public.class_members m
    where m.class_id = student_results.class_id and m.student_id = student_results.student_id
  ) then
    perform private.fail('student_not_found');
  end if;
  return query
    select
      a.id, a.content_id, c.title, c.strand, c.topic, a.started_at, a.last_activity_at,
      a.completed_at, c.question_count,
      (select count(*)::integer from public.attempt_questions q where q.attempt_id = a.id),
      (select count(*)::integer from public.attempt_questions q
         where q.attempt_id = a.id and q.first_try_correct),
      (select coalesce(sum(q.hints_used), 0)::integer from public.attempt_questions q
         where q.attempt_id = a.id)
    from public.lesson_attempts a
    join public.learning_content c on c.id = a.content_id
    where a.student_id = student_results.student_id
      and (student_results.since is null or a.last_activity_at >= student_results.since)
      and (student_results.until is null or a.last_activity_at < student_results.until)
      -- Attempts with no answers say nothing about learning.
      and exists (select 1 from public.attempt_questions q where q.attempt_id = a.id)
    order by a.last_activity_at desc;
end;
$$;

-- For each lesson the class has worked on in the period: how many started and finished it.
create function public.class_topic_progress(
  class_id uuid,
  since timestamptz default null,
  until timestamptz default null
)
returns setof public.topic_progress
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_class_teacher(class_topic_progress.class_id);
  return query
    with attempts as (
      select * from private.class_attempts(class_topic_progress.class_id,
        class_topic_progress.since, class_topic_progress.until)
    )
    select
      c.id, c.title, c.strand, c.topic,
      (select count(*)::integer from public.class_members m
         where m.class_id = class_topic_progress.class_id),
      (select count(distinct a.student_id)::integer from attempts a
         where a.content_id = c.id
           and exists (select 1 from public.attempt_questions q where q.attempt_id = a.id)),
      (select count(distinct a.student_id)::integer from attempts a
         where a.content_id = c.id and a.completed_at is not null),
      (select count(*)::integer from attempts a
         join public.attempt_questions q on q.attempt_id = a.id where a.content_id = c.id),
      (select count(*)::integer from attempts a
         join public.attempt_questions q on q.attempt_id = a.id
         where a.content_id = c.id and q.first_try_correct)
    from public.learning_content c
    where exists (
      select 1 from attempts a
      join public.attempt_questions q on q.attempt_id = a.id
      where a.content_id = c.id
    )
    order by c.year_level, c.strand, c.title;
end;
$$;

-- The latest lessons finished by students in any of the teacher's classes.
create function public.recent_completions(max_rows integer default 6)
returns setof public.recent_completion
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  teacher uuid := private.require_teacher();
begin
  return query
    select
      a.student_id, p.first_name, p.last_name, m.class_id, cl.name, c.title, a.completed_at,
      c.question_count,
      (select count(*)::integer from public.attempt_questions q
         where q.attempt_id = a.id and q.first_try_correct)
    from public.lesson_attempts a
    join public.class_members m on m.student_id = a.student_id
    join public.class_teachers ct on ct.class_id = m.class_id and ct.teacher_id = teacher
    join public.classes cl on cl.id = m.class_id
    join public.profiles p on p.id = a.student_id
    join public.learning_content c on c.id = a.content_id
    where a.completed_at is not null
    order by a.completed_at desc
    limit least(greatest(coalesce(recent_completions.max_rows, 6), 1), 20);
end;
$$;

revoke all on function private.class_attempts(uuid, timestamptz, timestamptz)
  from public, anon, authenticated;
revoke all on function
  public.class_progress(uuid, timestamptz, timestamptz),
  public.student_results(uuid, uuid, timestamptz, timestamptz),
  public.class_topic_progress(uuid, timestamptz, timestamptz),
  public.recent_completions(integer)
from public, anon;
grant execute on function
  public.class_progress(uuid, timestamptz, timestamptz),
  public.student_results(uuid, uuid, timestamptz, timestamptz),
  public.class_topic_progress(uuid, timestamptz, timestamptz),
  public.recent_completions(integer)
to authenticated;
