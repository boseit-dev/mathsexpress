-- Fixes teacher self-signup: choosing "Teacher" at signup previously had no
-- effect because the account-creation trigger never read
-- raw_user_meta_data->>'requested_account_type'. Every new signup became a
-- 'player' regardless of the radio button chosen on the signup form.
--
-- Teacher role is only granted when BOTH:
--   1. the signup explicitly requested it, and
--   2. the email passes the same approved-domain / invited-guardian check
--      already enforced by the mathsexpress_validate_signup_email trigger
--      (mathsexpress_is_signup_email_allowed).
-- This does not weaken any existing check -- it reuses the same allow-list
-- function that already gates signup at all.

create or replace function public.handle_new_account_user()
returns trigger
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_name text;
  v_role text;
  v_username text;
  v_email text := lower(new.email);
  v_requested_role text := lower(trim(coalesce(new.raw_user_meta_data->>'requested_account_type','')));
begin
  v_name := left(regexp_replace(trim(coalesce(new.raw_user_meta_data->>'display_name',split_part(new.email,'@',1),'Player')),'\s+',' ','g'),20);
  if char_length(v_name)<2 then v_name:='Player'; end if;
  v_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username',split_part(new.email,'@',1)),'[^A-Za-z0-9_]','','g'));
  if char_length(v_username)<3 then v_username:=null; else v_username:=left(v_username,24); end if;

  v_role := case
    when v_email='aarush.sharma6@education.nsw.gov.au' then 'owner'
    when v_requested_role='teacher' and public.mathsexpress_is_signup_email_allowed(v_email) then 'teacher'
    when exists(select 1 from public.mathsexpress_parent_links l where lower(l.guardian_email)=v_email and l.status in ('invited','active')) then 'parent'
    else 'player'
  end;

  insert into public.account_profiles(user_id,email,display_name,username,role,status)
  values(new.id,v_email,v_name,v_username,v_role,'active')
  on conflict(user_id) do update set
    email=excluded.email,
    display_name=excluded.display_name,
    username=coalesce(public.account_profiles.username,excluded.username),
    role=case
      when excluded.email='aarush.sharma6@education.nsw.gov.au' then 'owner'
      when public.account_profiles.role='player'
           and v_requested_role='teacher'
           and public.mathsexpress_is_signup_email_allowed(excluded.email) then 'teacher'
      when public.account_profiles.role='player'
           and exists(select 1 from public.mathsexpress_parent_links l where lower(l.guardian_email)=excluded.email and l.status in ('invited','active')) then 'parent'
      else public.account_profiles.role
    end;

  update public.mathsexpress_parent_links
    set guardian_user_id=new.id,status='active'
    where lower(guardian_email)=v_email and status in ('invited','active');

  return new;
end;
$function$;

-- Let the browser check "would this email be allowed to sign up" BEFORE
-- submitting the signup form, so obviously-invalid emails (personal Gmail/
-- Outlook/etc.) get an instant, friendly message instead of a signup attempt
-- that fails deep in a database trigger and surfaces Postgres/GoTrue's
-- generic "Database error saving new user" (Supabase Auth does not forward
-- a trigger's RAISE EXCEPTION text to the client). This function only ever
-- returns a boolean and does not expose any account data.
grant execute on function public.mathsexpress_is_signup_email_allowed(text) to anon, authenticated;
