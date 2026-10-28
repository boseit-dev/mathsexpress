-- MathsExpress 2.0: fixes from the Phase 2 security review.
--
-- 0. A profile (and with it the account's permanent role) can only be created by a session that
--    proved it owns the email address: one opened from an email link, or Google. Registering an
--    address first and then signing in with that password after the owner confirms it is no
--    longer enough to set the account up as someone else.
-- 1. Leaving a class could undo a year level the teacher set: leave_class deleted the
--    membership, and join_class gave the student the class's level again. A student who leaves
--    (or is removed) is now remembered, and rejoining restores the year level they had. A student
--    who was on the class's level when they left rejoins on the class's current level, exactly as
--    they would have moved with the class.
-- Lock order, everywhere: the class row first, then memberships. update_class already works this
-- way; following it in every function means two of them can never wait for each other.
--
-- 2. Deleting a teacher's account removed their link to their classes but kept the classes, so a
--    class could be left with no teacher to manage it, and its students' pages broke. A teacher
--    who teaches classes can no longer be deleted until each class is handed to another teacher
--    or deleted.

-- ===========================================================================================
-- Former members
-- ===========================================================================================

create table public.former_class_members (
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  year_level public.year_level not null,
  -- True when the student was on the class's year level when they left.
  followed_class_level boolean not null,
  left_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

comment on table public.former_class_members is
  'Students who left or were removed from a class, so rejoining restores their teacher-set year level.';

alter table public.former_class_members enable row level security;
revoke all on public.former_class_members from anon, authenticated;

-- Records the student's year level before their membership is deleted.
create function private.remember_former_member(target_class uuid, target_student uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.former_class_members
    (class_id, student_id, year_level, followed_class_level)
  select m.class_id, m.student_id, m.year_level, m.year_level = c.year_level
  from public.class_members m
  join public.classes c on c.id = m.class_id
  where m.class_id = target_class and m.student_id = target_student
  on conflict (class_id, student_id) do update
    set year_level = excluded.year_level,
        followed_class_level = excluded.followed_class_level,
        left_at = now();
$$;

revoke all on function private.remember_former_member(uuid, uuid)
  from public, anon, authenticated;

-- ===========================================================================================
-- Joining, leaving and removing keep the teacher's year level
-- ===========================================================================================

-- Joins the class with this code. Spaces and hyphens are ignored and letters may be lower case.
-- A new student gets the class's year level; a returning student gets back the level they had.
-- Only a teacher can change it afterwards.
create or replace function public.join_class(code text)
returns public.student_class
language plpgsql
security definer
set search_path = ''
as $$
declare
  student uuid := private.require_student();
  clean_code text := upper(regexp_replace(coalesce(join_class.code, ''), '[\s-]', '', 'g'));
  target public.classes;
  former_level public.year_level;
  followed boolean;
begin
  if clean_code !~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$' then
    perform private.fail('invalid_join_code');
  end if;

  -- The lock waits for a class level change in progress, so the level read here is current.
  select c.* into target
  from public.class_join_codes j
  join public.classes c on c.id = j.class_id
  where j.code = clean_code
  for share of c;
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

  -- Looked up after the insert, which waited for any leave or removal of this membership still
  -- in progress, so a level remembered by it is seen here and can't be skipped by joining at the
  -- same moment.
  delete from public.former_class_members f
  where f.class_id = target.id and f.student_id = student
  returning f.year_level, f.followed_class_level into former_level, followed;
  if found and not followed then
    update public.class_members m
    set year_level = former_level
    where m.class_id = target.id and m.student_id = student;
  end if;

  return private.student_class_view(target.id, student);
end;
$$;

create or replace function public.leave_class(class_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  student uuid := private.require_student();
  allowed boolean;
begin
  perform 1 from public.classes c where c.id = leave_class.class_id for share;
  select c.students_can_leave into allowed
  from public.class_members m
  join public.classes c on c.id = m.class_id
  where m.class_id = leave_class.class_id and m.student_id = student
  -- Locks the membership, so a teacher's change in progress is finished, and remembered, before
  -- the student leaves.
  for update of m;
  if not found then
    perform private.fail('class_not_found');
  end if;
  if not allowed then
    perform private.fail('leaving_not_allowed');
  end if;
  perform private.remember_former_member(leave_class.class_id, student);
  delete from public.class_members m
  where m.class_id = leave_class.class_id and m.student_id = student;
end;
$$;

create or replace function public.remove_student(class_id uuid, student_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_class_teacher(remove_student.class_id);
  perform 1 from public.classes c where c.id = remove_student.class_id for share;
  -- Locks the membership before remembering it, so the level remembered is the latest one.
  perform 1 from public.class_members m
  where m.class_id = remove_student.class_id and m.student_id = remove_student.student_id
  for update;
  perform private.remember_former_member(remove_student.class_id, remove_student.student_id);
  delete from public.class_members m
  where m.class_id = remove_student.class_id and m.student_id = remove_student.student_id;
  if not found then
    perform private.fail('student_not_found');
  end if;
end;
$$;

-- ===========================================================================================
-- Every class keeps its teacher
-- ===========================================================================================

alter table public.class_teachers
  drop constraint class_teachers_teacher_id_fkey,
  add constraint class_teachers_teacher_id_fkey
    foreign key (teacher_id) references public.profiles (id) on delete restrict;

comment on constraint class_teachers_teacher_id_fkey on public.class_teachers is
  'A teacher who teaches classes cannot be deleted until each class has another teacher or is deleted.';

-- ===========================================================================================
-- Only a session that proved it owns the email address can set up the account
-- ===========================================================================================

-- Seconds since this session signed in through an email link ("otp") or Google ("oauth"), from
-- the signed session token and the database's clock; null for a session that signed in with a
-- password. The app also uses it to offer a new password only just after a reset link.
create function private.email_sign_in_age() returns integer
language sql
stable
set search_path = ''
as $$
  select (extract(epoch from now()) - max((amr ->> 'timestamp')::bigint))::integer
  from jsonb_array_elements(coalesce(auth.jwt() -> 'amr', '[]'::jsonb)) as amr
  where jsonb_typeof(amr) = 'object' and amr ->> 'method' in ('otp', 'oauth');
$$;

create function public.email_sign_in_age() returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select private.email_sign_in_age();
$$;

-- Creates the caller's profile. The role can be chosen only here, once, and only by a session
-- that proved it owns the email address (see above).
create or replace function public.complete_profile(
  role public.account_role,
  first_name text,
  last_name text
)
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
  if auth.uid() is null or not private.session_is_active() then
    perform private.fail('not_signed_in');
  end if;
  -- A day matches the auth server's own limit for changing a password without signing in again.
  if coalesce(private.email_sign_in_age(), 86400) >= 86400 then
    perform private.fail('email_link_required');
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

revoke all on function private.email_sign_in_age() from public, anon, authenticated;
revoke all on function public.email_sign_in_age() from public, anon;
grant execute on function public.email_sign_in_age() to authenticated;

-- ===========================================================================================
-- No password sessions for accounts that aren't set up
-- ===========================================================================================

-- Supabase Auth calls this before issuing any access token (see [auth.hook.custom_access_token]
-- in config.toml; the hosted project needs the same hook). A password sign-in is refused until
-- the account has a profile, which only a session from an email link (or Google) can create. So
-- someone who registered an address before its owner can't sign in with their password at all:
-- not to set the account up, and not to keep changing the password to lock the owner out.
create function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
begin
  if event ->> 'authentication_method' = 'password'
    and not exists (
      select 1 from public.profiles p where p.id = (event ->> 'user_id')::uuid
    ) then
    return jsonb_build_object(
      'error',
      jsonb_build_object('http_code', 403, 'message', 'email_link_required')
    );
  end if;
  return event;
end;
$$;

revoke all on function public.custom_access_token_hook(jsonb) from public, anon, authenticated;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;

-- The auth server reads profiles only through the hook, and only to see whether one exists.
grant select on public.profiles to supabase_auth_admin;
create policy "The auth server can check whether a profile exists" on public.profiles
  for select to supabase_auth_admin
  using (true);

-- ===========================================================================================
-- Ended sessions lose access at once, and the lock order is the same everywhere
-- ===========================================================================================

-- Access tokens stay valid until they expire (up to an hour), even after signing out or after a
-- password change ends the session. Every function checks the session still exists instead.
create function private.session_is_active() returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.sessions s
    where s.id = nullif(auth.jwt() ->> 'session_id', '')::uuid
      and s.user_id = auth.uid()
  );
$$;

revoke all on function private.session_is_active() from public, anon, authenticated;

create or replace function private.current_profile() returns public.profiles
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result public.profiles;
begin
  if auth.uid() is null or not private.session_is_active() then
    perform private.fail('not_signed_in');
  end if;
  select * into result from public.profiles where id = auth.uid();
  if not found then
    perform private.fail('profile_required');
  end if;
  return result;
end;
$$;

create or replace function public.set_student_year_level(
  class_id uuid,
  student_id uuid,
  year_level integer
)
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
  perform 1 from public.classes c where c.id = set_student_year_level.class_id for share;
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
