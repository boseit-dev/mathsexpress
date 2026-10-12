-- v11.5.31: Support every class-game mode advertised in the UI.
-- Already applied to the current MathsExpress Supabase project on 2026-10-12.
-- Safe to replay on a new / already-migrated environment (validates all rows).
DO $$
BEGIN
 IF EXISTS (
   SELECT 1 FROM pg_constraint c
   JOIN pg_class t ON t.oid=c.conrelid
   JOIN pg_namespace n ON n.oid=t.relnamespace
   WHERE n.nspname='public' AND t.relname='mathrift_classroom_sessions'
     AND c.conname='mathrift_classroom_sessions_mode_check'
 ) THEN
   ALTER TABLE public.mathrift_classroom_sessions
     DROP CONSTRAINT mathrift_classroom_sessions_mode_check;
 END IF;
 ALTER TABLE public.mathrift_classroom_sessions
   ADD CONSTRAINT mathrift_classroom_sessions_mode_check
   CHECK (mode IN (
   'mastery-challenge','tug-of-war','capture-zone','maths-race','tower-climb',
   'king-of-the-hill','team-relay','last-team-standing','team-quiz','quiz-show',
   'maths-football','basketball-shootout','checkpoint-race','boss-question',
   'tower-defence','dungeon-run','quiz-battle','boss-raid'));
END $$;
