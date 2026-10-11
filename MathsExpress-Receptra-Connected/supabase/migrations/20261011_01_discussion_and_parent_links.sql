-- v11.5.21: backends for two client features whose RPCs never existed (handoff §6).
--   * Ask Teacher / Discussion Board: list, create, reply, moderate.
--     list_content/create_content were NOT reusable: create_content refuses students
--     and its content types have no thread/reply model.
--   * mathsexpress_my_parent_links: the student's own guardian links.
--     school_parent_links is staff-only and school-scoped, so it was not a rename either.

create table if not exists public.mathsexpress_discussion_threads (
  id bigint generated always as identity primary key,
  class_id uuid not null references public.mathrift_classes(id) on delete cascade,
  student_id uuid not null,
  subject text not null default 'Question',
  body text not null,
  status text not null default 'open' check (status in ('open','answered','closed')),
  visibility text not null default 'teacher' check (visibility in ('teacher','class')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists mathsexpress_discussion_threads_class_idx
  on public.mathsexpress_discussion_threads(class_id, created_at desc);

create table if not exists public.mathsexpress_discussion_posts (
  id bigint generated always as identity primary key,
  thread_id bigint not null references public.mathsexpress_discussion_threads(id) on delete cascade,
  author_id uuid not null,
  body text not null,
  is_staff boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists mathsexpress_discussion_posts_thread_idx
  on public.mathsexpress_discussion_posts(thread_id, created_at);

alter table public.mathsexpress_discussion_threads enable row level security;
alter table public.mathsexpress_discussion_posts enable row level security;
revoke all on public.mathsexpress_discussion_threads from anon, authenticated;
revoke all on public.mathsexpress_discussion_posts from anon, authenticated;

create or replace function public.mathsexpress_list_discussion_threads(p_class_id uuid, p_limit integer default 100)
returns jsonb language plpgsql stable security definer
set search_path = 'public','private','pg_temp' as $$
declare v_teacher boolean;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  v_teacher := private.mathrift_teaches(p_class_id);
  if not v_teacher and not private.mathrift_in_class(p_class_id) then raise exception 'Class access required'; end if;
  return coalesce((
    select jsonb_agg(row_to_json(x)::jsonb order by x.created_at desc) from (
      select t.id, t.class_id, t.subject, t.body, t.status, t.visibility, t.created_at, t.updated_at,
             t.student_id = auth.uid() as mine,
             case when v_teacher or t.student_id = auth.uid() then coalesce(sp.display_name,'Student') else 'Classmate' end as student_name,
             coalesce((
               select jsonb_agg(jsonb_build_object(
                 'id', p.id, 'body', p.body, 'is_staff', p.is_staff, 'created_at', p.created_at,
                 'author_name', case when p.is_staff then 'Teacher'
                                     when v_teacher or p.author_id = auth.uid() then coalesce(ap.display_name,'Student')
                                     else 'Classmate' end
               ) order by p.created_at)
               from public.mathsexpress_discussion_posts p
               left join public.account_profiles ap on ap.user_id = p.author_id
               where p.thread_id = t.id), '[]'::jsonb) as posts
      from public.mathsexpress_discussion_threads t
      left join public.account_profiles sp on sp.user_id = t.student_id
      where t.class_id = p_class_id
        and (v_teacher or t.student_id = auth.uid() or t.visibility = 'class')
      order by t.created_at desc
      limit greatest(1, least(coalesce(p_limit,100), 200))
    ) x), '[]'::jsonb);
end $$;

create or replace function public.mathsexpress_create_discussion_thread(p_class_id uuid, p_subject text, p_body text)
returns jsonb language plpgsql security definer
set search_path = 'public','private','pg_temp' as $$
declare v_id bigint; v_body text := trim(coalesce(p_body,''));
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not private.mathrift_in_class(p_class_id) then raise exception 'Only students in this class can ask a question'; end if;
  if length(v_body) < 2 then raise exception 'Write a question first'; end if;
  if (select count(*) from public.mathsexpress_discussion_threads
      where student_id = auth.uid() and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'Too many questions in the last hour. Try again later.';
  end if;
  insert into public.mathsexpress_discussion_threads(class_id, student_id, subject, body)
  values (p_class_id, auth.uid(), coalesce(nullif(left(trim(coalesce(p_subject,'')),120),''),'Question'), left(v_body,4000))
  returning id into v_id;
  return jsonb_build_object('ok', true, 'id', v_id);
end $$;

create or replace function public.mathsexpress_reply_discussion_thread(p_thread_id bigint, p_body text)
returns jsonb language plpgsql security definer
set search_path = 'public','private','pg_temp' as $$
declare t public.mathsexpress_discussion_threads; v_staff boolean; v_body text := trim(coalesce(p_body,''));
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select * into t from public.mathsexpress_discussion_threads where id = p_thread_id;
  if not found then raise exception 'Discussion not found'; end if;
  v_staff := private.mathrift_teaches(t.class_id);
  if not v_staff and t.student_id <> auth.uid()
     and not (t.visibility = 'class' and private.mathrift_in_class(t.class_id)) then
    raise exception 'Discussion access required';
  end if;
  if t.status = 'closed' then raise exception 'This discussion is closed'; end if;
  if length(v_body) < 1 then raise exception 'Write a reply first'; end if;
  insert into public.mathsexpress_discussion_posts(thread_id, author_id, body, is_staff)
  values (t.id, auth.uid(), left(v_body,4000), v_staff);
  update public.mathsexpress_discussion_threads
     set status = case when v_staff then 'answered' else 'open' end, updated_at = now()
   where id = t.id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.mathsexpress_moderate_discussion_thread(p_thread_id bigint, p_status text, p_visibility text)
returns jsonb language plpgsql security definer
set search_path = 'public','private','pg_temp' as $$
declare v_class uuid;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select class_id into v_class from public.mathsexpress_discussion_threads where id = p_thread_id;
  if v_class is null then raise exception 'Discussion not found'; end if;
  if not private.mathrift_teaches(v_class) then raise exception 'Class teacher access required'; end if;
  if p_status is not null and p_status not in ('open','answered','closed') then raise exception 'Unsupported status'; end if;
  if p_visibility is not null and p_visibility not in ('teacher','class') then raise exception 'Unsupported visibility'; end if;
  update public.mathsexpress_discussion_threads
     set status = coalesce(p_status, status), visibility = coalesce(p_visibility, visibility), updated_at = now()
   where id = p_thread_id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.mathsexpress_my_parent_links()
returns table(id bigint, guardian_email text, guardian_name text, status text, created_at timestamptz)
language plpgsql stable security definer
set search_path = 'public','private','pg_temp' as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  return query
  select l.id, l.guardian_email, l.guardian_name, l.status, l.created_at
  from public.mathsexpress_parent_links l
  where l.student_id = auth.uid() and l.status <> 'revoked'
  order by l.created_at desc;
end $$;

revoke all on function public.mathsexpress_list_discussion_threads(uuid, integer) from public, anon;
revoke all on function public.mathsexpress_create_discussion_thread(uuid, text, text) from public, anon;
revoke all on function public.mathsexpress_reply_discussion_thread(bigint, text) from public, anon;
revoke all on function public.mathsexpress_moderate_discussion_thread(bigint, text, text) from public, anon;
revoke all on function public.mathsexpress_my_parent_links() from public, anon;
grant execute on function public.mathsexpress_list_discussion_threads(uuid, integer) to authenticated;
grant execute on function public.mathsexpress_create_discussion_thread(uuid, text, text) to authenticated;
grant execute on function public.mathsexpress_reply_discussion_thread(bigint, text) to authenticated;
grant execute on function public.mathsexpress_moderate_discussion_thread(bigint, text, text) to authenticated;
grant execute on function public.mathsexpress_my_parent_links() to authenticated;
notify pgrst, 'reload schema';
