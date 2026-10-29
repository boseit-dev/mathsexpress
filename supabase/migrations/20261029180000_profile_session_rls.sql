-- Stop signed-out JWTs reading a profile before the access token expires.
-- Existing class and shop functions already check private.session_is_active().
-- RLS executes as the API role and cannot call a restricted private helper directly.
create function public.profile_session_is_active() returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce(private.session_is_active(), false);
$$;

revoke all on function public.profile_session_is_active() from public, anon, authenticated;
grant execute on function public.profile_session_is_active() to authenticated;

drop policy "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles
  for select to authenticated
  using (
    id = (select auth.uid())
    and (select public.profile_session_is_active())
  );
