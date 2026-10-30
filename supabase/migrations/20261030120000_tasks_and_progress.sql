-- MathsExpress 2.0: the learning catalogue, saved lesson progress and teacher-set tasks.
--
-- Security model (the same as accounts_and_classes)
-- * Tables have row-level security and no direct access for the app's roles. Everything goes
--   through the functions below, which check the caller, their role and their class.
-- * Answers are checked here, against answers stored here, so a student cannot mark work as done
--   without solving it, and teachers only ever see results the server verified.
-- * Teachers see tasks and results only for classes they teach, and only for students currently
--   in those classes. Nothing exposes email addresses.

-- ===========================================================================================
-- Learning catalogue: what can be learned and assigned
-- ===========================================================================================

create table public.learning_content (
  id text primary key,
  -- Only 'lesson' is published today. The other kinds are reserved so that practice sets,
  -- worksheets and tests can be added later without changing tasks or progress.
  kind text not null,
  title text not null,
  strand text not null,
  topic text not null,
  year_level public.year_level not null,
  question_count integer not null,
  estimated_minutes integer not null,
  available boolean not null default true,
  constraint learning_content_id_valid check (id ~ '^[a-z0-9-]{1,60}$'),
  constraint learning_content_kind_valid check (kind in ('lesson', 'practice', 'worksheet', 'test')),
  constraint learning_content_counts_valid check (question_count > 0 and estimated_minutes > 0)
);

comment on table public.learning_content is
  'Published learning content. Must match src/domain/learning.ts; tests/db/progress.test.ts checks this.';

create table public.learning_questions (
  content_id text not null references public.learning_content (id) on delete cascade,
  question_id text not null,
  position smallint not null,
  answer numeric not null,
  primary key (content_id, question_id),
  unique (content_id, position)
);

comment on table public.learning_questions is
  'Each question''s correct answer, so answers are marked on the server. Never readable by the app.';

insert into public.learning_content
  (id, kind, title, strand, topic, year_level, question_count, estimated_minutes)
values
  ('linear-equations-basics', 'lesson', 'Solving linear equations', 'Number and Algebra',
   'Linear equations', 9, 5, 10);

insert into public.learning_questions (content_id, question_id, position, answer)
values
  ('linear-equations-basics', 'eq-1', 1, 5),
  ('linear-equations-basics', 'eq-2', 2, 5),
  ('linear-equations-basics', 'eq-3', 3, -3),
  ('linear-equations-basics', 'eq-4', 4, 5),
  ('linear-equations-basics', 'eq-5', 5, -4);

-- ===========================================================================================
-- Saved progress
-- ===========================================================================================

create table public.lesson_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  content_id text not null references public.learning_content (id),
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  -- Set by the server when every question has been answered correctly.
  completed_at timestamptz
);

comment on table public.lesson_attempts is
  'One go at a lesson. Practising again starts a new attempt, so earlier results are kept.';

create index lesson_attempts_student_content_idx
  on public.lesson_attempts (student_id, content_id, started_at desc);

create table public.attempt_questions (
  attempt_id uuid not null references public.lesson_attempts (id) on delete cascade,
  question_id text not null,
  tries smallint not null default 0,
  hints_used smallint not null default 0,
  first_try_correct boolean not null,
  solved_at timestamptz,
  primary key (attempt_id, question_id),
  constraint attempt_questions_counts_valid check (tries >= 0 and hints_used between 0 and 10)
);

comment on table public.attempt_questions is
  'How each question went in an attempt: tries, hints, whether the first try was right, when solved.';

-- ===========================================================================================
-- Tasks
-- ===========================================================================================

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  created_by uuid references public.profiles (id) on delete set null,
  title text not null,
  instructions text,
  content_id text not null references public.learning_content (id),
  -- 'class' follows the class as students join and leave; 'students' is a fixed selection.
  assign_to text not null,
  status text not null default 'draft',
  due_at timestamptz not null,
  -- Sent by the app with each new task, so a double-submitted form creates it only once.
  request_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint tasks_title_valid check (char_length(title) between 1 and 80 and title = btrim(title)),
  constraint tasks_instructions_valid
    check (instructions is null or char_length(instructions) between 1 and 500),
  constraint tasks_assign_to_valid check (assign_to in ('class', 'students')),
  constraint tasks_status_valid check (status in ('draft', 'published')),
  constraint tasks_published_valid
    check ((status = 'published') = (published_at is not null)),
  constraint tasks_request_unique unique (created_by, request_id)
);

comment on table public.tasks is 'Work a teacher sets for a class or for chosen students in it.';

create index tasks_class_due_idx on public.tasks (class_id, due_at);

create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function private.set_updated_at();

create table public.task_students (
  task_id uuid not null references public.tasks (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  primary key (task_id, student_id)
);

comment on table public.task_students is 'The chosen students for tasks set to selected students.';

create index task_students_student_idx on public.task_students (student_id);

alter table public.learning_content enable row level security;
alter table public.learning_questions enable row level security;
alter table public.lesson_attempts enable row level security;
alter table public.attempt_questions enable row level security;
alter table public.tasks enable row level security;
alter table public.task_students enable row level security;

revoke all on public.learning_content, public.learning_questions, public.lesson_attempts,
  public.attempt_questions, public.tasks, public.task_students from public, anon, authenticated;

-- ===========================================================================================
-- Helpers
-- ===========================================================================================

-- A task the caller teaches, locked for changes, or 'task_not_found' (also for other teachers'
-- tasks, so they cannot learn that a task exists).
create function private.require_task_teacher(target_task uuid) returns public.tasks
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result public.tasks;
begin
  perform private.require_teacher();
  select t.* into result
  from public.tasks t
  join public.class_teachers ct on ct.class_id = t.class_id and ct.teacher_id = auth.uid()
  where t.id = target_task;
  if not found then
    perform private.fail('task_not_found');
  end if;
  return result;
end;
$$;

-- Whether a task is set for a student: published, the student is in its class, and either the
-- whole class or this student was chosen.
create function private.task_assigned_to(target_task public.tasks, target_student uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select target_task.status = 'published'
    and exists (
      select 1 from public.class_members m
      where m.class_id = target_task.class_id and m.student_id = target_student
    )
    and (
      target_task.assign_to = 'class'
      or exists (
        select 1 from public.task_students s
        where s.task_id = target_task.id and s.student_id = target_student
      )
    );
$$;

-- A student may open content for a year level a teacher gave them, or that is set as a task.
create function private.student_can_open(target_student uuid, target_content text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.learning_content c
    where c.id = target_content
      and c.available
      and (
        exists (
          select 1 from public.class_members m
          where m.student_id = target_student and m.year_level = c.year_level
        )
        or exists (
          select 1 from public.tasks t
          where t.content_id = c.id and private.task_assigned_to(t, target_student)
        )
      )
  );
$$;

-- How a student is doing with a task: only work started after the task was published counts.
create type public.task_status as enum ('not_started', 'in_progress', 'completed');

create function private.task_result(target_task public.tasks, target_student uuid)
returns table (
  status public.task_status,
  completed_at timestamptz,
  last_activity_at timestamptz,
  questions_solved integer,
  first_try_correct integer
)
language sql
stable
security definer
set search_path = ''
as $$
  with best as (
    -- The finished attempt if there is one, otherwise the most recent one.
    select a.*
    from public.lesson_attempts a
    where a.student_id = target_student
      and a.content_id = target_task.content_id
      and a.started_at >= target_task.published_at
    order by a.completed_at is null, a.completed_at, a.last_activity_at desc
    limit 1
  )
  select
    case
      when b.id is null then 'not_started'::public.task_status
      when b.completed_at is not null then 'completed'::public.task_status
      else 'in_progress'::public.task_status
    end,
    b.completed_at,
    b.last_activity_at,
    coalesce((select count(*)::integer from public.attempt_questions q
              where q.attempt_id = b.id and q.solved_at is not null), 0),
    coalesce((select count(*)::integer from public.attempt_questions q
              where q.attempt_id = b.id and q.first_try_correct), 0)
  from (select 1) as one
  left join best b on true;
$$;

-- ===========================================================================================
-- Read models
-- ===========================================================================================

create type public.learning_item as (
  id text,
  kind text,
  title text,
  strand text,
  topic text,
  year_level smallint,
  question_count integer,
  estimated_minutes integer
);

create type public.teacher_task as (
  id uuid,
  class_id uuid,
  class_name text,
  title text,
  instructions text,
  content_id text,
  content_title text,
  content_kind text,
  status text,
  assign_to text,
  due_at timestamptz,
  created_at timestamptz,
  published_at timestamptz,
  assigned_count integer,
  completed_count integer,
  in_progress_count integer
);

create type public.task_student_result as (
  student_id uuid,
  first_name text,
  last_name text,
  status public.task_status,
  completed_at timestamptz,
  last_activity_at timestamptz,
  questions_solved integer,
  first_try_correct integer,
  question_count integer
);

create type public.student_task as (
  id uuid,
  class_id uuid,
  class_name text,
  title text,
  instructions text,
  content_id text,
  content_title text,
  content_kind text,
  topic text,
  question_count integer,
  estimated_minutes integer,
  due_at timestamptz,
  published_at timestamptz,
  status public.task_status,
  completed_at timestamptz,
  questions_solved integer
);

-- The students a task is set for (empty for drafts).
create function private.task_students_view(target_task public.tasks)
returns table (student_id uuid, first_name text, last_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select m.student_id, p.first_name, p.last_name
  from public.class_members m
  join public.profiles p on p.id = m.student_id
  where m.class_id = target_task.class_id
    and target_task.status = 'published'
    and (
      target_task.assign_to = 'class'
      or exists (
        select 1 from public.task_students s
        where s.task_id = target_task.id and s.student_id = m.student_id
      )
    );
$$;

create function private.teacher_task_view(target_task uuid) returns public.teacher_task
language sql
stable
security definer
set search_path = ''
as $$
  select
    t.id, t.class_id, c.name, t.title, t.instructions, t.content_id, lc.title, lc.kind,
    t.status, t.assign_to, t.due_at, t.created_at, t.published_at,
    (select count(*)::integer from private.task_students_view(t)),
    (select count(*)::integer from private.task_students_view(t) s
       cross join lateral private.task_result(t, s.student_id) r
       where r.status = 'completed'),
    (select count(*)::integer from private.task_students_view(t) s
       cross join lateral private.task_result(t, s.student_id) r
       where r.status = 'in_progress')
  from public.tasks t
  join public.classes c on c.id = t.class_id
  join public.learning_content lc on lc.id = t.content_id
  where t.id = target_task;
$$;

-- ===========================================================================================
-- Catalogue
-- ===========================================================================================

-- What teachers can assign, and students can learn. Signed-in people only.
create function public.learning_catalogue()
returns setof public.learning_item
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.current_profile();
  return query
    select c.id, c.kind, c.title, c.strand, c.topic, c.year_level::smallint,
      c.question_count, c.estimated_minutes
    from public.learning_content c
    where c.available
    order by c.year_level, c.strand, c.title;
end;
$$;

-- ===========================================================================================
-- Teacher task functions
-- ===========================================================================================

create function public.create_task(
  class_id uuid,
  title text,
  content_id text,
  due_at timestamptz,
  request_id uuid,
  instructions text default null,
  student_ids uuid[] default null,
  publish boolean default true
)
returns public.teacher_task
language plpgsql
security definer
set search_path = ''
as $$
declare
  teacher uuid := private.require_class_teacher(create_task.class_id);
  clean_title text := private.clean_text(create_task.title, 80);
  clean_instructions text := nullif(btrim(coalesce(create_task.instructions, '')), '');
  existing uuid;
  created uuid;
  chosen uuid[];
begin
  if create_task.request_id is null then
    perform private.fail('invalid_request');
  end if;

  -- The same form sent twice: return the task it already made.
  select t.id into existing
  from public.tasks t
  where t.created_by = teacher and t.request_id = create_task.request_id;
  if found then
    return private.teacher_task_view(existing);
  end if;

  if clean_title is null then
    perform private.fail('invalid_task_title');
  end if;
  if clean_instructions is not null and char_length(clean_instructions) > 500 then
    perform private.fail('invalid_instructions');
  end if;
  if not exists (
    select 1 from public.learning_content c
    where c.id = create_task.content_id and c.available and c.kind = 'lesson'
  ) then
    perform private.fail('content_unavailable');
  end if;
  if create_task.due_at is null or create_task.due_at <= now()
    or create_task.due_at > now() + interval '1 year' then
    perform private.fail('invalid_due_date');
  end if;

  if create_task.student_ids is not null then
    select array_agg(distinct s) into chosen from unnest(create_task.student_ids) as s;
    if chosen is null
      or exists (
        select 1 from unnest(chosen) as s
        where not exists (
          select 1 from public.class_members m
          where m.class_id = create_task.class_id and m.student_id = s
        )
      ) then
      perform private.fail('invalid_students');
    end if;
  end if;

  insert into public.tasks
    (class_id, created_by, title, instructions, content_id, assign_to, status, due_at,
     request_id, published_at)
  values
    (create_task.class_id, teacher, clean_title, clean_instructions, create_task.content_id,
     case when chosen is null then 'class' else 'students' end,
     case when create_task.publish then 'published' else 'draft' end,
     create_task.due_at, create_task.request_id,
     case when create_task.publish then now() end)
  returning id into created;

  if chosen is not null then
    insert into public.task_students (task_id, student_id)
    select created, s from unnest(chosen) as s;
  end if;

  return private.teacher_task_view(created);
end;
$$;

-- Publishes a draft, so its students can see it. The due date must still be in the future.
create function public.publish_task(task_id uuid)
returns public.teacher_task
language plpgsql
security definer
set search_path = ''
as $$
declare
  target public.tasks := private.require_task_teacher(publish_task.task_id);
begin
  if target.status = 'published' then
    perform private.fail('task_already_published');
  end if;
  if target.due_at <= now() then
    perform private.fail('invalid_due_date');
  end if;
  update public.tasks t set status = 'published', published_at = now()
  where t.id = target.id;
  return private.teacher_task_view(target.id);
end;
$$;

-- Moves the due date, e.g. to give the class more time.
create function public.set_task_due_date(task_id uuid, due_at timestamptz)
returns public.teacher_task
language plpgsql
security definer
set search_path = ''
as $$
declare
  target public.tasks := private.require_task_teacher(set_task_due_date.task_id);
begin
  if set_task_due_date.due_at is null or set_task_due_date.due_at <= now()
    or set_task_due_date.due_at > now() + interval '1 year' then
    perform private.fail('invalid_due_date');
  end if;
  update public.tasks t set due_at = set_task_due_date.due_at where t.id = target.id;
  return private.teacher_task_view(target.id);
end;
$$;

-- Deletes a task. Students' saved lesson progress is kept; only the task goes.
create function public.delete_task(task_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target public.tasks := private.require_task_teacher(delete_task.task_id);
begin
  delete from public.tasks t where t.id = target.id;
end;
$$;

-- The teacher's tasks: one class's, or all their classes' when class_id is null.
create function public.teacher_tasks(class_id uuid default null)
returns setof public.teacher_task
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if teacher_tasks.class_id is not null then
    perform private.require_class_teacher(teacher_tasks.class_id);
  else
    perform private.require_teacher();
  end if;
  return query
    select v.*
    from public.tasks t
    join public.class_teachers ct on ct.class_id = t.class_id and ct.teacher_id = auth.uid()
    cross join lateral private.teacher_task_view(t.id) as v
    where teacher_tasks.class_id is null or t.class_id = teacher_tasks.class_id
    order by t.status = 'published', t.due_at, t.created_at;
end;
$$;

create function public.get_task(task_id uuid)
returns public.teacher_task
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_task_teacher(get_task.task_id);
  return private.teacher_task_view(get_task.task_id);
end;
$$;

-- Each assigned student's progress on a task, with only results the server marked.
create function public.task_results(task_id uuid)
returns setof public.task_student_result
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  target public.tasks := private.require_task_teacher(task_results.task_id);
begin
  return query
    select s.student_id, s.first_name, s.last_name, r.status, r.completed_at,
      r.last_activity_at, r.questions_solved, r.first_try_correct, c.question_count
    from private.task_students_view(target) s
    cross join lateral private.task_result(target, s.student_id) r
    join public.learning_content c on c.id = target.content_id
    order by s.last_name, s.first_name;
end;
$$;

-- Who a draft or selected-students task was set for, so the teacher can see the choice.
create function public.task_chosen_students(task_id uuid)
returns setof uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_task_teacher(task_chosen_students.task_id);
  return query
    select s.student_id from public.task_students s where s.task_id = task_chosen_students.task_id;
end;
$$;

-- ===========================================================================================
-- Student functions
-- ===========================================================================================

-- The student's published tasks in every class they belong to, with their progress.
create function public.my_tasks()
returns setof public.student_task
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  student uuid := private.require_student();
begin
  return query
    select t.id, t.class_id, c.name, t.title, t.instructions, t.content_id, lc.title, lc.kind,
      lc.topic, lc.question_count, lc.estimated_minutes, t.due_at, t.published_at,
      r.status, r.completed_at, r.questions_solved
    from public.tasks t
    join public.classes c on c.id = t.class_id
    join public.learning_content lc on lc.id = t.content_id
    cross join lateral private.task_result(t, student) r
    where private.task_assigned_to(t, student)
    order by r.status = 'completed', t.due_at;
end;
$$;

-- Starts a fresh go at a lesson the student is allowed to open, and returns its id.
create function public.start_lesson_attempt(content_id text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  student uuid := private.require_student();
  created uuid;
begin
  if not private.student_can_open(student, start_lesson_attempt.content_id) then
    perform private.fail('content_unavailable');
  end if;
  insert into public.lesson_attempts (student_id, content_id)
  values (student, start_lesson_attempt.content_id)
  returning id into created;
  return created;
end;
$$;

-- Marks one answer on the server and saves how it went. Answering a solved question again
-- changes nothing, so a resent request cannot inflate tries or results.
create function public.record_answer(
  attempt_id uuid,
  question_id text,
  answer text,
  hints_used integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  student uuid := private.require_student();
  attempt public.lesson_attempts;
  expected numeric;
  cleaned text := replace(btrim(coalesce(record_answer.answer, '')), '−', '-');
  is_correct boolean;
  row_state public.attempt_questions;
  remaining integer;
begin
  select a.* into attempt
  from public.lesson_attempts a
  where a.id = record_answer.attempt_id and a.student_id = student
  for update;
  if not found then
    perform private.fail('attempt_not_found');
  end if;

  select q.answer into expected
  from public.learning_questions q
  where q.content_id = attempt.content_id and q.question_id = record_answer.question_id;
  if not found then
    perform private.fail('question_not_found');
  end if;

  if cleaned !~ '^[+-]?([0-9]+(\.[0-9]+)?|\.[0-9]+)$' or char_length(cleaned) > 20 then
    perform private.fail('invalid_answer');
  end if;
  is_correct := cleaned::numeric = expected;

  select q.* into row_state
  from public.attempt_questions q
  where q.attempt_id = attempt.id and q.question_id = record_answer.question_id;

  if found and row_state.solved_at is not null then
    return jsonb_build_object('correct', is_correct, 'alreadySolved', true,
      'completed', attempt.completed_at is not null);
  end if;

  insert into public.attempt_questions
    (attempt_id, question_id, tries, hints_used, first_try_correct, solved_at)
  values
    (attempt.id, record_answer.question_id, 1,
     least(greatest(coalesce(record_answer.hints_used, 0), 0), 10),
     is_correct, case when is_correct then now() end)
  on conflict on constraint attempt_questions_pkey do update
    set tries = least(public.attempt_questions.tries + 1, 32000),
        hints_used = greatest(public.attempt_questions.hints_used, excluded.hints_used),
        solved_at = case when is_correct then now() end;

  select count(*)::integer into remaining
  from public.learning_questions q
  where q.content_id = attempt.content_id
    and not exists (
      select 1 from public.attempt_questions aq
      where aq.attempt_id = attempt.id and aq.question_id = q.question_id
        and aq.solved_at is not null
    );

  update public.lesson_attempts a
  set last_activity_at = now(),
      completed_at = case when remaining = 0 then coalesce(a.completed_at, now()) else a.completed_at end
  where a.id = attempt.id;

  return jsonb_build_object('correct', is_correct, 'alreadySolved', false,
    'completed', remaining = 0);
end;
$$;

-- ===========================================================================================
-- Permissions
-- ===========================================================================================

revoke all on all functions in schema private from public, anon, authenticated;
revoke all on function
  public.learning_catalogue(),
  public.create_task(uuid, text, text, timestamptz, uuid, text, uuid[], boolean),
  public.publish_task(uuid),
  public.set_task_due_date(uuid, timestamptz),
  public.delete_task(uuid),
  public.teacher_tasks(uuid),
  public.get_task(uuid),
  public.task_results(uuid),
  public.task_chosen_students(uuid),
  public.my_tasks(),
  public.start_lesson_attempt(text),
  public.record_answer(uuid, text, text, integer)
from public, anon;
grant execute on function
  public.learning_catalogue(),
  public.create_task(uuid, text, text, timestamptz, uuid, text, uuid[], boolean),
  public.publish_task(uuid),
  public.set_task_due_date(uuid, timestamptz),
  public.delete_task(uuid),
  public.teacher_tasks(uuid),
  public.get_task(uuid),
  public.task_results(uuid),
  public.task_chosen_students(uuid),
  public.my_tasks(),
  public.start_lesson_attempt(text),
  public.record_answer(uuid, text, text, integer)
to authenticated;
