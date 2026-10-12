-- Rolled-back live test for 20261013_01. Run as:  begin; <20261011_02 sql> <20261013_01 sql> <this file>
-- The final RAISE aborts the transaction, so nothing persists. Fixture accounts are created inside it.
-- Each check runs on its own, so one failure never hides the rest.
create temp table _r(step int generated always as identity, name text, ok boolean, detail text);
create temp table _f(k text primary key, v text);
create function pg_temp.f(k text) returns text language sql as $$ select v from _f where _f.k=$1 $$;
create function pg_temp.as_user(k text) returns void language sql as $$ select set_config('request.jwt.claims', json_build_object('sub',pg_temp.f(k),'role','authenticated')::text, true) $$;
-- check: runs a boolean query as a user
create function pg_temp.chk(n text, who text, q text) returns void language plpgsql as $$
declare b boolean;
begin
  perform pg_temp.as_user(who);
  execute q into b;
  insert into _r(name,ok) values(n,coalesce(b,false));
exception when others then insert into _r(name,ok,detail) values(n,false,sqlerrm);
end $$;
-- deny: the statement must raise
create function pg_temp.deny(n text, who text, q text) returns void language plpgsql as $$
begin
  perform pg_temp.as_user(who);
  execute q;
  insert into _r(name,ok,detail) values(n,false,'expected an error');
exception when others then insert into _r(name,ok,detail) values(n,true,sqlerrm);
end $$;

do $$
declare v_t uuid:=gen_random_uuid(); v_s uuid:=gen_random_uuid(); v_s2 uuid:=gen_random_uuid(); v_o uuid:=gen_random_uuid();
        v_school uuid; v_class uuid; v_a uuid; v_owner uuid; v_g uuid; v_old uuid;
begin
  select user_id into v_owner from public.account_profiles where role='owner' and status='active' limit 1;
  insert into auth.users(id,instance_id,aud,role,email,raw_user_meta_data,created_at,updated_at)
  select x,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','mx-'||x||'@mxtest.invalid','{}',now(),now()
  from unnest(array[v_t,v_s,v_s2,v_o]) x;
  insert into public.account_profiles(user_id,email,display_name,role,status)
  values (v_t,'mx-'||v_t||'@mxtest.invalid','Test Teacher','teacher','active'),
         (v_s,'mx-'||v_s||'@mxtest.invalid','Test Student','player','active'),
         (v_s2,'mx-'||v_s2||'@mxtest.invalid','Test Student Two','player','active'),
         (v_o,'mx-'||v_o||'@mxtest.invalid','Test Outsider','player','active')
  on conflict (user_id) do update set role=excluded.role,status='active',display_name=excluded.display_name;
  update public.account_profiles set coins=1000 where user_id=v_s;
  select id into v_school from public.mathrift_schools order by created_at limit 1;
  insert into public.mathrift_school_staff(school_id,user_id,staff_role) values(v_school,v_t,'teacher');
  insert into public.mathrift_classes(teacher_id,school_id,name,year_level,join_code) values(v_t,v_school,'MX test class',9,'QZ8V6T') returning id into v_class;
  insert into public.mathrift_class_members(class_id,student_id) values(v_class,v_s),(v_class,v_s2);
  insert into public.mathrift_assignments(class_id,created_by,title,assignment_type,topic,difficulty,question_count)
    values(v_class,v_t,'MX test task','practice','algebra','medium',2) returning id into v_a;
  insert into public.mathrift_question_attempts(assignment_id,student_id,question_id,answer_text,score_awarded,score_possible,correct,partial)
    values(v_a,v_s,'q1','x=3',1,1,true,false),(v_a,v_s,'q2','7',0,1,false,false);
  insert into public.mathrift_assignment_attempts(assignment_id,student_id,attempt_number,completed_at,answered,correct,score_percent)
    values(v_a,v_s,1,now(),2,1,50);
  insert into public.mathrift_classroom_sessions(class_id,created_by,mode,status,config)
    values(v_class,v_t,'maths-race','playing','{"topic":"statistics","year_level":8,"duration_minutes":5}') returning id into v_g;
  insert into public.mathrift_classroom_sessions(class_id,created_by,mode,status,config,created_at)
    values(v_class,v_t,'maths-race','playing','{"duration_minutes":10}',now()-interval '20 minutes') returning id into v_old;
  -- season 5 XP for the student (600 = silver)
  insert into public.mathsexpress_reward_events(user_id,event_key,event_type,coins,xp,game_time_seconds,created_at)
    values(v_s,'mx-test-season5','question',0,600,0,(select starts_at+interval '3 days' from private.mx_season_window(private.mx_current_season()-1)));
  insert into _f values('t',v_t),('s',v_s),('s2',v_s2),('o',v_o),('owner',v_owner),('class',v_class),('a',v_a),('g',v_g),('old',v_old);
end $$;
create function pg_temp.many(n int) returns int language plpgsql as $$
begin
  for i in 1..n loop
    perform public.mathsexpress_class_game_next_question(pg_temp.f('g')::uuid,3);
    update public.mathsexpress_class_game_questions set answered_at=now() where student_id=pg_temp.f('s')::uuid and answered_at is null;
  end loop;
  return n;
end $$;
select pg_temp.chk('fixtures','owner',$q$ select pg_temp.f('g') is not null and pg_temp.f('owner') is not null $q$);

-- Class games: teacher topic/year, distractor balance, expiry, privacy
select pg_temp.chk('generate 40 questions','s',$q$ select pg_temp.many(40)=40 $q$);
select pg_temp.chk('session topic and year are used (Year 8 statistics = median)','owner',$q$ select bool_and(prompt like 'Median of%') from public.mathsexpress_class_game_questions where student_id=pg_temp.f('s')::uuid $q$);
select pg_temp.chk('correct option is not always the smallest','owner',$q$ select count(*) filter (where (select min((o->>'value')::int) from jsonb_array_elements(options) o)=(select (o->>'value')::int from jsonb_array_elements(options) o where o->>'id'=correct_option)) < 30 from public.mathsexpress_class_game_questions where student_id=pg_temp.f('s')::uuid $q$);
select pg_temp.chk('correct option position varies','owner',$q$ select count(distinct correct_option)>=3 from public.mathsexpress_class_game_questions where student_id=pg_temp.f('s')::uuid $q$);
select pg_temp.chk('answers are correct (median check)','owner',$q$ select bool_and((select (o->>'value')::int from jsonb_array_elements(options) o where o->>'id'=correct_option) =
   (select v from (select unnest(string_to_array(regexp_replace(prompt,'[^0-9,]','','g'),','))::int v) z order by v offset 2 limit 1)) from public.mathsexpress_class_game_questions where student_id=pg_temp.f('s')::uuid $q$);
select pg_temp.chk('all options distinct','owner',$q$ select bool_and((select count(distinct o->>'value') from jsonb_array_elements(options) o)=4) from public.mathsexpress_class_game_questions where student_id=pg_temp.f('s')::uuid $q$);
select pg_temp.deny('finished game gives no new questions','s',$q$ select public.mathsexpress_class_game_next_question(pg_temp.f('old')::uuid,9) $q$);
select pg_temp.chk('second student joins','s2',$q$ select (public.mathsexpress_class_game_next_question(pg_temp.f('g')::uuid,9)->>'id') is not null $q$);
select pg_temp.chk('student sees own counts only','s',$q$ select bool_and(case when is_me then answered is not null else answered is null and correct is null end) and count(*)=2 from public.mathsexpress_class_game_leaderboard(pg_temp.f('g')::uuid) $q$);
select pg_temp.chk('teacher sees every count','t',$q$ select bool_and(answered is not null) and count(*)=2 from public.mathsexpress_class_game_leaderboard(pg_temp.f('g')::uuid) $q$);
select pg_temp.deny('outsider cannot read leaderboard','o',$q$ select * from public.mathsexpress_class_game_leaderboard(pg_temp.f('g')::uuid) $q$);

create function pg_temp.grid() returns int language plpgsql as $$
declare n int:=0; v uuid; q jsonb; t text;
begin
  foreach t in array array['number','algebra','measurement','statistics','mixed'] loop
    for y in 0..12 loop
      insert into public.mathrift_classroom_sessions(class_id,created_by,mode,status,config)
        values(pg_temp.f('class')::uuid,pg_temp.f('t')::uuid,'maths-race','playing',jsonb_build_object('topic',t,'year_level',y)) returning id into v;
      q:=public.mathsexpress_class_game_next_question(v,9);
      if jsonb_array_length(q->'options')=4 and length(q->>'prompt')>3 then n:=n+1; end if;
    end loop;
  end loop;
  return n;
end $$;
select pg_temp.chk('all 5 topics x 13 years generate questions','s',$q$ select pg_temp.grid()=65 $q$);

-- Finishing reward
select pg_temp.deny('no reward without evidence','s',$q$ select public.mathsexpress_claim_practice_completion('run-1') $q$);
select pg_temp.chk('record 5 answers','s',$q$ select count(*)=5 from (select public.mathsexpress_record_daily_question_attempt('mx-ev-'||i,true) from generate_series(1,5) i) z $q$);
select pg_temp.chk('finishing reward pays 15 coins','s',$q$ select (public.mathsexpress_claim_practice_completion('run-1')->>'coins_awarded')::int=15 $q$);
select pg_temp.chk('same run is not paid twice','s',$q$ select (public.mathsexpress_claim_practice_completion('run-1')->>'already_claimed')::boolean $q$);
select pg_temp.deny('new run needs new answers','s',$q$ select public.mathsexpress_claim_practice_completion('run-2') $q$);
select pg_temp.deny('anonymous cannot claim','nobody',$q$ select public.mathsexpress_claim_practice_completion('run-3') $q$);

-- Seasons
select pg_temp.chk('season summary for student','s',$q$ select (r->>'season')::int>=2 and r ? 'season_xp' and exists(select 1 from jsonb_array_elements(r->'class_standings') c where (c->>'is_mine')::boolean and (c->>'accuracy')::numeric=50) from (select public.mathsexpress_my_season() r) z $q$);
select pg_temp.chk('outsider has no class standings','o',$q$ select jsonb_array_length(public.mathsexpress_my_season()->'class_standings')=0 $q$);
select pg_temp.chk('silver season reward granted','s',$q$ select r->>'item_id'='title-season-silver' and not (r->>'already_claimed')::boolean from (select public.mathsexpress_claim_season_reward() r) z $q$);
select pg_temp.chk('season reward is in inventory','owner',$q$ select exists(select 1 from public.account_inventory where user_id=pg_temp.f('s')::uuid and item_id='title-season-silver') $q$);
select pg_temp.chk('season reward only once','s',$q$ select (public.mathsexpress_claim_season_reward()->>'already_claimed')::boolean $q$);
select pg_temp.deny('unranked player gets no season reward','o',$q$ select public.mathsexpress_claim_season_reward() $q$);
select pg_temp.chk('season title can be equipped','s',$q$ select public.mathsexpress_equip_cosmetic('title','title-season-silver') is not null $q$);

-- Shop
select pg_temp.chk('cosmetic purchase works (inventory constraint fixed)','s',$q$ select public.mathsexpress_purchase_cosmetic('title-rookie-solver') is not null $q$);
select pg_temp.chk('purchased item is in inventory','s',$q$ select exists(select 1 from public.account_inventory where user_id=pg_temp.f('s')::uuid and item_id='title-rookie-solver') $q$);
select pg_temp.deny('car skins can no longer be bought','s',$q$ select public.mathsexpress_purchase_cosmetic('game-skin-city-racer') $q$);
select pg_temp.chk('new titles are in the catalogue','owner',$q$ select count(*)=8 from public.mathsexpress_shop_catalog where active and item_id in ('title-fraction-fixer','title-graph-guardian','title-angle-hunter','title-pattern-seeker','title-proof-builder','title-calculus-captain','title-statistics-star','title-measurement-master') $q$);
select pg_temp.deny('season titles cannot be bought','o',$q$ select public.mathsexpress_purchase_cosmetic('title-season-gold') $q$);

-- Live class pulse
select pg_temp.chk('teacher sees live pulse with wrong answers','t',$q$ select exists(select 1 from jsonb_array_elements(public.mathsexpress_class_live_pulse(pg_temp.f('class')::uuid)->'students') st where st->>'display_name'='Test Student' and jsonb_array_length(st->'wrong')=1 and (st->>'recent_attempts')::int=2) $q$);
select pg_temp.chk('owner can open live pulse','owner',$q$ select jsonb_array_length(public.mathsexpress_class_live_pulse(pg_temp.f('class')::uuid)->'students')=2 $q$);
select pg_temp.deny('student cannot open live pulse','s',$q$ select public.mathsexpress_class_live_pulse(pg_temp.f('class')::uuid) $q$);
select pg_temp.deny('outsider cannot open live pulse','o',$q$ select public.mathsexpress_class_live_pulse(pg_temp.f('class')::uuid) $q$);

-- Grants
select pg_temp.chk('anon has no execute on new RPCs','owner',$q$ select not bool_or(has_function_privilege('anon',p.oid,'execute')) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
   where n.nspname='public' and p.proname in ('mathsexpress_claim_practice_completion','mathsexpress_my_season','mathsexpress_claim_season_reward','mathsexpress_class_live_pulse','mathsexpress_class_game_leaderboard','mathsexpress_class_game_next_question') $q$);

do $x$ begin raise exception 'RESULTS %', (select json_build_object('total',count(*),'passed',count(*) filter (where ok),'failures',coalesce(json_agg(json_build_object('n',name,'d',left(detail,160)) order by step) filter (where not ok),'[]')) from _r); end $x$;
