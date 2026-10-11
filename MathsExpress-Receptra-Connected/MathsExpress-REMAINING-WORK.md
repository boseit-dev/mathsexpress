# MathsExpress: remaining work after v11.5.21

> **v11.5.22 audit update (11 October 2026):** See `V11.5.22-VERIFIED-AUDIT.md` for fixes and test evidence. The original checklist below is preserved as the pre-audit handoff: the fake duels/replay/spectate display and `.netlify/functions` fallbacks have now been addressed in source, and the client class-game display now uses the real Blue/Gold leaderboard. **Backend class-game engine, server-side double-submit protection, RPC issues, migrations and production validation are still outstanding.**

Status on 11 October 2026: v11.5.21 is committed in the zip but **not deployed**, and its migration has **not been applied**. Production is still v11.5.20.

## 0 · Ship v11.5.21 (do this first)

1. Re-check that production still matches v11.5.20 (handoff §9 recipe). If it doesn't, someone deployed in the meantime, so merge before shipping.
2. Apply `supabase/migrations/20261011_01_discussion_and_parent_links.sql` in the Supabase SQL editor (project `dsjrxkxjcaurrbijihja`). **Do this before the deploy**, or the discussion board errors.
3. `npm test` (38 tests), then `CLOUDFLARE_ACCOUNT_ID=df54a2f628189b307a0472885a03be34 npm run deploy`.
4. Verify on production while signed in:
   - signup with a class code
   - header Sign out
   - the Ask Teacher board (student post, then teacher reply, close and share)
   - Parents & Guardians modal
   - a class game (join, answer, leaderboard)
   - Friend challenge (same code in two accounts gives the same questions)
   - A/B/C/D keys
5. **Visually check logged-in screens in Dark mode, the dark theme and High contrast.** These were only contrast-tested on the login screen and header. The rest relies on the generated override block. If something looks off, fix the base rule and re-run `python3 -I tools/gen-dark-overrides.py public/styles.css`.
6. Connect Workers Builds (approved, not done): Worker `mathsexpress` → Settings → Build. Repo `boseit-dev/mathsexpress`, branch `main`, root dir `MathsExpress-Receptra-Connected`, build command empty, deploy command `npx wrangler deploy`.
7. Push the v11.5.21 commit to `boseit-dev/mathsexpress` (it is only in the local git inside the zip).

## 1 · Left over from v11.5.21 (small)

| Item | Notes |
| --- | --- |
| Class games: `class_game_state_v114`, `class_game_snapshot_v114` | Not built. The client falls back to the leaderboard, but the UI's game visuals expect a team-level `game_state` (ball, marker, mastery, Blue/Red). The server only knows Blue/Gold teams and different modes (capture-zone, maths-race…). This needs a real game engine in SQL, or the client modes reduced to what the server supports. |
| Class game answer de-duplication | `p_question_key` was dropped because `class_game_answer` doesn't accept it. A double-submit can now count twice. Add the parameter plus a unique key server-side. |
| Daily question attempt tracking | `recordDailyQuestionAttempt` is a no-op. If attempt (not reward) tracking is wanted, build a dedicated table and RPC. **Do not** alias it to `award_question_reward`. |
| Other fake tools in the "Power tools" area | Spotted while fixing the challenge code: **Maths Duels**, **Game replay summary** (hardcoded "Question 3/7/10") and **Teacher spectate** are static placeholders. Build them or remove them. |
| `/.netlify/functions/*` fallbacks | Dead fallback endpoints in `deploy-app.js`, harmless but noise. Remove. |
| "Random numbers beside names" in Textbook | Interpreted as the unlabelled section count beside chapter names (now "N lessons"). Confirm with the person who reported it. |
| "Custom loading screen" | Restyled the existing one. Confirm it is what was wanted. |

## 2 · RPC audit: what's still broken (from handoff §6)

### Signature mismatches (need a migration or a reduced client call)

| Client calls | Existing function | Missing parameters |
| --- | --- | --- |
| `create_discussion_thread` | — | **Done in v11.5.21** |
| `list_authored_questions` | `list_custom_questions` | `p_limit`, `p_status` |
| `owner_adjust_user_rewards` | `teacher_grant_rewards` | `p_coins_delta`, `p_game_time_delta`, `p_user_id`, `p_xp_delta` (owner console buttons "do nothing") |
| `owner_update_user_profile` | `staff_update_user_identity` | `p_year_level` |
| `queue_parent_email` | `queue_parent_due_notifications` | `p_body`, `p_kind`, `p_school_id`, `p_student_id` |
| `save_authored_question` | `save_custom_question` | `p_skill_id`, `p_source_label`, `p_strand`, `p_submit_for_review`, `p_worked_solution`, `p_year_level` |
| `school_usage_dashboard` | `school_usage_report` | `p_end_at`, `p_start_at` |
| `standards_growth` | `standards_growth_report` | `p_end_at`, `p_school_id`, `p_start_at`, `p_year_level` |

### No backend at all (decide per feature: build or remove the UI)

- `authored_question_stats`
- `review_authored_question` (Reviewed Question Studio)
- `canvas_grade_queue`, `save_canvas_assignment_map`, `save_canvas_user_map` (Canvas is a shell)
- `claim_daily_mission`
- `class_game_snapshot_v114`, `class_game_state_v114`
- `engagement_class_comparison`
- `my_parent_email_outbox`
- `reassign_assignment`
- `school_standards_proficiency`
- `task_question_detail`, `task_question_report`

`moderate_discussion_thread` and `reply_discussion_thread` were built in v11.5.21.

**Before building any of these, re-probe:** the schema is edited directly in the dashboard. Use `PGRST202` = missing, with the real parameter names.

## 3 · Medium: one feature each

- **Teacher posts / announcements** on the existing content system (`create_content`, `list_content`, `vote_content`, `live_results`, `submit_live_response`). Best value next.
- **Shop:**
  - working item previews
  - real item art instead of emoji
  - more items

  (The car items are already removed.)
- **"More tools" row:** all eleven buttons have handlers. Failures are in what they call, so check each against §2 first.
- **Student class tab**
- **Branded print**
- **Student detail view** from the mastery table
- **Confidence metric** from accuracy, difficulty, attempts and recency.
- **Verification email:** needs three changes:
  - turn on the Supabase Auth setting
  - change the `mathsexpress-signup` Edge Function (it currently returns tokens immediately)
  - remove the client's hardcoded `needsConfirmation:false`

  The post-verification landing already exists.
- **Fullscreen:** the question is faintly visible behind the overlay; regenerate numbers on exit.

## 4 · Large: plan before starting

- Teacher dashboard navigation; Learn tab simplification
- Worksheet creator; textbook preview with annotation
- Skill map with prerequisite graph; spaced repetition of wrong answers; placement test
- Live session monitoring; the triage screen; time-on-task and tab-switch detection
- Seasons with XP and ranks; class competitions on accuracy
- Year 12 difficulty; missing topics; per-topic progress bars gated by check-ins
- Progress-aware AI coaching

## 5 · Decisions needed (owner, not code)

| Item | Question |
| --- | --- |
| Historical grading data | Every Discovery Check-In and Fix Mode result before v11.5.19 was stored as correct regardless of the answer, and still feeds IRT growth and "secure / review" labels. Discount, purge or accept? |
| Assignments rewrite | Different question types per skill level, real adaptivity, answer methods beyond MCQ and text. Effectively a question-engine rewrite. Scope it as its own project. |
| NSW curriculum alignment | Needs an authoritative outcome-code mapping as input. This is content sourcing, not engineering. |
| Personal recommendations | Based on mastery, past errors, recency, or a weighting of all three? |
| Owner console roles | Which roles (owner, admin, bug tester…) can do what? `mathsexpress_v7_role_permissions` and `v7_set_role_permission` already exist. |
| 16 features with no backend | Build or remove the UI for each (list in §2). The UI advertises all of them today. |
| "Only one code" | Currently three codes, relabelled. If it should literally be one code system-wide, that's a larger change. |
| Auto-assignment bot | If it ever reaches a student account, it invalidates every report. Define its limits first. |
| Class games | Build the server game engine to match the client's modes, or cut the client down to the server's modes (see §1). |

## 6 · Cannot be delivered as written

- **"Make it impossible to use AI / block screenshots, right-click, copying":** a web page can't stop OS screenshots or a phone camera. The achievable version is proctoring signals (tab-blur, paste blocking, timing anomalies) shown to teachers. Build on the existing `recordAssessmentIntegrity` → `mathsexpress_record_integrity_event`.
- **"Owner can see passwords":** passwords are stored as one-way hashes, so nobody can read them. Activity history, email addresses and password *reset* are buildable.

## 7 · Reminders

- Every release: bump `?v=` in `app.html` for each changed bundle, plus the service-worker cache name. Update `tests/login-release.test.cjs` and `tests/receptra-widget.test.cjs`, and add a `V11.5.x-*.md` note.
- Migrations are applied by hand and are not part of a deploy.
- Always pass `CLOUDFLARE_ACCOUNT_ID`. If wrangler offers to register a workers.dev subdomain, you're on the wrong account, so stop.
- New helper files in the zip:
  - `tools/gen-dark-overrides.py` (dark-mode safety net)
  - `tools/test-migration-20261011.sql` (rolled-back live test pattern)
