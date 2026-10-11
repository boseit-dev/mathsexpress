-- MathsExpress v11.5.4 fast fixes

-- Signup is open to valid email addresses. Email verification is handled as disabled
-- by the server signup/login functions, which create/upgrade confirmed users.
create or replace function public.mathsexpress_is_signup_email_allowed(p_email text)
returns boolean
language sql
stable security definer
set search_path='public','pg_temp'
as $$
  select lower(trim(coalesce(p_email,''))) ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
$$;

-- Class Expedition sync fix: contribute RPC uses reward_events.id for idempotency.
alter table public.mathsexpress_reward_events add column if not exists id bigserial;
create unique index if not exists mathsexpress_reward_events_id_uidx on public.mathsexpress_reward_events(id);

-- Recreate guardian invite RPC with a strict student-owned flow and deterministic upsert.
create or replace function public.mathsexpress_student_invite_parent(p_guardian_email text,p_guardian_name text default null)
returns jsonb
language plpgsql
security definer
set search_path='public','pg_temp'
as $$
declare
  uid uuid:=auth.uid();
  v_email text:=lower(trim(coalesce(p_guardian_email,'')));
  v_name text:=nullif(left(trim(coalesce(p_guardian_name,'')),80),'');
  v_school uuid; v_id bigint; v_existing uuid; v_existing_role text;
begin
  if uid is null then raise exception 'Sign in required'; end if;
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Enter a valid parent or guardian email'; end if;
  if exists(select 1 from public.account_profiles p where p.user_id=uid and p.role in ('teacher','admin','owner')) then raise exception 'Student account required'; end if;

  select ss.school_id into v_school from public.mathrift_school_students ss where ss.student_id=uid order by ss.joined_at desc limit 1;
  if v_school is null then
    select c.school_id into v_school from public.mathrift_class_members cm join public.mathrift_classes c on c.id=cm.class_id where cm.student_id=uid order by cm.joined_at desc limit 1;
  end if;
  if v_school is null then raise exception 'Join a school class before adding a parent or guardian'; end if;

  select p.user_id,p.role into v_existing,v_existing_role from public.account_profiles p where lower(p.email)=v_email limit 1;
  insert into public.mathsexpress_parent_links(school_id,student_id,guardian_email,guardian_name,guardian_user_id,status,created_by)
  values(v_school,uid,v_email,v_name,case when v_existing_role='parent' then v_existing else null end,case when v_existing_role='parent' then 'active' else 'invited' end,uid)
  on conflict(school_id,student_id,guardian_email) do update set
    guardian_name=coalesce(excluded.guardian_name,mathsexpress_parent_links.guardian_name),
    guardian_user_id=coalesce(excluded.guardian_user_id,mathsexpress_parent_links.guardian_user_id),
    status=case when coalesce(excluded.guardian_user_id,mathsexpress_parent_links.guardian_user_id) is not null then 'active' else 'invited' end
  returning id into v_id;
  return jsonb_build_object('ok',true,'id',v_id,'guardian_email',v_email,'status',case when v_existing_role='parent' then 'active' else 'invited' end);
end $$;

grant execute on function public.mathsexpress_student_invite_parent(text,text) to authenticated;
