-- Exercise 20261011_01 against the live schema inside a transaction that is rolled back.
-- Usage: wrap as  begin; <migration> <this file> rollback;  (see tools/run-migration-test.sh)
create temp table _r(step int generated always as identity, name text, ok boolean, detail text);
do $$
declare v_class uuid; v_student uuid; v_teacher uuid; v_outsider uuid; v_thread bigint; v_j jsonb; v_err text;
begin
  -- Fixture class built inside the rolled-back transaction from existing accounts.
  select user_id into v_teacher from public.account_profiles where role in ('teacher','owner') and status='active' limit 1;
  select user_id into v_student from public.account_profiles where role='player' and user_id<>v_teacher limit 1;
  select user_id into v_outsider from public.account_profiles where role='player' and user_id not in (v_teacher,v_student) limit 1;
  insert into public.mathrift_classes(teacher_id,school_id,name,year_level,join_code) values(v_teacher,(select school_id from public.mathrift_classes where school_id is not null limit 1),'Migration test class',9,'ZQ9X7W') returning id into v_class;
  insert into public.mathrift_class_members(class_id,student_id) values(v_class,v_student);
  insert into _r(name,ok,detail) values('fixture found', v_class is not null and v_outsider is not null, null);

  perform set_config('request.jwt.claims', json_build_object('sub',v_student,'role','authenticated')::text, true);
  v_j := public.mathsexpress_create_discussion_thread(v_class,'Help','How do I factorise x^2+5x+6?');
  v_thread := (v_j->>'id')::bigint;
  insert into _r(name,ok) values('student creates thread', (v_j->>'ok')::boolean);
  v_j := public.mathsexpress_list_discussion_threads(v_class,100);
  insert into _r(name,ok,detail) values('student sees own thread', exists(select 1 from jsonb_array_elements(v_j) e where (e->>'id')::bigint=v_thread and (e->>'mine')::boolean), null);
  v_j := public.mathsexpress_reply_discussion_thread(v_thread,'Also part b');
  insert into _r(name,ok) values('student replies', (v_j->>'ok')::boolean);
  begin perform public.mathsexpress_moderate_discussion_thread(v_thread,'closed',null); insert into _r(name,ok) values('student cannot moderate', false);
  exception when others then insert into _r(name,ok,detail) values('student cannot moderate', true, sqlerrm); end;
  begin perform public.mathsexpress_my_parent_links(); insert into _r(name,ok) values('my_parent_links runs for student', true);
  exception when others then insert into _r(name,ok,detail) values('my_parent_links runs for student', false, sqlerrm); end;

  perform set_config('request.jwt.claims', json_build_object('sub',v_outsider,'role','authenticated')::text, true);
  begin perform public.mathsexpress_list_discussion_threads(v_class,100); insert into _r(name,ok) values('outsider cannot list', false);
  exception when others then insert into _r(name,ok,detail) values('outsider cannot list', true, sqlerrm); end;
  begin perform public.mathsexpress_reply_discussion_thread(v_thread,'spam'); insert into _r(name,ok) values('outsider cannot reply', false);
  exception when others then insert into _r(name,ok,detail) values('outsider cannot reply', true, sqlerrm); end;
  begin perform public.mathsexpress_create_discussion_thread(v_class,'x','spam'); insert into _r(name,ok) values('outsider cannot post', false);
  exception when others then insert into _r(name,ok,detail) values('outsider cannot post', true, sqlerrm); end;

  perform set_config('request.jwt.claims', json_build_object('sub',v_teacher,'role','authenticated')::text, true);
  v_j := public.mathsexpress_list_discussion_threads(v_class,100);
  insert into _r(name,ok,detail) values('teacher sees thread with 1 reply', exists(select 1 from jsonb_array_elements(v_j) e where (e->>'id')::bigint=v_thread and jsonb_array_length(e->'posts')=1), null);
  perform public.mathsexpress_reply_discussion_thread(v_thread,'Find two numbers that multiply to 6 and add to 5.');
  insert into _r(name,ok) values('teacher reply marks answered', (select status='answered' from public.mathsexpress_discussion_threads where id=v_thread));
  insert into _r(name,ok) values('teacher post flagged staff', (select bool_or(is_staff) from public.mathsexpress_discussion_posts where thread_id=v_thread));
  perform public.mathsexpress_moderate_discussion_thread(v_thread,null,'class');
  perform public.mathsexpress_moderate_discussion_thread(v_thread,'closed',null);
  insert into _r(name,ok) values('teacher moderates', (select status='closed' and visibility='class' from public.mathsexpress_discussion_threads where id=v_thread));
  begin perform public.mathsexpress_moderate_discussion_thread(v_thread,'bogus',null); insert into _r(name,ok) values('bad status rejected', false);
  exception when others then insert into _r(name,ok,detail) values('bad status rejected', true, sqlerrm); end;

  perform set_config('request.jwt.claims', json_build_object('sub',v_student,'role','authenticated')::text, true);
  begin perform public.mathsexpress_reply_discussion_thread(v_thread,'more'); insert into _r(name,ok) values('closed thread rejects reply', false);
  exception when others then insert into _r(name,ok,detail) values('closed thread rejects reply', true, sqlerrm); end;
  perform set_config('request.jwt.claims', '', true);
  begin perform public.mathsexpress_list_discussion_threads(v_class,100); insert into _r(name,ok) values('anonymous rejected', false);
  exception when others then insert into _r(name,ok,detail) values('anonymous rejected', true, sqlerrm); end;
end $$;
do $x$ begin raise exception 'RESULTS %', (select json_agg(json_build_object('n',name,'ok',ok,'d',left(detail,60)) order by step) from _r); end $x$;
