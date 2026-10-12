-- Rollback for the v11.5.28 deploy (12 Oct 2026). Restores the two functions changed, and
-- removes the bot-access objects. Run only if v11.5.28 must be undone.
CREATE OR REPLACE FUNCTION public.mathsexpress_my_plan()
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public', 'private', 'pg_temp'
AS $function$
declare v_info jsonb; v_paid boolean; v_used int; v_hints int;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  v_info:=private.mx_plan_info(auth.uid());
  v_paid:=(v_info->>'paid')::boolean;
  v_used:=private.mx_free_questions_today(auth.uid());
  select count(*) into v_hints from public.mathsexpress_hint_usage where user_id=auth.uid() and used_at>=private.mx_sydney_day_start();
  return v_info || jsonb_build_object(
    'daily_question_limit', case when v_paid then null else 15 end,
    'questions_today', v_used,
    'questions_left', case when v_paid then null else greatest(0,15-v_used) end,
    'daily_hint_limit', case when v_paid then null else 3 end,
    'hints_today', v_hints,
    'features', jsonb_build_object('ai_tutor',v_paid,'adaptive',v_paid,'step_solutions',v_paid,'tests',v_paid,
      'revision',v_paid,'daily_challenges',v_paid,'all_topics',v_paid,'all_games',v_paid,'full_history',v_paid,
      'advanced_progress',v_paid,'priority_support',v_paid,'full_rewards',v_paid,'all_achievements',v_paid));
end $function$;
CREATE OR REPLACE FUNCTION public.mathsexpress_record_integrity_event(p_assignment_id uuid, p_event_type text, p_payload jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_type text:=lower(trim(coalesce(p_event_type,'')));
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if not exists(select 1 from public.mathrift_assignments a join public.mathrift_class_members m on m.class_id=a.class_id
   where a.id=p_assignment_id and m.student_id=auth.uid()) then raise exception 'Assignment access required'; end if;
 if v_type not in ('tab-hidden','window-blur','fullscreen-exit','paste','copy','focus-return') then raise exception 'Invalid integrity event'; end if;
 insert into public.mathrift_integrity_events(student_id,assignment_id,event_type,payload) values(auth.uid(),p_assignment_id,v_type,coalesce(p_payload,'{}'::jsonb));
 return jsonb_build_object('ok',true);
end $function$;
-- drop function if exists public.mathsexpress_owner_bot_access_list(); drop function if exists public.mathsexpress_owner_set_bot_access(uuid,boolean);
-- drop function if exists public.mathsexpress_my_bot_access(); drop table if exists public.mathsexpress_bot_access;
