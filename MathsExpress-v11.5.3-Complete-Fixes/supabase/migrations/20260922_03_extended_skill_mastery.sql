-- Extends mathrift_skill_mastery.mastery to allow values above 100.
--
-- The client (deploy-app.js: skillMasteryValue / nextSkillMasteryValue /
-- MAX_SKILL_MASTERY) now treats 100% as the first mastery milestone and lets
-- students keep practising past it ("Continue more") toward 110%, 200%,
-- 300%, up to a defensive ceiling of 500. Without this migration, every
-- getSchoolClient().saveSkillMastery() call above 100 silently fails
-- against the old `mastery <= 100` check constraint (the call is
-- fire-and-forget with .catch(()=>{}), so nothing surfaces the failure --
-- the value just never reaches the server, and teacher-facing views that
-- read this table stay stuck at 100).
--
-- Mastery >= 100 already means "mastered" everywhere it's checked (all
-- existing call sites use >=), so raising the ceiling does not change any
-- "is this mastered?" logic -- it only stops discarding real progress
-- beyond it.

alter table public.mathrift_skill_mastery
  drop constraint if exists mathrift_skill_mastery_mastery_check;

alter table public.mathrift_skill_mastery
  add constraint mathrift_skill_mastery_mastery_check
  check (mastery >= 0 and mastery <= 500);
