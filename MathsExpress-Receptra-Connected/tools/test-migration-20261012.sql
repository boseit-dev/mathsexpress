-- Rolled-back live test for 20261011_02 + 20261012_01.  Run as:  begin; <02 sql> <03 sql> <this file>
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
declare v_t uuid:=gen_random_uuid(); v_s uuid:=gen_random_uuid(); v_o uuid:=gen_random_uuid();
        v_school uuid; v_class uuid; v_a uuid; v_owner uuid; v_att uuid;
begin
  select user_id into v_owner from public.account_profiles where role='owner' and status='active' limit 1;
  insert into auth.users(id,instance_id,aud,role,email,raw_user_meta_data,created_at,updated_at)
  select x,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','mx-'||x||'@mxtest.invalid','{}',now(),now()
  from unnest(array[v_t,v_s,v_o]) x;
  insert into public.account_profiles(user_id,email,display_name,role,status)
  values (v_t,'mx-'||v_t||'@mxtest.invalid','Test Teacher','teacher','active'),
         (v_s,'mx-'||v_s||'@mxtest.invalid','Test Student','player','active'),
         (v_o,'mx-'||v_o||'@mxtest.invalid','Test Outsider','player','active')
  on conflict (user_id) do update set role=excluded.role,status='active',display_name=excluded.display_name;
  select id into v_school from public.mathrift_schools order by created_at limit 1;
  insert into public.mathrift_school_staff(school_id,user_id,staff_role) values(v_school,v_t,'teacher');
  insert into public.mathrift_school_students(school_id,student_id,year_level) values(v_school,v_s,9);
  insert into public.mathrift_classes(teacher_id,school_id,name,year_level,join_code) values(v_t,v_school,'MX test class',9,'QZ8V6T') returning id into v_class;
  insert into public.mathrift_class_members(class_id,student_id) values(v_class,v_s);
  insert into public.mathrift_assignments(class_id,created_by,title,assignment_type,topic,difficulty,question_count)
    values(v_class,v_t,'MX test task','practice','algebra','medium',2) returning id into v_a;
  insert into public.mathrift_question_attempts(assignment_id,student_id,question_id,answer_text,score_awarded,score_possible,correct,partial)
    values(v_a,v_s,'q1','x=3',1,1,true,false),(v_a,v_s,'q2','7',0,1,false,false);
  insert into public.mathrift_assignment_attempts(assignment_id,student_id,attempt_number,completed_at,answered,correct,score_percent)
    values(v_a,v_s,1,now(),2,1,50) returning id into v_att;
  insert into public.mathrift_activity(student_id,class_id,activity_type,assignment_id,questions,correct,active_seconds,points,payload,occurred_at)
    values(v_s,v_class,'assignment',v_a,2,1,120,10,'{}',now());
  insert into public.mathsexpress_parent_links(school_id,student_id,guardian_email,guardian_name,status)
    values(v_school,v_s,'guardian@mxtest.invalid','Guardian','active');
  insert into _f values('t',v_t),('s',v_s),('o',v_o),('owner',v_owner),('school',v_school),('class',v_class),('a',v_a);
end $$;
select pg_temp.chk('fixtures','owner',$q$ select pg_temp.f('a') is not null and pg_temp.f('owner') is not null $q$);

-- Owner console
select pg_temp.deny('student cannot adjust rewards','s',$q$ select public.mathsexpress_owner_adjust_user_rewards(pg_temp.f('s')::uuid,1000,0,0) $q$);
select pg_temp.deny('teacher cannot adjust rewards','t',$q$ select public.mathsexpress_owner_adjust_user_rewards(pg_temp.f('s')::uuid,1000,0,0) $q$);
select pg_temp.chk('owner adjusts rewards','owner',$q$ select (public.mathsexpress_owner_adjust_user_rewards(pg_temp.f('s')::uuid,250,40,30)->>'coins')::int>=250 $q$);
select pg_temp.chk('adjustment persisted','owner',$q$ select coins>=250 and xp>=40 from public.account_profiles where user_id=pg_temp.f('s')::uuid $q$);
select pg_temp.chk('negative adjustment clamps at zero','owner',$q$ select (public.mathsexpress_owner_adjust_user_rewards(pg_temp.f('s')::uuid,-1000000,-1000000,-300)->>'coins')::int=0 $q$);
select pg_temp.deny('oversized adjustment refused','owner',$q$ select public.mathsexpress_owner_adjust_user_rewards(pg_temp.f('s')::uuid,3000000,0,0) $q$);
select pg_temp.deny('teacher cannot use owner profile edit','t',$q$ select public.mathsexpress_owner_update_user_profile(pg_temp.f('s')::uuid,'Hacked',null,10) $q$);
select pg_temp.chk('owner sets year level and name','owner',$q$ select (r->>'year_level')::int=8 and r->>'display_name'='Renamed Student'
   from (select public.mathsexpress_owner_update_user_profile(pg_temp.f('s')::uuid,'Renamed Student',null,8) r) x $q$);
select pg_temp.deny('owner year 13 refused','owner',$q$ select public.mathsexpress_owner_update_user_profile(pg_temp.f('s')::uuid,null,null,13) $q$);

-- Daily missions
select pg_temp.deny('mission unclaimable without evidence','o',$q$ select public.mathsexpress_claim_daily_mission('answer-5') $q$);
select pg_temp.deny('unknown mission refused','s',$q$ select public.mathsexpress_claim_daily_mission('free-coins') $q$);
select pg_temp.chk('record 4 daily attempts','s',$q$ select count(*)=4 from (select public.mathsexpress_record_daily_question_attempt('k'||i,i<3) from generate_series(1,4) i) x $q$);
select pg_temp.chk('duplicate attempt key not recorded twice','s',$q$ select (public.mathsexpress_record_daily_question_attempt('k1',true)->>'recorded')::boolean=false $q$);
select pg_temp.chk('answer-5 claim pays once','s',$q$ with before as (select coins c from public.account_profiles where user_id=pg_temp.f('s')::uuid)
   select (r->>'already_claimed')::boolean=false from (select public.mathsexpress_claim_daily_mission('answer-5') r) x $q$);
select pg_temp.chk('second claim is already_claimed and pays nothing','s',$q$ with b as (select coins c from public.account_profiles where user_id=pg_temp.f('s')::uuid)
   select (r->>'already_claimed')::boolean and (select coins from public.account_profiles where user_id=pg_temp.f('s')::uuid)=(select c from b)
   from (select public.mathsexpress_claim_daily_mission('answer-5') r) x $q$);
select pg_temp.deny('earn-40-xp needs 40 XP of evidence','s',$q$ select public.mathsexpress_claim_daily_mission('earn-40-xp') $q$);

-- Reviewed Question Studio
select pg_temp.deny('student cannot author','s',$q$ select public.mathsexpress_save_authored_question(null,9,'Algebra','Linear','solve-linear','medium','numeric','Solve 2x+3=11',jsonb_build_object('value','4'),null,null,true) $q$);
select pg_temp.deny('empty answer refused','t',$q$ select public.mathsexpress_save_authored_question(null,9,'Algebra','Linear',null,'medium','numeric','Solve 2x+3=11','{"value":""}',null,null,true) $q$);
select pg_temp.chk('teacher authors question into review','t',$q$ select (public.mathsexpress_save_authored_question(pg_temp.f('school')::uuid,9,'Algebra','Linear','solve-linear','medium','short-answer','Solve 2x+3=11',jsonb_build_object('value','4'),'2x=8, x=4','Teacher-written',true)->>'status')='review' $q$);
select pg_temp.chk('teacher lists own question','t',$q$ select count(*)=1 and bool_and(author_name='Test Teacher' and question_type='written') from public.mathsexpress_list_authored_questions(pg_temp.f('school')::uuid,null,80) where prompt like 'Solve 2x+3%' $q$);
select pg_temp.chk('stats count review','t',$q$ select (public.mathsexpress_authored_question_stats(pg_temp.f('school')::uuid)->>'review')::int>=1 $q$);
select pg_temp.deny('outsider cannot list school questions','o',$q$ select * from public.mathsexpress_list_authored_questions(pg_temp.f('school')::uuid,null,80) $q$);
select pg_temp.deny('teacher cannot publish','t',$q$ select public.mathsexpress_review_authored_question((select id from public.mathsexpress_custom_questions where prompt='Solve 2x+3=11' order by id desc limit 1),'published') $q$);
select pg_temp.chk('owner publishes','owner',$q$ select (public.mathsexpress_review_authored_question((select id from public.mathsexpress_custom_questions where prompt='Solve 2x+3=11' order by id desc limit 1),'published')->>'status')='published' $q$);
select pg_temp.deny('bad review status refused','owner',$q$ select public.mathsexpress_review_authored_question((select id from public.mathsexpress_custom_questions order by id desc limit 1),'approved') $q$);

-- Task reports + reassign
select pg_temp.chk('question report counts real answers','t',$q$ select jsonb_array_length(r->'questions')=2 and jsonb_array_length(r->'grid')=2
   and (select (q->>'correct')::int from jsonb_array_elements(r->'questions') q where q->>'question_id'='q1')=1
   and (select (q->>'incorrect')::int from jsonb_array_elements(r->'questions') q where q->>'question_id'='q2')=1
   from (select public.mathsexpress_task_question_report(pg_temp.f('a')::uuid) r) x $q$);
select pg_temp.deny('student cannot read task report','s',$q$ select public.mathsexpress_task_question_report(pg_temp.f('a')::uuid) $q$);
select pg_temp.chk('question detail lists student answer','t',$q$ select jsonb_array_length(r)=1 and r->0->>'answer_text'='x=3' and (r->0->>'correct')::boolean
   from (select public.mathsexpress_task_question_detail(pg_temp.f('a')::uuid,'q1') r) x $q$);
select pg_temp.chk('reassign returns new id','t',$q$ select (public.mathsexpress_reassign_assignment(pg_temp.f('a')::uuid,now()+interval '7 days','MX retry')->>'id') is not null $q$);
select pg_temp.chk('reassigned copy exists in class','t',$q$ select exists(select 1 from public.mathrift_assignments where title='MX retry' and class_id=pg_temp.f('class')::uuid and due_at>now()) $q$);
select pg_temp.deny('reassign needs a future due date','t',$q$ select public.mathsexpress_reassign_assignment(pg_temp.f('a')::uuid,now()-interval '1 day','x') $q$);
select pg_temp.deny('outsider cannot reassign','o',$q$ select public.mathsexpress_reassign_assignment(pg_temp.f('a')::uuid,now()+interval '7 days','x') $q$);

-- School reports
select pg_temp.chk('usage dashboard real counts','owner',$q$ select (r->'counts'->>'questions')::int>=2 and jsonb_array_length(r->'classes')>=1 and jsonb_array_length(r->'daily')>=1
   from (select public.mathsexpress_school_usage_dashboard(pg_temp.f('school')::uuid,now()-interval '7 days',now()+interval '1 minute') r) x $q$);
select pg_temp.deny('outsider cannot read school usage','o',$q$ select public.mathsexpress_school_usage_dashboard(pg_temp.f('school')::uuid,now()-interval '7 days',now()) $q$);
select pg_temp.chk('class comparison has formula fields','owner',$q$ select exists(select 1 from jsonb_array_elements(r->'classes') c where c->>'name'='MX test class' and (c->>'participation')::numeric=100 and (c->>'completion')::numeric=100 and (c->>'avg_score')::numeric=50)
   from (select public.mathsexpress_engagement_class_comparison(pg_temp.f('school')::uuid,now()-interval '7 days',now()+interval '1 minute') r) x $q$);
select pg_temp.chk('standards growth runs for staff','t',$q$ select jsonb_typeof(public.mathsexpress_standards_growth(pg_temp.f('school')::uuid,now()-interval '90 days',now(),9)->'skills')='array' $q$);
select pg_temp.chk('standards proficiency runs for staff','t',$q$ select public.mathsexpress_school_standards_proficiency(pg_temp.f('school')::uuid) ? 'average_mastery' $q$);
select pg_temp.deny('student cannot read standards','s',$q$ select public.mathsexpress_school_standards_proficiency(pg_temp.f('school')::uuid) $q$);


-- Parent email outbox
select pg_temp.chk('teacher queues guardian message','t',$q$ select (public.mathsexpress_queue_parent_email(pg_temp.f('school')::uuid,pg_temp.f('s')::uuid,'teacher-message','Great work this week')->>'outbox_id') is not null $q$);
select pg_temp.deny('empty message refused','t',$q$ select public.mathsexpress_queue_parent_email(pg_temp.f('school')::uuid,pg_temp.f('s')::uuid,'teacher-message','  ') $q$);
select pg_temp.deny('outsider cannot email guardians','o',$q$ select public.mathsexpress_queue_parent_email(pg_temp.f('school')::uuid,pg_temp.f('s')::uuid,'progress-report',null) $q$);
select pg_temp.deny('no guardian means no queue','t',$q$ select public.mathsexpress_queue_parent_email(pg_temp.f('school')::uuid,pg_temp.f('o')::uuid,'progress-report',null) $q$);
select pg_temp.chk('outbox payload has recipient and body','t',$q$ select jsonb_array_length(p->'recipients')=1 and p->>'body'='Great work this week' and p->>'kind'='teacher-message'
   from (select public.mathsexpress_parent_email_outbox_payload((select max(id) from public.mathsexpress_parent_email_outbox)) p) x $q$);
select pg_temp.chk('mark sent','t',$q$ select (public.mathsexpress_mark_parent_email_outbox((select max(id) from public.mathsexpress_parent_email_outbox),'sent',null)->>'status')='sent' $q$);
select pg_temp.deny('sent email cannot be resent','t',$q$ select public.mathsexpress_parent_email_outbox_payload((select max(id) from public.mathsexpress_parent_email_outbox)) $q$);
select pg_temp.chk('outbox lists own email','t',$q$ select count(*)=1 and bool_and(status='sent' and student_name='Renamed Student') from public.mathsexpress_my_parent_email_outbox(20) $q$);
select pg_temp.chk('outsider outbox is empty','o',$q$ select count(*)=0 from public.mathsexpress_my_parent_email_outbox(20) $q$);
select pg_temp.chk('progress payload uses real activity','t',$q$ select (p->'questions'->>'attempted')::int=2 and (p->'assignments'->>'completed')::int=1 from (select public.mathsexpress_parent_progress_email_payload(pg_temp.f('school')::uuid,pg_temp.f('s')::uuid) p) x $q$);

-- Canvas
select pg_temp.deny('non-numeric canvas ids refused','t',$q$ select public.mathsexpress_save_canvas_assignment_map(pg_temp.f('a')::uuid,'abc','12',true) $q$);
select pg_temp.chk('teacher maps assignment','t',$q$ select (public.mathsexpress_save_canvas_assignment_map(pg_temp.f('a')::uuid,'101','202',true)->>'ok')::boolean $q$);
select pg_temp.chk('teacher maps student','t',$q$ select (public.mathsexpress_save_canvas_user_map(pg_temp.f('school')::uuid,pg_temp.f('s')::uuid,'303')->>'ok')::boolean $q$);
select pg_temp.deny('student cannot map canvas','s',$q$ select public.mathsexpress_save_canvas_user_map(pg_temp.f('school')::uuid,pg_temp.f('s')::uuid,'304') $q$);
select pg_temp.chk('completed attempt is queued once','t',$q$ select count(*)=1 and bool_and(status='queued' and score_percent=50 and canvas_user_id='303')
   from (select * from public.mathsexpress_canvas_grade_queue(pg_temp.f('school')::uuid,100) union all select * from public.mathsexpress_canvas_grade_queue(pg_temp.f('school')::uuid,100) where false) q $q$);
select pg_temp.chk('requeue does not duplicate','t',$q$ select count(*)=1 from public.mathsexpress_canvas_grade_queue(pg_temp.f('school')::uuid,100) $q$);
select pg_temp.chk('mark canvas sent','t',$q$ select (public.mathsexpress_mark_canvas_grade_queue((select max(id) from public.mathsexpress_canvas_grade_queue),'sent',null)->>'ok')::boolean $q$);
select pg_temp.chk('canvas status persisted','t',$q$ select status='sent' from public.mathsexpress_canvas_grade_queue order by id desc limit 1 $q$);
select pg_temp.deny('outsider cannot view canvas queue','o',$q$ select * from public.mathsexpress_canvas_grade_queue(pg_temp.f('school')::uuid,100) $q$);

-- Grants: anon must not execute any new function
-- v11.5.23 class games (migration 02): server-checked answers, one score per issued question
do $$ declare v uuid; begin
  insert into public.mathrift_classroom_sessions(class_id,created_by,mode,status) values(pg_temp.f('class')::uuid,pg_temp.f('t')::uuid,'maths-race','playing') returning id into v;
  insert into _f values('g',v);
end $$;
select pg_temp.chk('student gets a server question','s',$q$ select (q->>'id') is not null and jsonb_array_length(q->'options')=4 and not (q ? 'correct_option') from (select public.mathsexpress_class_game_next_question(pg_temp.f('g')::uuid,9) q) x $q$);
select pg_temp.chk('reload returns the same unanswered question','s',$q$ select public.mathsexpress_class_game_next_question(pg_temp.f('g')::uuid,9)->>'id'=(select id::text from public.mathsexpress_class_game_questions where student_id=pg_temp.f('s')::uuid and answered_at is null) $q$);
select pg_temp.chk('options are four distinct values','s',$q$ select count(distinct o->>'value')=4 from public.mathsexpress_class_game_questions q, jsonb_array_elements(q.options) o where q.student_id=pg_temp.f('s')::uuid and q.answered_at is null $q$);
select pg_temp.deny('outsider cannot get questions','o',$q$ select public.mathsexpress_class_game_next_question(pg_temp.f('g')::uuid,9) $q$);
select pg_temp.deny('forged question key refused','s',$q$ select public.mathsexpress_class_game_answer(pg_temp.f('g')::uuid,'lane-0',gen_random_uuid()::text) $q$);
select pg_temp.chk('correct answer scores','s',$q$ select (r->>'correct')::boolean and not (r->>'blocked')::boolean from (select public.mathsexpress_class_game_answer(pg_temp.f('g')::uuid,q.correct_option,q.id::text) r from public.mathsexpress_class_game_questions q where q.student_id=pg_temp.f('s')::uuid and q.answered_at is null) x $q$);
select pg_temp.chk('score recorded once','s',$q$ select correct=1 and answered=1 from public.mathrift_classroom_game_players where session_id=pg_temp.f('g')::uuid and student_id=pg_temp.f('s')::uuid $q$);
select pg_temp.chk('same question twice is a duplicate','s',$q$ select r->>'reason'='duplicate' from (select public.mathsexpress_class_game_answer(pg_temp.f('g')::uuid,q.correct_option,q.id::text) r from public.mathsexpress_class_game_questions q where q.student_id=pg_temp.f('s')::uuid order by created_at desc limit 1) x $q$);
select pg_temp.chk('next question within 3s hits cooldown','s',$q$ select r->>'reason'='cooldown' from (select public.mathsexpress_class_game_answer(pg_temp.f('g')::uuid,'lane-0',(public.mathsexpress_class_game_next_question(pg_temp.f('g')::uuid,9)->>'id')) r) x $q$);
select pg_temp.chk('duplicate and cooldown did not add score','s',$q$ select answered=1 from public.mathrift_classroom_game_players where session_id=pg_temp.f('g')::uuid and student_id=pg_temp.f('s')::uuid $q$);
select pg_temp.chk('anon has no execute on new RPCs','owner',$q$ select not bool_or(has_function_privilege('anon',p.oid,'execute')) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
   where n.nspname='public' and p.proname in ('mathsexpress_owner_adjust_user_rewards','mathsexpress_claim_daily_mission','mathsexpress_queue_parent_email','mathsexpress_canvas_grade_queue','mathsexpress_class_game_answer','mathsexpress_reassign_assignment') $q$);
select pg_temp.chk('authenticated cannot call the unsafe 2-arg game scorer','owner',$q$ select not has_function_privilege('authenticated','public.mathsexpress_class_game_answer(uuid,boolean)','execute') $q$);

do $x$ begin raise exception 'RESULTS %', (select json_build_object('total',count(*),'passed',count(*) filter (where ok),'failures',coalesce(json_agg(json_build_object('n',name,'d',left(detail,120)) order by step) filter (where not ok),'[]')) from _r); end $x$;
