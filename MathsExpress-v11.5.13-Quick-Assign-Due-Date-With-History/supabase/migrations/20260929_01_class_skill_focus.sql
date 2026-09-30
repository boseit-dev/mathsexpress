-- MathsExpress Skills Focus storage and RPCs.
--
-- deploy-app.js has shipped three call sites against
-- public.mathsexpress_class_skill_focus(p_class_id) and one against
-- public.mathsexpress_set_class_skill_focus(p_class_id, p_skills), but neither
-- function has ever existed in a migration. PostgREST therefore answers every
-- call with "Could not find the function public.mathsexpress_class_skill_focus
-- (p_class_id) in the schema cache", which is what teachers see as the
-- "Skills Focus unavailable" toast when opening a class.
--
-- Two of the three read call sites swallow the failure (loadClassSkillFocus
-- catches and returns [], and the Class tab passes a {data:[]} fallback into
-- safe()), so the student-facing panel simply never appears. The third
-- (openSkillsFocusManager) rethrows, which is the visible error.
--
-- Naming follows the teacher safety alerts migration, where the table and the
-- reader function deliberately share a name.

create table if not exists public.mathsexpress_class_skill_focus (
  class_id uuid not null references public.mathrift_classes(id) on delete cascade,
  skill_id text not null,
  title text not null default '',
  note text not null default '',
  priority smallint not null default 1 check (priority between 1 and 3),
  position smallint not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  primary key (class_id, skill_id)
);

create index if not exists mathsexpress_class_skill_focus_class_idx
  on public.mathsexpress_class_skill_focus(class_id, priority desc, position);

alter table public.mathsexpress_class_skill_focus enable row level security;
revoke all on table public.mathsexpress_class_skill_focus from anon, authenticated;

-- Readable by anyone in the class: students see the panel in Learn and Class,
-- teachers see the current selection when opening the manager.
create or replace function public.mathsexpress_class_skill_focus(p_class_id uuid)
returns table(skill_id text, title text, note text, priority smallint)
language plpgsql security definer set search_path='public','private','pg_temp' as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not (private.mathrift_is_owner() or private.mathrift_teaches(p_class_id) or private.mathrift_in_class(p_class_id)) then
    raise exception 'Class access required';
  end if;
  return query
    select f.skill_id, f.title, f.note, f.priority
    from public.mathsexpress_class_skill_focus f
    where f.class_id = p_class_id
    order by f.priority desc, f.position, f.skill_id;
end $$;

-- Replaces the whole selection for a class. The client already caps the list at
-- six and derives priority 3/2/1 from position; both are re-checked here so the
-- RPC cannot be driven past those limits directly.
create or replace function public.mathsexpress_set_class_skill_focus(p_class_id uuid, p_skills jsonb)
returns jsonb
language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare
  v_uid uuid := auth.uid();
  v_rows integer := 0;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  if not (private.mathrift_is_owner() or private.mathrift_teaches(p_class_id)) then
    raise exception 'Teacher access required';
  end if;
  if p_skills is not null and jsonb_typeof(p_skills) <> 'array' then
    raise exception 'Skills must be an array';
  end if;

  delete from public.mathsexpress_class_skill_focus where class_id = p_class_id;

  with raw as (
    select
      left(trim(coalesce(item->>'skill_id','')), 120) as skill_id,
      left(trim(coalesce(item->>'title','')), 160) as title,
      left(trim(coalesce(item->>'note','')), 160) as note,
      greatest(1, least(3, coalesce((item->>'priority')::smallint, 1)))::smallint as priority,
      ord
    from jsonb_array_elements(coalesce(p_skills, '[]'::jsonb)) with ordinality as t(item, ord)
    where coalesce(trim(item->>'skill_id'), '') <> ''
  ), deduped as (
    -- A repeated skill_id in one payload would otherwise make the insert fail
    -- with "ON CONFLICT DO UPDATE command cannot affect row a second time";
    -- keep the first occurrence so the call still succeeds.
    select distinct on (skill_id) skill_id, title, note, priority, ord
    from raw
    order by skill_id, ord
  ), incoming as (
    select skill_id, title, note, priority,
           (row_number() over (order by ord) - 1)::smallint as position
    from deduped
    order by ord
    limit 6
  )
  insert into public.mathsexpress_class_skill_focus(class_id, skill_id, title, note, priority, position, created_by)
  select p_class_id, skill_id, title, note, priority, position, v_uid
  from incoming;

  get diagnostics v_rows = row_count;
  return jsonb_build_object('ok', true, 'class_id', p_class_id, 'count', v_rows);
end $$;

grant execute on function public.mathsexpress_class_skill_focus(uuid) to authenticated;
grant execute on function public.mathsexpress_set_class_skill_focus(uuid, jsonb) to authenticated;
