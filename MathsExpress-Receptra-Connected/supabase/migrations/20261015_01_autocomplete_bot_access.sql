-- v11.5.28: auto-complete bot access. The owner always has it and is the ONLY person who can
-- grant or remove it (admins cannot). Bot use on teacher assignments is logged as an integrity
-- event ('bot-autocomplete') by the app so teachers can see automated completions.
create table if not exists public.mathsexpress_bot_access (
  user_id uuid primary key references public.account_profiles(user_id) on delete cascade,
  granted_by uuid not null,
  granted_at timestamptz not null default now()
);
alter table public.mathsexpress_bot_access enable row level security;
revoke all on public.mathsexpress_bot_access from public, anon, authenticated;

create or replace function public.mathsexpress_my_bot_access()
returns boolean language sql stable security definer set search_path='public','private','pg_temp' as $$
  select auth.uid() is not null and (private.mathrift_is_owner()
    or exists(select 1 from public.mathsexpress_bot_access where user_id=auth.uid()))
$$;

create or replace function public.mathsexpress_owner_set_bot_access(p_user uuid, p_allowed boolean)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
begin
  if not private.mathrift_is_owner() then raise exception 'Only the owner can give auto-complete access'; end if;
  if p_allowed then
    insert into public.mathsexpress_bot_access(user_id,granted_by) values(p_user,auth.uid())
      on conflict (user_id) do update set granted_by=excluded.granted_by, granted_at=now();
  else
    delete from public.mathsexpress_bot_access where user_id=p_user;
  end if;
  insert into public.mathsexpress_audit_log(actor_user_id,action,target,details)
    values(auth.uid(),'owner-set-bot-access',p_user::text,jsonb_build_object('allowed',p_allowed));
  return jsonb_build_object('ok',true,'user_id',p_user,'allowed',p_allowed);
end $$;

create or replace function public.mathsexpress_owner_bot_access_list()
returns table(user_id uuid, email text, display_name text, granted_at timestamptz)
language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
begin
  if not private.mathrift_is_owner() then raise exception 'Owner access required'; end if;
  return query select b.user_id, p.email, p.display_name, b.granted_at
    from public.mathsexpress_bot_access b join public.account_profiles p on p.user_id=b.user_id order by b.granted_at desc;
end $$;

revoke all on function public.mathsexpress_my_bot_access() from public, anon;
revoke all on function public.mathsexpress_owner_set_bot_access(uuid,boolean) from public, anon;
revoke all on function public.mathsexpress_owner_bot_access_list() from public, anon;
grant execute on function public.mathsexpress_my_bot_access() to authenticated;
grant execute on function public.mathsexpress_owner_set_bot_access(uuid,boolean) to authenticated;
grant execute on function public.mathsexpress_owner_bot_access_list() to authenticated;

-- Integrity log: accept 'bot-autocomplete' (only from accounts that actually have bot access)
-- so teachers can see when an assignment was completed by the bot. Other types unchanged.
create or replace function public.mathsexpress_record_integrity_event(p_assignment_id uuid, p_event_type text, p_payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path to 'public', 'private', 'pg_temp' as $function$
declare v_type text:=lower(trim(coalesce(p_event_type,'')));
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not exists(select 1 from public.mathrift_assignments a join public.mathrift_class_members m on m.class_id=a.class_id
                where a.id=p_assignment_id and m.student_id=auth.uid()) then raise exception 'Assignment access required'; end if;
  if v_type not in ('tab-hidden','window-blur','fullscreen-exit','paste','copy','focus-return','bot-autocomplete') then raise exception 'Invalid integrity event'; end if;
  if v_type='bot-autocomplete' and not public.mathsexpress_my_bot_access() then raise exception 'Auto-complete access required'; end if;
  insert into public.mathrift_integrity_events(student_id,assignment_id,event_type,payload) values(auth.uid(),p_assignment_id,v_type,coalesce(p_payload,'{}'::jsonb));
  return jsonb_build_object('ok',true);
end $function$;
