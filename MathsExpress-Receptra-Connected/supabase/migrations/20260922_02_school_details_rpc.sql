-- Adds the missing public.mathsexpress_update_school_details RPC. The
-- frontend (deploy-core-1.js MathRiftSchoolClient.updateSchoolDetails) has
-- been calling this with p_school_id/p_name/p_region/p_country/p_curriculum
-- since at least this build, but the function was never created, so every
-- save failed with:
--   Could not find the function public.mathsexpress_update_school_details(
--     p_country, p_curriculum, p_name, p_region, p_school_id)
--
-- Mirrors the existing mathsexpress_update_school_config RPC's auth pattern
-- exactly: requires a signed-in user who is either the platform owner or
-- holds the principal/deputy_principal role at this specific school
-- (private.mathrift_school_role / private.mathrift_is_owner are the same
-- helpers that function already relies on). No broader grant than that --
-- teachers, other staff and students cannot call this.

create or replace function public.mathsexpress_update_school_details(
  p_school_id uuid,
  p_name text default null,
  p_region text default null,
  p_country text default null,
  p_curriculum text default null
)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_role text;
  v_row public.mathrift_schools;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  v_role := private.mathrift_school_role(p_school_id);
  if not private.mathrift_is_owner() and v_role not in ('principal','deputy_principal') then
    raise exception 'Principal or Deputy Principal access required';
  end if;

  update public.mathrift_schools set
    name = coalesce(nullif(trim(p_name), ''), name),
    display_name = coalesce(nullif(trim(p_name), ''), display_name),
    region = case when p_region is null then region else nullif(trim(p_region), '') end,
    country = case when p_country is null then country else nullif(trim(p_country), '') end,
    curriculum = coalesce(nullif(trim(p_curriculum), ''), curriculum),
    updated_at = now()
  where id = p_school_id;

  if not found then raise exception 'School not found'; end if;

  select * into v_row from public.mathrift_schools where id = p_school_id;
  return to_jsonb(v_row);
end;
$function$;

grant execute on function public.mathsexpress_update_school_details(uuid, text, text, text, text) to authenticated;
