-- MathsExpress v11.5.23; requires the baseline mathrift classroom tables/functions.
-- Deploy transactionally and together with the v11.5.23 client release.
-- Rationale: one signed-in student/question may score only once, even across tabs/devices.
-- Never trust client-only duplicate guards. A separate table stores daily attempts; it
-- intentionally does NOT grant XP or consume reward keys.

create table if not exists public.mathsexpress_class_game_submissions (
  session_id uuid not null references public.mathrift_classroom_sessions(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  question_key text not null check (char_length(question_key) between 1 and 180),
  correct boolean not null,
  created_at timestamptz not null default now(),
  primary key (session_id, student_id, question_key)
);
create index if not exists mathsexpress_class_game_submissions_rate_idx
  on public.mathsexpress_class_game_submissions(session_id, student_id, created_at desc);
alter table public.mathsexpress_class_game_submissions enable row level security;
revoke all on public.mathsexpress_class_game_submissions from public, anon, authenticated;


-- The correct answer lives ONLY in a non-readable server table. Browser users
-- receive the prompt/options, never the marking key, and cannot tell the server
-- that their own answer was correct.
create table if not exists public.mathsexpress_class_game_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.mathrift_classroom_sessions(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  options jsonb not null,
  correct_option text not null,
  answered_at timestamptz,
  answered_option text,
  created_at timestamptz not null default now()
);
create index if not exists mathsexpress_class_game_questions_current_idx
  on public.mathsexpress_class_game_questions(session_id, student_id, created_at desc)
  where answered_at is null;
alter table public.mathsexpress_class_game_questions enable row level security;
revoke all on public.mathsexpress_class_game_questions from public, anon, authenticated;

create or replace function public.mathsexpress_class_game_next_question(
  p_session_id uuid, p_year_level integer default 9
) returns jsonb language plpgsql security definer
set search_path = 'public', 'pg_temp'
as $mx$
declare
  v_uid uuid := auth.uid();
  v_class_id uuid;
  v_status text;
  v_question public.mathsexpress_class_game_questions;
  v_year integer := greatest(0,least(12,coalesce(p_year_level,9)));
  a integer; b integer; c integer; x integer; n integer;
  v_answer integer;
  v_prompt text;
  v_options jsonb;
  v_slot integer;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  select class_id,status into v_class_id,v_status
    from public.mathrift_classroom_sessions where id=p_session_id;
  if not found or v_status <> 'playing' then raise exception 'Class game not available'; end if;
  if not private.mathrift_in_class(v_class_id) and not private.mathrift_teaches(v_class_id) then
    raise exception 'Class access required';
  end if;
  perform public.mathsexpress_class_game_join(p_session_id);
  -- Serialize question issuance for a student across tabs/devices.
  perform 1 from public.mathrift_classroom_game_players
    where session_id=p_session_id and student_id=v_uid for update;
  -- Reuse the unfinished question after reload or across devices.
  select * into v_question from public.mathsexpress_class_game_questions
    where session_id=p_session_id and student_id=v_uid and answered_at is null
    order by created_at desc limit 1;
  if found then
    return jsonb_build_object('id',v_question.id::text,'prompt',v_question.prompt,'options',v_question.options);
  end if;

  a:=floor(random()*9)::integer+2;
  b:=floor(random()*9)::integer+1;
  c:=floor(random()*11)::integer-5;
  x:=floor(random()*7)::integer+2;
  n:=floor(random()*4)::integer+2;
  if v_year <= 2 then
    v_prompt:=format('%s + %s = ?',a,b); v_answer:=a+b;
  elsif v_year <= 4 then
    v_prompt:=format('%s × %s = ?',a,b); v_answer:=a*b;
  elsif v_year <= 6 then
    v_prompt:=format('%s × %s + %s = ?',a,b,c); v_answer:=a*b+c;
  elsif v_year <= 7 then
    v_prompt:=format('Solve for x: x + %s = %s',b,x+b);v_answer:=x;
  elsif v_year <= 9 then
    v_prompt:=format('If x = %s, find %sx + (%s)',x,a,c);v_answer:=a*x+c;
  elsif v_year = 10 then
    v_prompt:=format('x² - %sx + %s = 0. One root is %s. Find the other.',a+b,a*b,a);
    v_answer:=b;
  elsif v_year = 11 then
    v_prompt:=format('For f(x) = %sx² + (%s), find f(%s).',a,c,x);v_answer:=a*x*x+c;
  else
    v_prompt:=format('For f(x) = %sx^%s, find f''(%s).',a,n,x);v_answer:=a*n*(x^(n-1));
  end if;
  v_slot:=floor(random()*4)::integer;
  select jsonb_agg(jsonb_build_object('id','lane-'||i::text,
    'value', (case when i=v_slot then v_answer else v_answer+(i+5-v_slot)%4+1 end)::text) order by i)
    into v_options from generate_series(0,3) i;
  insert into public.mathsexpress_class_game_questions(session_id,student_id,prompt,options,correct_option)
    values(p_session_id,v_uid,v_prompt,v_options,'lane-'||v_slot::text)
    returning * into v_question;
  return jsonb_build_object('id',v_question.id::text,'prompt',v_question.prompt,'options',v_question.options);
end
$mx$;
revoke all on function public.mathsexpress_class_game_next_question(uuid,integer) from public, anon, authenticated;
grant execute on function public.mathsexpress_class_game_next_question(uuid,integer) to authenticated;

-- Both the existing two-argument function and this overload are intentionally
-- retained in the database. Only this idempotent overload is executable by users.
-- A SECURITY DEFINER wrapper calls the locked, original scoring implementation.
create or replace function public.mathsexpress_class_game_answer(
  p_session_id uuid, p_option_id text, p_question_key text
) returns jsonb language plpgsql security definer
set search_path = 'public', 'pg_temp'
as $mx$
declare
  v_uid uuid := auth.uid();
  v_class_id uuid;
  v_status text;
  v_key text := btrim(coalesce(p_question_key,''));
  v_inserted boolean;
  v_last_attempt timestamptz;
  v_wait_ms integer;
  v_result jsonb;
  v_question public.mathsexpress_class_game_questions;
  v_correct boolean;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  if p_session_id is null or char_length(v_key) not between 1 and 180 then
    raise exception 'A valid question key is required';
  end if;
  select s.class_id,s.status into v_class_id,v_status
    from public.mathrift_classroom_sessions s where s.id=p_session_id;
  if not found then raise exception 'Class game not found'; end if;
  if v_status <> 'playing' then raise exception 'This class game is not playing'; end if;
  if not private.mathrift_in_class(v_class_id)
     and not private.mathrift_teaches(v_class_id) then
    raise exception 'Class access required';
  end if;

  -- Ensures the player row exists, then serialises different questions for the
  -- same player too (prevents racing read/modify/write updates).
  perform public.mathsexpress_class_game_join(p_session_id);
  perform 1 from public.mathrift_classroom_game_players
    where session_id=p_session_id and student_id=v_uid for update;

  select * into v_question from public.mathsexpress_class_game_questions
    where session_id=p_session_id and student_id=v_uid and id::text=v_key for update;
  if not found then raise exception 'This question was not issued to your account'; end if;
  if v_question.answered_at is not null then
    return jsonb_build_object('blocked',true,'reason','duplicate');
  end if;
  if not exists(select 1 from jsonb_array_elements(v_question.options) opt
      where opt->>'id'=p_option_id) then
    raise exception 'Choose one of the available answers';
  end if;
  v_correct := v_question.correct_option = p_option_id;
  select max(created_at) into v_last_attempt
    from public.mathsexpress_class_game_submissions
    where session_id=p_session_id and student_id=v_uid;
  if v_last_attempt is not null and now() < v_last_attempt + interval '3 seconds' then
    v_wait_ms:=greatest(1,ceil(extract(epoch from
      (v_last_attempt + interval '3 seconds' - now()))*1000)::integer);
    return jsonb_build_object('blocked',true,'reason','cooldown','retry_after_ms',v_wait_ms);
  end if;

  insert into public.mathsexpress_class_game_submissions(session_id,student_id,question_key,correct)
    values(p_session_id,v_uid,v_key,v_correct)
    on conflict do nothing returning true into v_inserted;
  if not coalesce(v_inserted,false) then
    return jsonb_build_object('blocked',true,'reason','duplicate');
  end if;

  update public.mathsexpress_class_game_questions
    set answered_at=now(),answered_option=p_option_id where id=v_question.id;
  -- Score with the SERVER-CHECKED answer, never with a browser-supplied boolean.
  -- If the scoring call errors, both inserts/updates roll back.
  v_result:=public.mathsexpress_class_game_answer(p_session_id,v_correct);
  return coalesce(v_result,'{}'::jsonb) || jsonb_build_object('blocked',false,'correct',v_correct);
end
$mx$;

-- Supabase defaults to EXECUTE granted to PUBLIC, including for SECURITY DEFINER
-- functions. Lock down both signatures, then allow only the safe one.
revoke all on function public.mathsexpress_class_game_answer(uuid,boolean) from public, anon, authenticated;
revoke all on function public.mathsexpress_class_game_answer(uuid,text,text) from public, anon, authenticated;
grant execute on function public.mathsexpress_class_game_answer(uuid,text,text) to authenticated;

create table if not exists public.mathsexpress_daily_question_attempts (
  student_id uuid not null references auth.users(id) on delete cascade,
  event_key text not null check (char_length(event_key) between 1 and 180),
  correct boolean not null,
  attempted_at timestamptz not null default now(),
  primary key(student_id,event_key)
);
create index if not exists mathsexpress_daily_question_attempts_date_idx
  on public.mathsexpress_daily_question_attempts(student_id,attempted_at desc);
alter table public.mathsexpress_daily_question_attempts enable row level security;
revoke all on public.mathsexpress_daily_question_attempts from public, anon, authenticated;

create or replace function public.mathsexpress_record_daily_question_attempt(
  p_event_key text, p_correct boolean
) returns jsonb language plpgsql security definer
set search_path = 'public', 'pg_temp'
as $mx$
declare
  v_uid uuid := auth.uid();
  v_key text := btrim(coalesce(p_event_key,''));
  v_inserted boolean;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  if char_length(v_key) not between 1 and 180 then raise exception 'Invalid question key'; end if;
  insert into public.mathsexpress_daily_question_attempts(student_id,event_key,correct)
    values(v_uid,v_key,p_correct)
    on conflict do nothing returning true into v_inserted;
  return jsonb_build_object('recorded',coalesce(v_inserted,false));
end
$mx$;
revoke all on function public.mathsexpress_record_daily_question_attempt(text,boolean) from public, anon, authenticated;
grant execute on function public.mathsexpress_record_daily_question_attempt(text,boolean) to authenticated;
