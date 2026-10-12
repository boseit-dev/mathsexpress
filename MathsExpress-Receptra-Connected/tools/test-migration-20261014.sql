-- Rolled-back live test for 20261014_01 (plans). Run as: begin; <20261011_02 daily-attempt table> <20261014_01 sql> <this file>
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
declare v_t uuid:=gen_random_uuid(); v_s uuid:=gen_random_uuid(); v_s2 uuid:=gen_random_uuid(); v_sc uuid:=gen_random_uuid();
        v_owner uuid; v_school uuid; v_class uuid; v_a uuid;
begin
  select user_id into v_owner from public.account_profiles where role='owner' and status='active' limit 1;
  insert into auth.users(id,instance_id,aud,role,email,raw_user_meta_data,created_at,updated_at)
  select x,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','mx-'||x||'@mxtest.invalid','{}',now(),now()
  from unnest(array[v_t,v_s,v_s2,v_sc]) x;
  insert into public.account_profiles(user_id,email,display_name,role,status,year_level)
  values (v_t,'mx-'||v_t||'@mxtest.invalid','Test Teacher','teacher','active',9),
         (v_s,'mx-'||v_s||'@mxtest.invalid','Free Student','player','active',9),
         (v_s2,'mx-'||v_s2||'@mxtest.invalid','Second Student','player','active',9),
         (v_sc,'mx-'||v_sc||'@mxtest.invalid','School Student','player','active',8)
  on conflict (user_id) do update set role=excluded.role,status='active',year_level=excluded.year_level;
  select id into v_school from public.mathrift_schools order by created_at limit 1;
  insert into public.mathrift_classes(teacher_id,school_id,name,year_level,join_code) values(v_t,v_school,'MX plan class',8,'QZ8V7T') returning id into v_class;
  insert into public.mathrift_class_members(class_id,student_id) values(v_class,v_sc);
  insert into public.mathrift_assignments(class_id,created_by,title,assignment_type,topic,difficulty,question_count)
    values(v_class,v_t,'MX plan task','practice','algebra','medium',5) returning id into v_a;
  insert into public.mathrift_assignment_attempts(assignment_id,student_id,attempt_number,started_at) values(v_a,v_sc,1,now());
  insert into _f values('t',v_t),('s',v_s),('s2',v_s2),('sc',v_sc),('owner',v_owner),('school',v_school),('a',v_a);
end $$;
create function pg_temp.rec(n int, prefix text) returns int language plpgsql as $$
begin for i in 1..n loop perform public.mathsexpress_record_daily_question_attempt(prefix||i,true); end loop; return n; end $$;

-- Who gets what
select pg_temp.chk('free student is on free plan','s',$q$ select r->>'plan'='free' and not (r->>'paid')::boolean and (r->>'daily_question_limit')::int=15 and not (r->'features'->>'ai_tutor')::boolean from (select public.mathsexpress_my_plan() r) z $q$);
select pg_temp.chk('teacher has staff access','t',$q$ select public.mathsexpress_my_plan()->>'plan'='staff' $q$);
select pg_temp.chk('student in licensed school gets school plan','sc',$q$ select r->>'plan'='school' and (r->>'paid')::boolean from (select public.mathsexpress_my_plan() r) z $q$);
select pg_temp.chk('plan tables are not readable by users','s',$q$ select not has_table_privilege('authenticated','public.mathsexpress_entitlements','select') and not has_table_privilege('authenticated','public.mathsexpress_entitlements','insert') and not has_table_privilege('authenticated','public.mathsexpress_school_licences','update') $q$);
select pg_temp.chk('users cannot call grant_plan','s',$q$ select not has_function_privilege('authenticated','public.mathsexpress_grant_plan(uuid,text,integer,text,text,integer,text)','execute') and not has_function_privilege('anon','public.mathsexpress_grant_plan(uuid,text,integer,text,text,integer,text)','execute') $q$);
select pg_temp.deny('direct grant_plan call refused for a student','s',$q$ set local role authenticated; select public.mathsexpress_grant_plan(pg_temp.f('s')::uuid,'complete',365,'promo','hack') $q$);
reset role;

-- Free limits
select pg_temp.chk('15 free questions recorded','s',$q$ select pg_temp.rec(15,'lesson:x:')=15 $q$);
select pg_temp.deny('16th free question refused','s',$q$ select public.mathsexpress_record_daily_question_attempt('lesson:x:16',true) $q$);
select pg_temp.chk('re-sending an already recorded question is fine','s',$q$ select (public.mathsexpress_record_daily_question_attempt('lesson:x:3',true)->>'recorded')::boolean=false $q$);
select pg_temp.chk('my_plan shows 0 left','s',$q$ select (public.mathsexpress_my_plan()->>'questions_left')::int=0 $q$);
select pg_temp.deny('fake assignment key refused','s',$q$ select public.mathsexpress_record_daily_question_attempt('asg:'||gen_random_uuid()||':q1',true) $q$);
select pg_temp.deny('free AI tutor refused','s',$q$ select public.mathsexpress_consume_ai_quota('ai') $q$);
select pg_temp.deny('free AI step marking refused','s',$q$ select public.mathsexpress_consume_ai_quota('mark-step') $q$);
select pg_temp.chk('handwriting input stays free','s',$q$ select (public.mathsexpress_consume_ai_quota('handwriting')->>'ok')::boolean $q$);
select pg_temp.chk('3 free hints','s',$q$ select (public.mathsexpress_use_hint('h1') is not null) and (public.mathsexpress_use_hint('h2') is not null) and (public.mathsexpress_use_hint('h3') is not null) $q$);
select pg_temp.deny('4th hint refused','s',$q$ select public.mathsexpress_use_hint('h4') $q$);
select pg_temp.chk('same hint again is fine','s',$q$ select (public.mathsexpress_use_hint('h2')->>'repeat')::boolean $q$);
do $$ begin insert into public.mathsexpress_reward_events(user_id,event_key,event_type,coins,xp,game_time_seconds,created_at)
  select pg_temp.f('s')::uuid,'mx-rw-'||i,'question',1,0,0,now()-interval '1 minute' from generate_series(1,15) i; end $$;
select pg_temp.chk('free rewards capped at 15/day','s',$q$ select (public.mathsexpress_award_question_reward('mx-rw-16',true,5,10)->>'plan_limited')::boolean $q$);

-- Teacher-set work is not blocked
select pg_temp.chk('school student: assignment key with open attempt accepted','sc',$q$ select (public.mathsexpress_record_daily_question_attempt('asg:'||pg_temp.f('a')||':q1',true)->>'recorded')::boolean $q$);

-- Paid plans
select pg_temp.chk('grant secondary pro (server)','owner',$q$ select (public.mathsexpress_grant_plan(pg_temp.f('s')::uuid,'secondary_pro',365,'stripe','cs_test_1',1500,'aud')->>'ok')::boolean $q$);
select pg_temp.chk('same payment reference is not applied twice','owner',$q$ select (public.mathsexpress_grant_plan(pg_temp.f('s')::uuid,'secondary_pro',365,'stripe','cs_test_1',1500,'aud')->>'duplicate')::boolean $q$);
select pg_temp.chk('paid student: secondary pro, unlimited','s',$q$ select r->>'plan'='secondary_pro' and (r->>'paid')::boolean and r->'daily_question_limit'='null'::jsonb from (select public.mathsexpress_my_plan() r) z $q$);
select pg_temp.chk('paid student can keep practising','s',$q$ select (public.mathsexpress_record_daily_question_attempt('lesson:x:16',true)->>'recorded')::boolean $q$);
select pg_temp.chk('paid student can use AI tutor','s',$q$ select (public.mathsexpress_consume_ai_quota('ai')->>'ok')::boolean $q$);
select pg_temp.chk('paid student unlimited hints','s',$q$ select public.mathsexpress_use_hint('h5') is not null $q$);
select pg_temp.chk('primary pro does not unlock a Year 9 student','owner',$q$ select (public.mathsexpress_grant_plan(pg_temp.f('s2')::uuid,'primary_pro',365,'stripe','cs_test_2',1000,'aud')->>'ok')::boolean and not (private.mx_plan_info(pg_temp.f('s2')::uuid)->>'paid')::boolean $q$);
select pg_temp.deny('teacher cannot set plans','t',$q$ select public.mathsexpress_owner_set_user_plan(pg_temp.f('s2')::uuid,'complete',365) $q$);
select pg_temp.chk('owner sets complete','owner',$q$ select public.mathsexpress_owner_set_user_plan(pg_temp.f('s2')::uuid,'complete',30)->'info'->>'plan'='complete' $q$);
select pg_temp.chk('owner sets back to free','owner',$q$ select public.mathsexpress_owner_set_user_plan(pg_temp.f('s2')::uuid,'free',1)->'info'->>'plan'='free' $q$);
do $$ begin update public.mathsexpress_entitlements set expires_at=now()-interval '1 day' where user_id=pg_temp.f('s')::uuid; end $$;
select pg_temp.chk('expired plan falls back to free','s',$q$ select public.mathsexpress_my_plan()->>'plan'='free' $q$);
select pg_temp.chk('owner can switch a school licence off','owner',$q$ select (public.mathsexpress_owner_set_school_licence(pg_temp.f('school')::uuid,false,null)->>'ok')::boolean $q$);
select pg_temp.chk('school student is free once the licence is off','sc',$q$ select public.mathsexpress_my_plan()->>'plan'='free' $q$);
select pg_temp.deny('student cannot change school licences','s',$q$ select public.mathsexpress_owner_set_school_licence(pg_temp.f('school')::uuid,true,null) $q$);
select pg_temp.chk('anon cannot call plan functions','owner',$q$ select not bool_or(has_function_privilege('anon',p.oid,'execute')) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
   where n.nspname='public' and p.proname in ('mathsexpress_my_plan','mathsexpress_use_hint','mathsexpress_owner_set_user_plan','mathsexpress_owner_set_school_licence','mathsexpress_grant_plan','mathsexpress_record_daily_question_attempt','mathsexpress_consume_ai_quota') $q$);

do $x$ begin raise exception 'RESULTS %', (select json_build_object('total',count(*),'passed',count(*) filter (where ok),'failures',coalesce(json_agg(json_build_object('n',name,'d',left(detail,160)) order by step) filter (where not ok),'[]')) from _r); end $x$;
