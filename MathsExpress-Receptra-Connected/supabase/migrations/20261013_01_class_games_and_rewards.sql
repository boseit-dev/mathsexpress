-- v11.5.25: class games
--   * Teacher-chosen topic, year level and duration (stored in mathrift_classroom_sessions.config).
--   * Questions per topic (number / algebra / measurement / statistics / mixed) for each year band.
--   * Distractors sit on both sides of the answer and are shuffled (previously the
--     correct option was always the smallest value).
--   * No new questions after the game's time is up.
--   * Leaderboard privacy: students only see their own right/wrong counts; teachers see everyone.
-- Requires 20261011_02 (mathsexpress_class_game_questions) to be applied first.

create or replace function public.mathsexpress_class_game_next_question(
  p_session_id uuid, p_year_level integer default 9
) returns jsonb language plpgsql security definer
set search_path = 'public', 'pg_temp'
as $mx$
declare
  v_uid uuid := auth.uid();
  v_class_id uuid;
  v_status text;
  v_config jsonb;
  v_created timestamptz;
  v_minutes integer := 10;
  v_question public.mathsexpress_class_game_questions;
  v_year integer := greatest(0,least(12,coalesce(p_year_level,9)));
  v_topic text;
  a integer; b integer; c integer; x integer; n integer; k integer;
  v_answer integer;
  v_prompt text;
  v_offs integer[];
  v_vals integer[];
  v_step integer;
  v_options jsonb;
  v_slot integer;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  select class_id,status,coalesce(config,'{}'::jsonb),created_at
    into v_class_id,v_status,v_config,v_created
    from public.mathrift_classroom_sessions where id=p_session_id;
  if not found or v_status <> 'playing' then raise exception 'Class game not available'; end if;
  if not private.mathrift_in_class(v_class_id) and not private.mathrift_teaches(v_class_id) then
    raise exception 'Class access required';
  end if;
  if coalesce(v_config->>'duration_minutes','') ~ '^[0-9]{1,3}$' then
    v_minutes := greatest(1,least(30,(v_config->>'duration_minutes')::integer));
  end if;
  if now() > v_created + make_interval(mins => v_minutes) then
    raise exception 'This class game has finished';
  end if;
  if coalesce(v_config->>'year_level','') ~ '^[0-9]{1,2}$' then
    v_year := greatest(0,least(12,(v_config->>'year_level')::integer));
  end if;
  v_topic := lower(coalesce(v_config->>'topic','mixed'));
  if v_topic not in ('number','algebra','measurement','statistics') then
    v_topic := (array['number','algebra','measurement','statistics'])[floor(random()*4)::integer+1];
  end if;

  perform public.mathsexpress_class_game_join(p_session_id);
  perform 1 from public.mathrift_classroom_game_players
    where session_id=p_session_id and student_id=v_uid for update;
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
  n:=floor(random()*4)::integer+3;
  k:=floor(random()*5)::integer+1;

  if v_topic='number' then
    if v_year<=2 then v_prompt:=format('%s + %s = ?',a,b); v_answer:=a+b;
    elsif v_year<=4 then v_prompt:=format('%s × %s = ?',a,b); v_answer:=a*b;
    elsif v_year<=6 then v_prompt:=format('%s ÷ %s = ?',a*b,a); v_answer:=b;
    elsif v_year<=8 then v_prompt:=format('(%s) × (−%s) + %s = ?',c,b,a); v_answer:=c*(-b)+a;
    elsif v_year<=10 then
      v_step:=(array[10,20,25,50])[floor(random()*4)::integer+1];
      v_prompt:=format('What is %s%% of %s?',v_step,k*20*10); v_answer:=(v_step*k*20*10)/100;
    else v_prompt:=format('Evaluate log₂(%s)',power(2,n+2)::integer); v_answer:=n+2;
    end if;
  elsif v_topic='algebra' then
    if v_year<=2 then v_prompt:=format('? + %s = %s',a,a+b); v_answer:=b;
    elsif v_year<=4 then v_prompt:=format('? × %s = %s',a,a*b); v_answer:=b;
    elsif v_year<=6 then v_prompt:=format('Next term: %s, %s, %s, %s, ?',b,b+a,b+2*a,b+3*a); v_answer:=b+4*a;
    elsif v_year<=8 then v_prompt:=format('Solve for x: x + %s = %s',b,x+b); v_answer:=x;
    elsif v_year=9 then v_prompt:=format('Solve for x: %sx + %s = %s',a,b,a*x+b); v_answer:=x;
    elsif v_year=10 then
      v_prompt:=format('x² − %sx + %s = 0. One root is %s. Find the other.',a+b,a*b,a); v_answer:=b;
    else v_prompt:=format('For f(x) = %sx^%s, find f′(%s).',a,n,x/2+1); v_answer:=a*n*power(x/2+1,n-1)::integer;
    end if;
  elsif v_topic='measurement' then
    if v_year<=2 then
      v_step:=floor(random()*4)::integer;
      v_prompt:=format('How many sides does a %s have?',(array['triangle','square','pentagon','hexagon'])[v_step+1]);
      v_answer:=v_step+3;
    elsif v_year<=4 then v_prompt:=format('Area of a %s cm by %s cm rectangle (cm²)?',a,b); v_answer:=a*b;
    elsif v_year<=6 then v_prompt:=format('Perimeter of a %s m by %s m rectangle (m)?',a,b); v_answer:=2*(a+b);
    elsif v_year<=8 then v_prompt:=format('Area of a triangle with base %s cm and height %s cm (cm²)?',2*a,b); v_answer:=a*b;
    elsif v_year<=10 then
      v_step:=floor(random()*2)::integer;
      if v_step=0 then v_prompt:=format('Right triangle with legs %s and %s. Hypotenuse?',3*k,4*k); v_answer:=5*k;
      else v_prompt:=format('Right triangle with legs %s and %s. Hypotenuse?',5*k,12*k); v_answer:=13*k; end if;
    else v_prompt:=format('Sum of the interior angles of a %s-sided polygon (degrees)?',n+2); v_answer:=n*180;
    end if;
  else
    if v_year<=4 then v_prompt:=format('Range of %s, %s, %s, %s?',b,b+a,b+k,b+a+x); v_answer:=a+x;
    elsif v_year<=6 then v_prompt:=format('Mean of %s, %s and %s?',a*3-k,a*3,a*3+k); v_answer:=a*3;
    elsif v_year<=8 then v_prompt:=format('Median of %s, %s, %s, %s, %s?',b+x+k,b,b+x,b+1,b+x+k+3); v_answer:=b+x;
    elsif v_year<=10 then v_prompt:=format('Mean of %s, %s, %s, %s, %s?',a*5-2,a*5+2,a*5-k,a*5+k,a*5); v_answer:=a*5;
    else
      v_prompt:=format('P(event) = 1/%s. Expected number of times in %s trials?',a,a*b*2); v_answer:=b*2;
    end if;
  end if;

  -- Three distinct distractors around the answer (both sides), then shuffle all four.
  v_step:=greatest(1,abs(v_answer)/10);
  select array_agg(o order by random()) into v_offs from unnest(array[-3,-2,-1,1,2,3]) o;
  v_vals:=array[v_answer, v_answer+v_offs[1]*v_step, v_answer+v_offs[2]*v_step, v_answer+v_offs[3]*v_step];
  select array_agg(v order by random()) into v_vals from unnest(v_vals) v;
  v_slot:=array_position(v_vals,v_answer)-1;
  select jsonb_agg(jsonb_build_object('id','lane-'||(i-1)::text,'value',v_vals[i]::text) order by i)
    into v_options from generate_series(1,4) i;
  insert into public.mathsexpress_class_game_questions(session_id,student_id,prompt,options,correct_option)
    values(p_session_id,v_uid,v_prompt,v_options,'lane-'||v_slot::text)
    returning * into v_question;
  return jsonb_build_object('id',v_question.id::text,'prompt',v_question.prompt,'options',v_question.options);
end
$mx$;
revoke all on function public.mathsexpress_class_game_next_question(uuid,integer) from public, anon, authenticated;
grant execute on function public.mathsexpress_class_game_next_question(uuid,integer) to authenticated;

drop function if exists public.mathsexpress_class_game_leaderboard(uuid);
create function public.mathsexpress_class_game_leaderboard(p_session_id uuid)
returns table(display_name text, team text, score integer, player_position integer, zone_seconds integer,
              lives integer, streak integer, answered integer, correct integer, is_me boolean)
language plpgsql security definer
set search_path = 'public', 'pg_temp'
as $mx$
declare v_class uuid; v_staff boolean;
begin
  select class_id into v_class from public.mathrift_classroom_sessions where id=p_session_id;
  if v_class is null or (not private.mathrift_in_class(v_class) and not private.mathrift_teaches(v_class)) then
    raise exception 'Class access required';
  end if;
  v_staff := private.mathrift_teaches(v_class) or public.mathsexpress_is_platform_admin();
  return query
    select coalesce(ap.display_name,'Student'), gp.team, gp.score, gp.position, gp.zone_seconds, gp.lives, gp.streak,
           case when v_staff or gp.student_id=auth.uid() then gp.answered end,
           case when v_staff or gp.student_id=auth.uid() then gp.correct end,
           gp.student_id=auth.uid()
    from public.mathrift_classroom_game_players gp
    left join public.account_profiles ap on ap.user_id=gp.student_id
    where gp.session_id=p_session_id
    order by gp.score desc, gp.position desc, gp.updated_at asc;
end
$mx$;
revoke all on function public.mathsexpress_class_game_leaderboard(uuid) from public, anon;
grant execute on function public.mathsexpress_class_game_leaderboard(uuid) to authenticated;

-- ---------------------------------------------------------------------------------------------
-- Finishing reward for self-paced practice (assignments already pay through
-- claim_assignment_completion_reward). Paid only when the server has seen at least five
-- recorded answers since the previous claim, at most five times per Sydney day.
-- ---------------------------------------------------------------------------------------------
create or replace function public.mathsexpress_claim_practice_completion(p_run_key text)
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare
  v_uid uuid:=auth.uid();
  v_day_start timestamptz:=(date_trunc('day',now() at time zone 'Australia/Sydney')) at time zone 'Australia/Sydney';
  v_last timestamptz; v_today int; v_evidence int; v_key text; v_inserted int;
  v_coins int:=15; v_xp int:=30;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  if coalesce(trim(p_run_key),'')='' or char_length(p_run_key)>80 then raise exception 'Invalid run'; end if;
  v_key:='practice-finish:'||trim(p_run_key);
  if exists(select 1 from public.mathsexpress_reward_events where user_id=v_uid and event_key=v_key) then
    return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',true,'coins_awarded',0,'xp_awarded',0);
  end if;
  perform 1 from public.account_profiles where user_id=v_uid for update;
  select count(*), max(created_at) into v_today, v_last from public.mathsexpress_reward_events
    where user_id=v_uid and event_type='practice-finish' and created_at>=v_day_start;
  if v_today>=5 then
    return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',false,'daily_limit',true,'coins_awarded',0,'xp_awarded',0);
  end if;
  select count(*) into v_evidence from public.mathsexpress_daily_question_attempts
    where student_id=v_uid and attempted_at>=now()-interval '90 minutes' and (v_last is null or attempted_at>v_last);
  if v_evidence<5 then raise exception 'Finish at least five questions to earn the completion reward'; end if;
  insert into public.mathsexpress_reward_events(user_id,event_key,event_type,coins,xp,game_time_seconds)
  values(v_uid,v_key,'practice-finish',v_coins,v_xp,0) on conflict do nothing;
  get diagnostics v_inserted=row_count;
  if v_inserted=1 then
    update public.account_profiles set coins=least(2000000,coins+v_coins), xp=least(2000000000,xp+v_xp) where user_id=v_uid;
    return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',false,'coins_awarded',v_coins,'xp_awarded',v_xp);
  end if;
  return public.mathsexpress_player_state() || jsonb_build_object('already_claimed',true,'coins_awarded',0,'xp_awarded',0);
end $$;
revoke all on function public.mathsexpress_claim_practice_completion(text) from public, anon;
grant execute on function public.mathsexpress_claim_practice_completion(text) to authenticated;

-- ---------------------------------------------------------------------------------------------
-- Shop: the driving game was removed, so its car skins can no longer be bought.
-- Owned skins stay in inventories (nothing is deleted). New purchasable titles.
-- ---------------------------------------------------------------------------------------------
-- account_inventory only accepted four consumable ids, so every cosmetic purchase failed with a
-- check-constraint error. Allow catalogue-style cosmetic ids as well (shape-checked).
alter table public.account_inventory drop constraint if exists account_inventory_item_id_check;
alter table public.account_inventory add constraint account_inventory_item_id_check check (
  item_id in ('extra-battery','flash-charge','emergency-unlock','clue-hint')
  or item_id ~ '^(outfit|pet|frame|background|title|theme|avatar|name|game-skin)-[a-z0-9-]{1,80}$');
update public.mathsexpress_shop_catalog set active=false where item_id like 'game-skin-%';
insert into public.mathsexpress_shop_catalog(item_id,price,active) values
  ('title-fraction-fixer',250,true),('title-graph-guardian',350,true),('title-angle-hunter',450,true),
  ('title-pattern-seeker',550,true),('title-proof-builder',800,true),('title-calculus-captain',1100,true),
  ('title-statistics-star',650,true),('title-measurement-master',500,true)
on conflict (item_id) do update set price=excluded.price, active=true;

-- ---------------------------------------------------------------------------------------------
-- Seasons: 7-week seasons starting Monday 5 January 2026 (Sydney time).
-- Season XP is derived from the reward ledger, so progress "resets" each season while
-- achievements, coins and items stay. Classes are ranked on accuracy and completed work.
-- ---------------------------------------------------------------------------------------------
create or replace function private.mx_season_window(p_season integer)
returns table(starts_at timestamptz, ends_at timestamptz)
language sql stable set search_path='public','private','pg_temp' as $$
  select ((date '2026-01-05' + (p_season-1)*49)::timestamp at time zone 'Australia/Sydney'),
         ((date '2026-01-05' + p_season*49)::timestamp at time zone 'Australia/Sydney')
$$;

create or replace function private.mx_current_season() returns integer
language sql stable set search_path='public','private','pg_temp' as $$
  select greatest(1, floor(((now() at time zone 'Australia/Sydney')::date - date '2026-01-05')::numeric / 49)::integer + 1)
$$;

create or replace function private.mx_season_rank(p_xp integer) returns text
language sql immutable set search_path='public','private','pg_temp' as $$
  select case when p_xp>=7500 then 'champion' when p_xp>=4500 then 'diamond' when p_xp>=2500 then 'platinum'
              when p_xp>=1200 then 'gold' when p_xp>=500 then 'silver' when p_xp>=100 then 'bronze' else 'unranked' end
$$;

create or replace function public.mathsexpress_my_season()
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare
  v_uid uuid:=auth.uid(); v_season int; v_start timestamptz; v_end timestamptz; v_xp int; v_rank text;
  v_classes jsonb;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  v_season:=private.mx_current_season();
  select starts_at,ends_at into v_start,v_end from private.mx_season_window(v_season);
  select coalesce(sum(xp),0)::int into v_xp from public.mathsexpress_reward_events
    where user_id=v_uid and created_at>=v_start and created_at<v_end;
  v_rank:=private.mx_season_rank(v_xp);
  -- Standings for every school that has one of my classes (as a student or teacher).
  with mine as (
    select c.id, c.school_id from public.mathrift_classes c
    where not c.archived and c.school_id is not null
      and (c.teacher_id=v_uid or exists(select 1 from public.mathrift_class_members m where m.class_id=c.id and m.student_id=v_uid))
  ), pool as (
    select c.id, coalesce(nullif(c.display_name,''),c.name) as name, c.school_id, c.year_level,
           (c.id in (select id from mine)) as is_mine,
           (select count(*) from public.mathrift_class_members m where m.class_id=c.id) as members
    from public.mathrift_classes c where not c.archived and c.school_id in (select school_id from mine)
  ), work as (
    select p.id,
      coalesce(sum(t.answered),0) as answered, coalesce(sum(t.correct),0) as correct,
      count(t.id) filter (where t.completed_at is not null) as completed,
      (select count(*) from public.mathrift_assignments a2 where a2.class_id=p.id and a2.created_at>=v_start and a2.created_at<v_end) as set_count
    from pool p
    left join public.mathrift_assignments a on a.class_id=p.id
    left join public.mathrift_assignment_attempts t on t.assignment_id=a.id and t.completed_at>=v_start and t.completed_at<v_end
    group by p.id
  ), scored as (
    select p.*, w.answered, w.correct, w.completed, w.set_count,
      case when w.answered>0 then round(100.0*w.correct/w.answered,1) else 0 end as accuracy,
      case when w.set_count>0 and p.members>0 then round(least(100,100.0*w.completed/(w.set_count*p.members)),1) else 0 end as completion
    from pool p join work w on w.id=p.id
  )
  select coalesce(jsonb_agg(jsonb_build_object('class_id',id,'name',name,'year_level',year_level,'is_mine',is_mine,
           'members',members,'accuracy',accuracy,'completion',completion,'score',round(accuracy*0.6+completion*0.4,1))
           order by round(accuracy*0.6+completion*0.4,1) desc, name),'[]'::jsonb)
    into v_classes from scored;
  return jsonb_build_object('season',v_season,'starts_at',v_start,'ends_at',v_end,'season_xp',v_xp,'rank',v_rank,
    'ranks',jsonb_build_array(jsonb_build_object('id','bronze','xp',100),jsonb_build_object('id','silver','xp',500),
      jsonb_build_object('id','gold','xp',1200),jsonb_build_object('id','platinum','xp',2500),
      jsonb_build_object('id','diamond','xp',4500),jsonb_build_object('id','champion','xp',7500)),
    'class_standings',v_classes,
    'score_formula','Class score = 60% accuracy + 40% of set work completed this season',
    'previous_season_claimed', exists(select 1 from public.mathsexpress_reward_events where user_id=v_uid and event_key='season-reward:'||(v_season-1)));
end $$;

create or replace function public.mathsexpress_claim_season_reward()
returns jsonb language plpgsql security definer set search_path='public','private','pg_temp' as $$
declare
  v_uid uuid:=auth.uid(); v_season int:=private.mx_current_season()-1; v_start timestamptz; v_end timestamptz;
  v_xp int; v_rank text; v_item text; v_inserted int;
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  if v_season<1 then raise exception 'No finished season yet'; end if;
  select starts_at,ends_at into v_start,v_end from private.mx_season_window(v_season);
  select coalesce(sum(xp),0)::int into v_xp from public.mathsexpress_reward_events
    where user_id=v_uid and created_at>=v_start and created_at<v_end;
  v_rank:=private.mx_season_rank(v_xp);
  if v_rank='unranked' then raise exception 'Reach Bronze (100 season XP) to earn a season reward'; end if;
  v_item:='title-season-'||v_rank;
  insert into public.mathsexpress_reward_events(user_id,event_key,event_type,coins,xp,game_time_seconds)
    values(v_uid,'season-reward:'||v_season,'season-reward',0,0,0) on conflict do nothing;
  get diagnostics v_inserted=row_count;
  if v_inserted=1 then
    insert into public.account_inventory(user_id,item_id,quantity,updated_at) values(v_uid,v_item,1,now())
      on conflict(user_id,item_id) do update set quantity=greatest(1,account_inventory.quantity),updated_at=now();
  end if;
  return public.mathsexpress_player_state() || jsonb_build_object('season',v_season,'rank',v_rank,'item_id',v_item,'already_claimed',v_inserted=0);
end $$;
revoke all on function public.mathsexpress_my_season() from public, anon;
revoke all on function public.mathsexpress_claim_season_reward() from public, anon;
grant execute on function public.mathsexpress_my_season() to authenticated;
grant execute on function public.mathsexpress_claim_season_reward() to authenticated;

-- ---------------------------------------------------------------------------------------------
-- Live class pulse for teachers: focus state, recent accuracy, time on task and recent wrong
-- answers per student. Only class teachers, school staff and the owner can read it. Grouping
-- (doing well / struggling / inactive) is done in the app with the rules shown on screen.
-- ---------------------------------------------------------------------------------------------
create or replace function public.mathsexpress_class_live_pulse(p_class_id uuid)
returns jsonb language plpgsql stable security definer set search_path='public','private','pg_temp' as $$
declare v_rows jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if not private.mathrift_is_owner() and not private.mathrift_teaches(p_class_id)
     and not exists(select 1 from public.mathrift_classes c join public.mathrift_school_staff ss on ss.school_id=c.school_id
                    where c.id=p_class_id and ss.user_id=auth.uid()) then
    raise exception 'Teacher access required';
  end if;
  select coalesce(jsonb_agg(row_data order by row_data->>'display_name'),'[]'::jsonb) into v_rows from (
    select jsonb_build_object(
      'student_id',m.student_id,
      'display_name',coalesce(nullif(p.display_name,''),'Student'),
      'state',coalesce(f.state,'idle'),
      'hidden_count',coalesce(f.hidden_count,0),
      'focus_updated_at',f.updated_at,
      'assignment_id',f.assignment_id,
      'assignment_title',(select a.title from public.mathrift_assignments a where a.id=f.assignment_id),
      'recent_attempts',(select count(*) from public.mathrift_question_attempts q where q.student_id=m.student_id and q.created_at>now()-interval '30 minutes'),
      'recent_correct',(select count(*) filter (where q.correct) from public.mathrift_question_attempts q where q.student_id=m.student_id and q.created_at>now()-interval '30 minutes'),
      'last6',(select coalesce(jsonb_agg(x.correct order by x.created_at desc),'[]'::jsonb) from (
                 select q.correct,q.created_at from public.mathrift_question_attempts q
                 where q.student_id=m.student_id and q.created_at>now()-interval '2 hours' order by q.created_at desc limit 6) x),
      'last_attempt_at',(select max(q.created_at) from public.mathrift_question_attempts q where q.student_id=m.student_id),
      'time_on_task_seconds',(select coalesce(sum(q.time_seconds),0) from public.mathrift_question_attempts q where q.student_id=m.student_id and q.created_at>now()-interval '30 minutes'),
      'wrong',(select coalesce(jsonb_agg(jsonb_build_object('question_id',w.question_id,'answer',w.answer_text,'feedback',w.feedback,'at',w.created_at,'assignment',w.title) order by w.created_at desc),'[]'::jsonb) from (
                 select q.question_id,left(q.answer_text,200) answer_text,left(q.feedback,300) feedback,q.created_at,a.title
                 from public.mathrift_question_attempts q join public.mathrift_assignments a on a.id=q.assignment_id
                 where q.student_id=m.student_id and a.class_id=p_class_id and not q.correct and q.created_at>now()-interval '14 days'
                 order by q.created_at desc limit 12) w)
    ) as row_data
    from public.mathrift_class_members m
    join public.account_profiles p on p.user_id=m.student_id
    left join public.mathsexpress_focus_status f on f.user_id=m.student_id and f.class_id=p_class_id
    where m.class_id=p_class_id
  ) s;
  return jsonb_build_object('class_id',p_class_id,'generated_at',now(),'students',v_rows);
end $$;
revoke all on function public.mathsexpress_class_live_pulse(uuid) from public, anon;
grant execute on function public.mathsexpress_class_live_pulse(uuid) to authenticated;
