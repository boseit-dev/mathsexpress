-- MathsExpress v11.5.34: teacher-controlled class features and announcement management.
-- Restricts operations on the server as well as hiding controls in the UI.
CREATE TABLE IF NOT EXISTS public.mathsexpress_class_controls_config (
 class_id uuid PRIMARY KEY REFERENCES public.mathrift_classes(id) ON DELETE CASCADE,
 games_enabled boolean NOT NULL DEFAULT true,
 announcements_enabled boolean NOT NULL DEFAULT true,
 student_posts_enabled boolean NOT NULL DEFAULT true,
 changed_by uuid,
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mathsexpress_class_controls_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mathsexpress_class_controls_config FROM public, anon, authenticated;

create or replace function public.mathsexpress_class_controls(p_class_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path='public','private','pg_temp' AS $$
DECLARE c public.mathsexpress_class_controls_config; BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 IF p_class_id IS NULL OR NOT (private.mathrift_teaches(p_class_id) OR private.mathrift_in_class(p_class_id) OR private.mathrift_is_owner())
 THEN RAISE EXCEPTION 'Class access required'; END IF;
 SELECT * INTO c FROM public.mathsexpress_class_controls_config WHERE class_id=p_class_id;
 RETURN jsonb_build_object('games_enabled',coalesce(c.games_enabled,true),'announcements_enabled',coalesce(c.announcements_enabled,true),'student_posts_enabled',coalesce(c.student_posts_enabled,true));
END $$;
create or replace function public.mathsexpress_set_class_controls(p_class_id uuid,p_games_enabled boolean,p_announcements_enabled boolean,p_student_posts_enabled boolean)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path='public','private','pg_temp' AS $$
BEGIN
 IF auth.uid() IS NULL OR p_class_id IS NULL OR NOT (private.mathrift_teaches(p_class_id) OR private.mathrift_is_owner())
 THEN RAISE EXCEPTION 'Class teacher access required'; END IF;
 INSERT INTO public.mathsexpress_class_controls_config(class_id,games_enabled,announcements_enabled,student_posts_enabled,changed_by)
 VALUES(p_class_id,coalesce(p_games_enabled,true),coalesce(p_announcements_enabled,true),coalesce(p_student_posts_enabled,true),auth.uid())
 ON CONFLICT(class_id) DO UPDATE SET games_enabled=excluded.games_enabled,announcements_enabled=excluded.announcements_enabled,
 student_posts_enabled=excluded.student_posts_enabled,changed_by=excluded.changed_by,updated_at=now();
 RETURN public.mathsexpress_class_controls(p_class_id);
END $$;

create or replace function public.mathsexpress_archive_class_announcement(p_content_id bigint)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path='public','private','pg_temp' AS $$
DECLARE c public.mathsexpress_school_content;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 SELECT * INTO c FROM public.mathsexpress_school_content WHERE id=p_content_id FOR UPDATE;
 IF NOT FOUND OR c.content_type <> 'announcement' OR c.class_id IS NULL THEN RAISE EXCEPTION 'Class announcement not found'; END IF;
 IF NOT (private.mathrift_teaches(c.class_id) OR (c.created_by=auth.uid() AND private.mathrift_teaches(c.class_id)) OR private.mathrift_is_owner()) THEN
   RAISE EXCEPTION 'Only class teachers can delete announcements';
 END IF;
 UPDATE public.mathsexpress_school_content SET status='archived',updated_at=now() WHERE id=p_content_id;
 RETURN jsonb_build_object('ok',true,'id',p_content_id);
END $$;

-- Students may post to their class if staff have permitted it; the existing teacher moderation UI may hide/close posts.
create or replace function public.mathsexpress_create_class_post(p_class_id uuid,p_subject text,p_body text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path='public','private','pg_temp' AS $$
DECLARE v_id bigint; v_subject text:=btrim(coalesce(p_subject,''));v_body text:=btrim(coalesce(p_body,''));
BEGIN
 IF auth.uid() IS NULL OR NOT private.mathrift_in_class(p_class_id) THEN RAISE EXCEPTION 'Class membership required'; END IF;
 IF EXISTS (SELECT 1 FROM public.mathsexpress_class_controls_config WHERE class_id=p_class_id AND NOT student_posts_enabled) THEN
   RAISE EXCEPTION 'Your teacher has disabled student posts'; END IF;
 IF length(v_subject) NOT BETWEEN 1 AND 100 OR length(v_body) NOT BETWEEN 2 AND 2000 THEN RAISE EXCEPTION 'Add a title and message'; END IF;
 IF (SELECT count(*) FROM public.mathsexpress_discussion_threads WHERE student_id=auth.uid() AND created_at>now()-interval '1 hour')>=10 THEN
   RAISE EXCEPTION 'Posting limit reached, please try again later'; END IF;
 INSERT INTO public.mathsexpress_discussion_threads(class_id,student_id,subject,body,visibility)
 VALUES(p_class_id,auth.uid(),'Post: '||v_subject,v_body,'class') RETURNING id INTO v_id;
 RETURN jsonb_build_object('ok',true,'id',v_id);
END $$;

CREATE OR REPLACE FUNCTION private.mathsexpress_guard_class_discussion()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path='public','private','pg_temp' AS $$
DECLARE v_class uuid;
BEGIN
 v_class:=CASE WHEN TG_TABLE_NAME='mathsexpress_discussion_posts'
    THEN (SELECT class_id FROM public.mathsexpress_discussion_threads WHERE id=NEW.thread_id)
    ELSE NEW.class_id END;
 IF auth.uid() IS NOT NULL AND NOT (private.mathrift_teaches(v_class) OR private.mathrift_is_owner())
    AND EXISTS(SELECT 1 FROM public.mathsexpress_class_controls_config WHERE class_id=v_class AND NOT student_posts_enabled) THEN
   RAISE EXCEPTION 'Student posting is disabled by your teacher';
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS mx_guard_student_thread ON public.mathsexpress_discussion_threads;
CREATE TRIGGER mx_guard_student_thread BEFORE INSERT ON public.mathsexpress_discussion_threads
 FOR EACH ROW EXECUTE FUNCTION private.mathsexpress_guard_class_discussion();
DROP TRIGGER IF EXISTS mx_guard_student_reply ON public.mathsexpress_discussion_posts;
CREATE TRIGGER mx_guard_student_reply BEFORE INSERT ON public.mathsexpress_discussion_posts
 FOR EACH ROW EXECUTE FUNCTION private.mathsexpress_guard_class_discussion();

-- Even students who joined a game before it was blocked cannot receive new questions or update scores.
CREATE OR REPLACE FUNCTION private.mathsexpress_guard_class_games()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path='public','private','pg_temp' AS $$
DECLARE v_class uuid; BEGIN
 SELECT class_id INTO v_class FROM public.mathrift_classroom_sessions WHERE id=NEW.session_id;
 IF v_class IS NOT NULL AND auth.uid() IS NOT NULL AND NOT (private.mathrift_teaches(v_class) OR private.mathrift_is_owner())
   AND EXISTS(SELECT 1 FROM public.mathsexpress_class_controls_config WHERE class_id=v_class AND NOT games_enabled) THEN
   RAISE EXCEPTION 'Your teacher has paused class games';
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS mx_guard_class_game_player ON public.mathrift_classroom_game_players;
CREATE TRIGGER mx_guard_class_game_player BEFORE INSERT OR UPDATE ON public.mathrift_classroom_game_players
 FOR EACH ROW EXECUTE FUNCTION private.mathsexpress_guard_class_games();
DROP TRIGGER IF EXISTS mx_guard_class_game_question ON public.mathsexpress_class_game_questions;
CREATE TRIGGER mx_guard_class_game_question BEFORE INSERT ON public.mathsexpress_class_game_questions
 FOR EACH ROW EXECUTE FUNCTION private.mathsexpress_guard_class_games();

-- Keep server-side announcement lists consistent with student-facing controls.
create or replace function public.mathsexpress_list_content(p_school_id uuid DEFAULT NULL, p_class_id uuid DEFAULT NULL, p_limit integer DEFAULT 100)
RETURNS TABLE(id bigint,school_id uuid,class_id uuid,content_type text,title text,body text,payload jsonb,status text,starts_at timestamptz,ends_at timestamptz,created_by uuid,created_at timestamptz,updated_at timestamptz,votes bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path='public','private','pg_temp' AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 IF p_school_id IS NOT NULL AND NOT private.mathrift_school_is_member(p_school_id) AND NOT private.mathrift_is_owner() THEN RAISE EXCEPTION 'School access required'; END IF;
 IF p_class_id IS NOT NULL AND NOT private.mathrift_in_class(p_class_id) AND NOT private.mathrift_teaches(p_class_id) AND NOT private.mathrift_is_owner() THEN RAISE EXCEPTION 'Class access required'; END IF;
 RETURN QUERY SELECT c.id,c.school_id,c.class_id,c.content_type,c.title,c.body,c.payload,c.status,c.starts_at,c.ends_at,c.created_by,c.created_at,c.updated_at,count(v.user_id)::bigint
 FROM public.mathsexpress_school_content c LEFT JOIN public.mathsexpress_content_votes v ON v.content_id=c.id
 WHERE c.status<>'archived'
 AND (c.school_id IS NULL OR p_school_id IS NULL OR c.school_id=p_school_id)
 AND (p_class_id IS NULL OR c.class_id IS NULL OR c.class_id=p_class_id)
 AND (c.school_id IS NULL OR private.mathrift_school_is_member(c.school_id) OR private.mathrift_is_owner())
 AND (c.class_id IS NULL OR private.mathrift_in_class(c.class_id) OR private.mathrift_teaches(c.class_id) OR private.mathrift_school_role(c.school_id) IS NOT NULL OR private.mathrift_is_owner())
 AND (c.content_type<>'announcement' OR c.class_id IS NULL OR private.mathrift_teaches(c.class_id) OR private.mathrift_is_owner()
       OR NOT EXISTS(SELECT 1 FROM public.mathsexpress_class_controls_config cc WHERE cc.class_id=c.class_id AND NOT cc.announcements_enabled))
 GROUP BY c.id ORDER BY c.created_at DESC LIMIT greatest(1,least(coalesce(p_limit,100),300));
END $$;

REVOKE ALL ON FUNCTION public.mathsexpress_class_controls(uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mathsexpress_set_class_controls(uuid,boolean,boolean,boolean) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mathsexpress_archive_class_announcement(bigint) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.mathsexpress_create_class_post(uuid,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.mathsexpress_class_controls(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mathsexpress_set_class_controls(uuid,boolean,boolean,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mathsexpress_archive_class_announcement(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mathsexpress_create_class_post(uuid,text,text) TO authenticated;
