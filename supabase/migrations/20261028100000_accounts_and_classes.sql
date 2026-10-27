-- MathsExpress 2.0: accounts, classes, class membership, teacher permissions and year levels.
--
-- Security model
-- * Every table has row-level security, and the app's database roles (anon, authenticated) have
--   no direct table access except reading their own profile.
-- * All reads and writes go through the functions at the end of this file. Each one checks the
--   caller (auth.uid()), their role and their permission for the class on the server, so hiding
--   a button in the interface is never the only protection.
-- * Errors are raised with a short code as the message (for example 'already_member'); the app
--   turns each code into a friendly sentence.
-- * Students never see join codes, other students or anyone's email address. Teachers see only
--   the names and year levels of students in their own classes.

-- ===========================================================================================
-- Types
-- ===========================================================================================

create type public.account_role as enum ('student', 'teacher');

-- Teacher permissions within a class. 'co_teacher' is ready for shared classes later.
create type public.class_teacher_role as enum ('owner', 'co_teacher');

-- NSW school years: 0 is Kindergarten, 1 to 12 are Year 1 to Year 12.
create domain public.year_level as smallint check (value between 0 and 12);

-- Internal helpers live in a schema the API does not expose.
create schema private;

-- ===========================================================================================
-- Tables
-- ===========================================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.account_role not null,
  first_name text not null,
  last_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_first_name_valid
    check (char_length(first_name) between 1 and 50 and first_name = btrim(first_name)),
  constraint profiles_last_name_valid
    check (char_length(last_name) between 1 and 50 and last_name = btrim(last_name))
);

comment on table public.profiles is
  'One profile per account. The role is chosen once, when the profile is created, and cannot be changed by the user.';

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  year_level public.year_level not null,
  joining_enabled boolean not null default true,
  students_can_leave boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_name_valid check (char_length(name) between 1 and 60 and name = btrim(name))
);

comment on table public.classes is
  'A class run by one or more teachers. year_level is the level new students are given when they join.';

create table public.class_teachers (
  class_id uuid not null references public.classes (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  role public.class_teacher_role not null default 'owner',
  added_at timestamptz not null default now(),
  primary key (class_id, teacher_id)
);

comment on table public.class_teachers is 'Which teachers may manage which classes, and how.';

create index class_teachers_teacher_id_idx on public.class_teachers (teacher_id);
create unique index class_teachers_one_owner_idx on public.class_teachers (class_id)
  where role = 'owner';

create table public.class_join_codes (
  class_id uuid primary key references public.classes (id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now(),
  -- 8 characters from an alphabet without look-alikes (no I, L, O, 0 or 1).
  constraint class_join_codes_format check (code ~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$')
);

comment on table public.class_join_codes is
  'Join codes, kept apart from classes so that only the class''s teachers can ever read them.';

create table public.class_members (
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  year_level public.year_level not null,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

comment on table public.class_members is
  'Students in each class. year_level is set by the class''s teachers; students cannot change it.';

create index class_members_student_id_idx on public.class_members (student_id);

create table public.year_level_changes (
  id bigint generated always as identity primary key,
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  previous_year_level public.year_level not null,
  new_year_level public.year_level not null,
  changed_by uuid references public.profiles (id) on delete set null,
  changed_at timestamptz not null default now()
);

comment on table public.year_level_changes is 'Audit trail of every change to a student''s year level.';

create index year_level_changes_class_student_idx
  on public.year_level_changes (class_id, student_id);

-- ===========================================================================================
-- Timestamps
-- ===========================================================================================

create function private.set_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();

create trigger classes_set_updated_at before update on public.classes
  for each row execute function private.set_updated_at();

-- ===========================================================================================
-- Access control on tables
-- ===========================================================================================

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_teachers enable row level security;
alter table public.class_join_codes enable row level security;
alter table public.class_members enable row level security;
alter table public.year_level_changes enable row level security;

revoke all on public.profiles, public.classes, public.class_teachers, public.class_join_codes,
  public.class_members, public.year_level_changes from anon, authenticated;

-- The only direct table access: a signed-in user may read their own profile.
grant select on public.profiles to authenticated;

create policy "Users can read their own profile" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

-- ===========================================================================================
-- Internal helpers
-- ===========================================================================================

-- Raises a coded error that the app shows as a friendly message. It reads and changes no data,
-- so it may be called from stable helpers.
create function private.fail(code text) returns void
language plpgsql
stable
set search_path = ''
as $$
begin
  raise exception '%', code using errcode = 'P0001';
end;
$$;

-- The caller's profile, or an error when they are signed out or have not set up their profile.
create function private.current_profile() returns public.profiles
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result public.profiles;
begin
  if auth.uid() is null then
    perform private.fail('not_signed_in');
  end if;
  select * into result from public.profiles where id = auth.uid();
  if not found then
    perform private.fail('profile_required');
  end if;
  return result;
end;
$$;

create function private.require_teacher() returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (private.current_profile()).role <> 'teacher' then
    perform private.fail('teachers_only');
  end if;
  return auth.uid();
end;
$$;

create function private.require_student() returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (private.current_profile()).role <> 'student' then
    perform private.fail('students_only');
  end if;
  return auth.uid();
end;
$$;

-- Teachers who are not linked to a class get 'class_not_found', so they cannot even learn
-- whether another teacher's class exists.
create function private.require_class_teacher(target_class uuid) returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_teacher();
  if not exists (
    select 1 from public.class_teachers
    where class_id = target_class and teacher_id = auth.uid()
  ) then
    perform private.fail('class_not_found');
  end if;
  return auth.uid();
end;
$$;

-- Trims a name and collapses inner whitespace; returns null when it is empty or too long.
create function private.clean_text(value text, max_length integer) returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when cleaned = '' or char_length(cleaned) > max_length then null
    else cleaned
  end
  from (select regexp_replace(btrim(coalesce(value, '')), '\s+', ' ', 'g') as cleaned) as input;
$$;

create function private.require_year_level(value integer) returns smallint
language plpgsql
stable
set search_path = ''
as $$
begin
  if value is null or value < 0 or value > 12 then
    perform private.fail('invalid_year_level');
  end if;
  return value::smallint;
end;
$$;

-- A new, unused join code. Uses rejection sampling so every character is equally likely.
create function private.new_join_code() returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  alphabet_size constant integer := 31;
  usable_limit constant integer := 248; -- largest multiple of 31 below 256
  candidate text;
  random_bytes bytea;
  byte_value integer;
  byte_index integer;
begin
  loop
    candidate := '';
    while char_length(candidate) < 8 loop
      random_bytes := extensions.gen_random_bytes(16);
      byte_index := 0;
      while byte_index < 16 and char_length(candidate) < 8 loop
        byte_value := get_byte(random_bytes, byte_index);
        if byte_value < usable_limit then
          candidate := candidate || substr(alphabet, (byte_value % alphabet_size) + 1, 1);
        end if;
        byte_index := byte_index + 1;
      end loop;
    end loop;
    exit when not exists (select 1 from public.class_join_codes where code = candidate);
  end loop;
  return candidate;
end;
$$;

-- ===========================================================================================
-- Read models returned to the app
-- ===========================================================================================

create type public.teacher_class as (
  id uuid,
  name text,
  year_level smallint,
  join_code text,
  joining_enabled boolean,
  students_can_leave boolean,
  student_count integer,
  created_at timestamptz
);

create type public.student_class as (
  class_id uuid,
  class_name text,
  class_year_level smallint,
  my_year_level smallint,
  teacher_name text,
  students_can_leave boolean,
  joined_at timestamptz
);

create type public.class_student as (
  student_id uuid,
  first_name text,
  last_name text,
  year_level smallint,
  joined_at timestamptz
);

create function private.teacher_class_view(target_class uuid) returns public.teacher_class
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id, c.name, c.year_level::smallint, j.code, c.joining_enabled, c.students_can_leave,
    (select count(*)::integer from public.class_members m where m.class_id = c.id),
    c.created_at
  from public.classes c
  join public.class_join_codes j on j.class_id = c.id
  where c.id = target_class;
$$;

create function private.student_class_view(target_class uuid, target_student uuid)
returns public.student_class
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id, c.name, c.year_level::smallint, m.year_level::smallint,
    (
      select p.first_name || ' ' || p.last_name
      from public.class_teachers t
      join public.profiles p on p.id = t.teacher_id
      where t.class_id = c.id and t.role = 'owner'
    ),
    c.students_can_leave, m.joined_at
  from public.class_members m
  join public.classes c on c.id = m.class_id
  where m.class_id = target_class and m.student_id = target_student;
$$;

-- ===========================================================================================
-- Profile functions
-- ===========================================================================================

-- Creates the caller's profile. The role can be chosen only here, once.
create function public.complete_profile(role public.account_role, first_name text, last_name text)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_first text := private.clean_text(first_name, 50);
  clean_last text := private.clean_text(last_name, 50);
  result public.profiles;
begin
  if auth.uid() is null then
    perform private.fail('not_signed_in');
  end if;
  if complete_profile.role is null then
    perform private.fail('invalid_role');
  end if;
  if clean_first is null or clean_last is null then
    perform private.fail('invalid_name');
  end if;

  insert into public.profiles (id, role, first_name, last_name)
  values (auth.uid(), complete_profile.role, clean_first, clean_last)
  on conflict (id) do nothing
  returning * into result;

  if not found then
    perform private.fail('profile_exists');
  end if;
  return result;
end;
$$;

create function public.update_my_name(first_name text, last_name text)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_first text := private.clean_text(first_name, 50);
  clean_last text := private.clean_text(last_name, 50);
  result public.profiles;
begin
  perform private.current_profile();
  if clean_first is null or clean_last is null then
    perform private.fail('invalid_name');
  end if;
  update public.profiles
  set first_name = clean_first, last_name = clean_last
  where id = auth.uid()
  returning * into result;
  return result;
end;
$$;

-- ===========================================================================================
-- Teacher functions
-- ===========================================================================================

create function public.create_class(name text, year_level integer)
returns public.teacher_class
language plpgsql
security definer
set search_path = ''
as $$
declare
  teacher uuid := private.require_teacher();
  clean_name text := private.clean_text(name, 60);
  level smallint := private.require_year_level(year_level);
  new_class uuid;
begin
  if clean_name is null then
    perform private.fail('invalid_class_name');
  end if;

  insert into public.classes (name, year_level) values (clean_name, level)
  returning id into new_class;
  insert into public.class_teachers (class_id, teacher_id, role) values (new_class, teacher, 'owner');
  insert into public.class_join_codes (class_id, code) values (new_class, private.new_join_code());

  return private.teacher_class_view(new_class);
end;
$$;

create function public.teacher_classes()
returns setof public.teacher_class
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  teacher uuid := private.require_teacher();
begin
  return query
    select v.*
    from public.class_teachers t
    cross join lateral private.teacher_class_view(t.class_id) as v
    where t.teacher_id = teacher
    order by v.created_at desc;
end;
$$;

create function public.get_teacher_class(class_id uuid)
returns public.teacher_class
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_class_teacher(get_teacher_class.class_id);
  return private.teacher_class_view(get_teacher_class.class_id);
end;
$$;

-- Renames the class, changes its settings, or changes its year level. A new year level also
-- moves every student who was on the old class level; individually set levels are kept.
create function public.update_class(
  class_id uuid,
  name text,
  year_level integer,
  joining_enabled boolean,
  students_can_leave boolean
)
returns public.teacher_class
language plpgsql
security definer
set search_path = ''
as $$
declare
  teacher uuid := private.require_class_teacher(update_class.class_id);
  clean_name text := private.clean_text(update_class.name, 60);
  new_level smallint := private.require_year_level(update_class.year_level);
  old_level smallint;
begin
  if clean_name is null then
    perform private.fail('invalid_class_name');
  end if;
  if update_class.joining_enabled is null or update_class.students_can_leave is null then
    perform private.fail('invalid_settings');
  end if;

  select c.year_level into old_level from public.classes c where c.id = update_class.class_id
  for update;

  update public.classes c
  set
    name = clean_name,
    year_level = new_level,
    joining_enabled = update_class.joining_enabled,
    students_can_leave = update_class.students_can_leave
  where c.id = update_class.class_id;

  if new_level <> old_level then
    with moved as (
      update public.class_members m
      set year_level = new_level
      where m.class_id = update_class.class_id and m.year_level = old_level
      returning m.student_id
    )
    insert into public.year_level_changes
      (class_id, student_id, previous_year_level, new_year_level, changed_by)
    select update_class.class_id, moved.student_id, old_level, new_level, teacher from moved;
  end if;

  return private.teacher_class_view(update_class.class_id);
end;
$$;

-- Replaces the join code; the old code stops working immediately.
create function public.regenerate_join_code(class_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_code text;
begin
  perform private.require_class_teacher(regenerate_join_code.class_id);
  new_code := private.new_join_code();
  update public.class_join_codes j
  set code = new_code, created_at = now()
  where j.class_id = regenerate_join_code.class_id;
  return new_code;
end;
$$;

create function public.class_students(class_id uuid)
returns setof public.class_student
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform private.require_class_teacher(class_students.class_id);
  return query
    select m.student_id, p.first_name, p.last_name, m.year_level::smallint, m.joined_at
    from public.class_members m
    join public.profiles p on p.id = m.student_id
    where m.class_id = class_students.class_id
    order by p.last_name, p.first_name;
end;
$$;

create function public.set_student_year_level(class_id uuid, student_id uuid, year_level integer)
returns public.class_student
language plpgsql
security definer
set search_path = ''
as $$
declare
  teacher uuid := private.require_class_teacher(set_student_year_level.class_id);
  new_level smallint := private.require_year_level(set_student_year_level.year_level);
  old_level smallint;
  result public.class_student;
begin
  select m.year_level into old_level
  from public.class_members m
  where m.class_id = set_student_year_level.class_id
    and m.student_id = set_student_year_level.student_id
  for update;
  if not found then
    perform private.fail('student_not_found');
  end if;

  if new_level <> old_level then
    update public.class_members m
    set year_level = new_level
    where m.class_id = set_student_year_level.class_id
      and m.student_id = set_student_year_level.student_id;
    insert into public.year_level_changes
      (class_id, student_id, previous_year_level, new_year_level, changed_by)
    values
      (set_student_year_level.class_id, set_student_year_level.student_id, old_level, new_level, teacher);
  end if;

  select m.student_id, p.first_name, p.last_name, m.year_level::smallint, m.joined_at into result
  from public.class_members m
  join public.profiles p on p.id = m.student_id
  where m.class_id = set_student_year_level.class_id
    and m.student_id = set_student_year_level.student_id;
  return result;
end;
$$;

create function public.remove_student(class_id uuid, student_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_class_teacher(remove_student.class_id);
  delete from public.class_members m
  where m.class_id = remove_student.class_id and m.student_id = remove_student.student_id;
  if not found then
    perform private.fail('student_not_found');
  end if;
end;
$$;

-- ===========================================================================================
-- Student functions
-- ===========================================================================================

-- Joins the class with this code. Spaces and hyphens are ignored and letters may be lower case.
-- The student gets the class's year level; only a teacher can change it afterwards.
create function public.join_class(code text)
returns public.student_class
language plpgsql
security definer
set search_path = ''
as $$
declare
  student uuid := private.require_student();
  clean_code text := upper(regexp_replace(coalesce(join_class.code, ''), '[\s-]', '', 'g'));
  target public.classes;
begin
  if clean_code !~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$' then
    perform private.fail('invalid_join_code');
  end if;

  select c.* into target
  from public.class_join_codes j
  join public.classes c on c.id = j.class_id
  where j.code = clean_code;
  if not found then
    perform private.fail('join_code_not_found');
  end if;
  if not target.joining_enabled then
    perform private.fail('joining_closed');
  end if;

  insert into public.class_members (class_id, student_id, year_level)
  values (target.id, student, target.year_level)
  on conflict do nothing;
  if not found then
    perform private.fail('already_member');
  end if;

  return private.student_class_view(target.id, student);
end;
$$;

create function public.my_classes()
returns setof public.student_class
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  student uuid := private.require_student();
begin
  return query
    select v.*
    from public.class_members m
    cross join lateral private.student_class_view(m.class_id, student) as v
    where m.student_id = student
    order by v.joined_at;
end;
$$;

create function public.leave_class(class_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  student uuid := private.require_student();
  allowed boolean;
begin
  select c.students_can_leave into allowed
  from public.class_members m
  join public.classes c on c.id = m.class_id
  where m.class_id = leave_class.class_id and m.student_id = student;
  if not found then
    perform private.fail('class_not_found');
  end if;
  if not allowed then
    perform private.fail('leaving_not_allowed');
  end if;
  delete from public.class_members m
  where m.class_id = leave_class.class_id and m.student_id = student;
end;
$$;

-- ===========================================================================================
-- Function permissions: only the API functions, only for signed-in users
-- ===========================================================================================

revoke all on all functions in schema public from public, anon, authenticated;
revoke all on all functions in schema private from public, anon, authenticated;
revoke all on schema private from public, anon, authenticated;

grant execute on function
  public.complete_profile(public.account_role, text, text),
  public.update_my_name(text, text),
  public.create_class(text, integer),
  public.teacher_classes(),
  public.get_teacher_class(uuid),
  public.update_class(uuid, text, integer, boolean, boolean),
  public.regenerate_join_code(uuid),
  public.class_students(uuid),
  public.set_student_year_level(uuid, uuid, integer),
  public.remove_student(uuid, uuid),
  public.join_class(text),
  public.my_classes(),
  public.leave_class(uuid)
to authenticated;
