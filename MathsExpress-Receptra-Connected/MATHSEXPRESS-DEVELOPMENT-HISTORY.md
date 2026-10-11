# MathsExpress — Development History

A compacted record of everything covered across the MathsExpress work: what the
platform is, how it's built, and every version pass with what changed and why.

---

## 1. What MathsExpress is

A K-12 maths learning web platform for students, teachers, parents, and school
admins/owners. Backed by Supabase (project `ewpncbgqutftiqhtkpfl`,
region ap-southeast-2). Deployed live at
`mathsexpress.aarush-sharma6.workers.dev`.

Core systems: adaptive question generation across ~13 question types
(numeric, fraction, algebra, indices, MCQ, coordinate, graph-point, written,
multi-part, matching, drag-drop, number-line, table-entry), a two-tier
mastery system (coarse per-topic `state.mastery` and fine-grained
`skillMasteryMap`), assignments with an optional locked-down Test Mode,
an AI tutor (Groq-backed, hint-only — never allowed to state final answers),
handwriting recognition, a coins/XP/cosmetics economy, school/class
management for teachers, and an Owner Console for platform administration.

## 2. Architecture

- **Current**: Cloudflare Worker (`worker.js`) serving static assets from
  `public/` (`env.ASSETS.fetch`) plus a handful of server routes
  (`/api/ai`, `/api/integrations`, `/api/mark-step`, `/api/parent-email`,
  `/api/recognize-handwriting`, `/api/signup` proxy). Client is a single
  large hand-rolled SPA (`deploy-app.js`, ~8,800+ lines) using a hash router,
  a `renderers` map, and a delegated `data-action` click dispatcher. State
  lives in `state`, persisted to `localStorage` plus async Supabase sync via
  a `MathRiftSchoolClient` class (`deploy-core-1.js`). `deploy-core-1.js`/
  `deploy-core-2.js` hold shared logic (cosmetics/inventory, progression,
  auth, school-cloud client, ui-model, etc.) registered into a
  `window.__modules` registry and consumed by the outer `deploy-app.js` IIFE.
- **Earlier**: before the Cloudflare migration, the app was a static site
  (`MathsExpressPublic`, later `MathsExpress-v10.6-Role-Separation-Finish`,
  then a working folder called `mx_ui_work`) bundled via `deploy-app.js` /
  `deploy-core-1.js` / `deploy-core-2.js` as an IIFE `__modules` pattern,
  hosted on Vercel/Netlify-style static hosting. That phase focused on UI
  consistency between Home and other pages, restricting Practice to a
  student's own year level, the Cambridge textbook catalogue, animations,
  a loading screen, and removing an early onboarding flow.
- **Safety net**: every working copy this session touched was `git init`'d
  and committed immediately, specifically because of a real incident earlier
  in the project where a whole working folder was accidentally deleted
  mid-session by the user and had to be reconstructed from a pristine
  extraction plus a scripted re-application of every edit.

## 3. Version history

### v11.5.0 — AI chat auto-clear
AI Helper chat now resets on every question/task change (new task, lesson,
assignment, or custom worksheet; leaving/completing an assignment), driven
by a context fingerprint so stale AI messages can't leak into a new
question even if a navigation path misses an explicit reset. Manual
"Clear chat" still works.

### v11.5.1 — Profile, character, and task polish
First pass of character customisation: skin colour, primary/secondary top
colour, pants colour, and 4 clothes styles (Classic/Sport/Varsity/Hoodie).
Character repositioned so it never covers the player's name. Pomodoro/Focus
timer made permanently visible in the assignment top bar and clickable to
open its controls. Assignment header, progress dots, titles, and answers
made to wrap/scroll safely on small screens; general overlap/clipping
protection added to Profile and assignment layouts.

### v11.5.2 — Handwriting recognition fix
Replaced a retired Groq vision model (`qwen/qwen3.6-27b` → `qwen/qwen3.8-27b`).
Handwriting canvas sends PNG with a longer recognition timeout, gained a
typed fallback inside the same modal, and errors now say whether the
Worker/API key is missing rather than a generic "service unavailable."
Modal made responsive.

### v11.5.3 — The 40-item audit (three passes in one long session)
The user sent an exhaustive 40-item specification covering nearly every part
of the app. This was worked in three passes across one very long session
(with a context reset partway through), each delivered as an updated ZIP
with `V11.5.3-CHANGES.md` documenting exactly what was fixed, what was
already correct, and what was honestly left undone — the standing rule for
this whole project has been **never claim something is fixed without
tracing or testing it.**

**Pass 1 — the two live bugs the user reported, plus highest-risk items:**
- *Teacher signup silently became a Student account*: the signup form's
  "Teacher" choice was captured in `raw_user_meta_data` but never read by the
  DB trigger that creates the profile row. Fixed via migration
  (`handle_new_account_user()` now grants `teacher` when requested **and**
  the email passes the same approved-domain check already gating signup).
  Root-caused a second issue in the same area: Supabase Auth only ever
  returns the generic *"Database error saving new user"* to the browser —
  it never forwards a trigger's real `RAISE EXCEPTION` text — which is why
  a rejected personal-email signup looked like a mystery server error.
- *Owner Console role changes appeared to revert*: reproduced live (with
  explicit user permission, testing a low-stakes role first, then Owner
  itself). Root cause: the Owner Activity Center's 15-second auto-refresh
  was wiping the user-detail modal out from under the admin while they were
  still reading it. Fixed by skipping that refresh tick while the modal is
  open.
- Added the missing `mathsexpress_update_school_details` RPC (exact error
  the user hit), extended mastery past 100% (new tiered-progress system,
  `nextSkillMasteryValue()`, plus a server-side `CHECK` constraint that was
  silently capping sync at 100 — found and raised to 500), removed
  force-fullscreen from ordinary (non-Test-Mode) practice, fixed read-aloud
  continuing to speak after navigating away, added dynamic browser tab
  titles.
- Documented (not fixed, flagged precisely): a legacy `lessonMastery` system
  tied to old static-data lessons that doesn't feed the same mastery display
  as the newer `skillMasteryMap` system.

**Pass 2:**
- New logo propagated everywhere (turned out only 2 canonical file paths
  needed replacing), full icon/PWA set regenerated (favicon, maskable
  icons, manifest), loading-screen brand mark wired to the real image.
- Pomodoro "stuck at 4 of 4" bug: cycle count was never reset after a full
  set completed.
- Achievement All/Discovered/Undiscovered filters added.
- Weekly Speed Challenge Personal Best race condition: the PB card's re-read
  wasn't guaranteed to run after the PB write committed.

**Pass 3** (after a context reset; worked through nearly the entire original
"not done" list):
- **Removed the production-approval safety gate entirely**, on the user's
  explicit instruction ("Remove this fully never want to see it") — this
  was discovered mid-investigation to be actively blocking "Create school"
  and "Add school staff" on the *live* site, not just showing bad UI
  copy. Flagged as a real security-relevant decision before acting on it.
- Found and fixed two genuine, verified CSS/layout bugs by building static
  reproductions of the real markup against the real stylesheet and
  screenshotting them in an actual browser before/after, rather than
  reading CSS and guessing:
  - Assignment task header: `.assignment-top-status` had flex properties
    set but was never actually `display:flex`, so the timer row silently
    dropped below the header and "1/20" wrapped onto two lines.
  - Background-picture theme never applying: a higher-specificity
    `body .relaxed-main-shell` rule hardcoded a background colour that beat
    the intended `var(--mx-user-bg)` rule regardless of source order.
- Added coordinate-grid axis tick labels (there were none at all).
- Fixed a real indices/exponent formatting bug (`x^{-1/2}`, `x^{2n}` were
  rendering as mangled text with a stray `}`).
- Student Goals made auto-tracking (questions answered / day streak) instead
  of a manual "+1" button for everything.
- Parent/Guardian "Add" button: found staff accounts (teachers/admins) could
  reach the student-only invite RPC and get a confusing DB error; gated it
  centrally and redirected staff to the correct tool.
- Test Mode-only right-click/copy protection, "Create Task" hidden from
  students with a real permission guard (not just a hidden button),
  Enter-to-submit / Shift+Enter for written responses, Recommended Next
  section made a responsive 2–4 column grid.
- Verified several items were **already correct** by reading the live
  database functions directly rather than assuming: Class Expedition
  double-counting (already idempotent via a unique `reward_event_id`
  constraint), class-game 10-minute expiry (already enforced server-side
  with a row lock), and a full dead-button audit (351 distinct
  `data-action` triggers checked against their handlers — zero orphaned).

### v11.5.4 — two different things happened under this version number
This session built a **fox tour-guide feature** (separate mascot from
Clove, per the user's choice): background removed from a supplied fox
image, green highlight + speech-bubble walkthrough auto-running once on
first visit to Home and the School Dashboard, replayable via a button —
verified by building a live static reproduction and clicking through the
whole flow in a real browser at desktop/tablet/mobile widths.

Separately (a different session, same version slot, "Fast Fixes"):
removed the email-verification requirement entirely for new signups,
auto-upgraded old unconfirmed accounts on next login, fixed the Class
Expedition/points sync DB mismatch, hardened Parent/Guardian linking,
fixed generated-task mastery mapping so Home reads the same skill-mastery
key as Learning Path, verified Owner role changes against the server after
saving, moved the Leaderboard into the main Home content (out of the
sidebar), added hover tooltips on the header's points/Game Time/coins
icons, added a Web Audio "ding" on correct answers, and added a locked
"Coming soon" Worksheet Builder preview tile to Home.
*(These are exactly the items a later message in this same conversation
asked for — they'd already been done by the time that request was made.)*

### v11.5.5 — Owner Role Save Fix
Fixed Owner Console role selection reverting after the main save button was
clicked. "Save account changes" now saves display name, username, year
level, and platform role together in one action; Admin/Owner assignments
are verified against the server before showing success; the separate,
confusing "Save role" button was removed.

### v11.5.6 — Profile + Home Pomodoro polish
Rebuilt the profile hero to a premium purple/cream card design with the
character in a circular spotlight, cleaner Level/XP panel, streak pill.
Added a prominent Pomodoro focus card directly to Home (with a small "NEW"
badge) that updates live and re-styles during breaks.

### v11.5.7 — Safety, Textbook, Owner, Chess
Removed the mascot from the Profile heading. Bundled the supplied
CambridgeMATHS NSW Stage 5 Year 9 PDF as a built-in textbook asset (removed
the old "Connect PDF" step — chapter links open it directly). Added Owner
account directory/delete controls. Added teacher Safety Alerts for flagged
student language, AI chat content, and serious assessment-integrity events.
Added a Restart Game button to Maths Chess. General motion/animation polish
across cards, buttons, forms, and progress bars, with reduced-motion
support.

### v11.5.8 — Recognition + PDF Fix
Teacher Recognition's "star" sticker now renders as a ★ icon instead of the
literal word. Cambridge textbook preview switched from an iframe (blocked
by the site's own security headers) to the browser's native PDF object
viewer with an "Open in new tab" fallback; CSP updated to allow same-origin
PDF objects while keeping framing protection.

### v11.5.9 — Shop Preview + Header Visibility
Added a live character preview panel to the Shop, made much larger so
outfits are actually visible. Improved top-menu contrast/button visibility
and the coin display. Added local fallbacks for purchasing/equipping when a
cloud inventory constraint blocks a new item.

### v11.5.10 — Character + Fullscreen Protection
Shop cards now render real cosmetic previews (mini full-body character
wearing the item) instead of emoji-only icons, with preview patterns
matching each named cosmetic. Skin/clothes controls update a live preview
without saving until "Save character" is pressed; "Reset preview" no longer
overwrites the actually-saved character. Lessons/practice/assigned tasks
now request fullscreen immediately on start. Added right-click/copy/drag
blocking in the task workspace and disabled `display-capture` via
Permissions Policy (with an honest caveat that browser-level screenshot/Lens
tools can't be fully blocked by a website). Supabase account inventory
updated to accept the shop's actual cosmetic item IDs.

### v11.5.11 — Server Coin Sync Fix
Owner "+5,000 coins", "Set 50,000 coins", XP, and Game Time quick-tools now
actually save to Supabase (previously local-only, lost on refresh). "Max
Account" saves economy values server-side. Login now performs a final
server economy sync so Shop and the header always agree on balance.

### v11.5.12 — Locker & Shop layout fix
The user reported (with screenshots) that the Locker/character-customisation
page looked "all messed up." Reproduced both pages by extracting the real
render functions and real CSS into a standalone browser harness (rather
than reading the stylesheet and guessing) and found two genuine, concrete
bugs:
- **Locker**: the character-customisation card — which needs its own
  ~600px two-column layout for the live preview plus colour/style controls
  — was nested inside a `.locker-layout` column hard-locked to `340px`.
  That's exactly why labels were truncating to fragments like "S c" and a
  button was cut off. Restructured so the preview and "Owned cosmetics"
  sit in a proportional top row, with the appearance-controls card given
  the full page width below.
- **Shop**: `.shop-grid` was hard-coded to always show exactly 3 columns,
  with leftover breakpoint overrides from an earlier, different sidebar
  layout that no longer matched the app's actual current width. That's why
  cards like "Football Pro" and "Galaxy Genius" were getting sliced off at
  the edge. Replaced with `repeat(auto-fill, minmax(260px, 1fr))`, which
  picks however many columns genuinely fit and can never overflow.
Both fixes verified with real before/after screenshots at 1280px, 1600px,
and 375px (mobile).

---

## 4. Recurring systems worth knowing about

- **Mastery**: two parallel stores — `state.mastery[topic]` (coarse,
  legacy-ish, capped 100, used for topic achievements) and
  `state.skillMasteryMap[skillId+year]` (fine-grained, what Learning Path
  and Home actually read; extended past 100% since v11.5.3 pass 1, up to a
  ceiling of 500 both client- and server-side). A separate, older
  `lessonMastery` store tied to legacy static lessons does **not** feed
  either of the above — a known, documented gap.
- **Cosmetics/Shop economy**: `COSMETICS` array (117 items across outfit,
  nameEffect, pet, frame, background, title, theme, gameSkin, avatar
  categories) defined in `deploy-core-1.js`; purchase/equip functions
  return `{ok, reason, state}` shapes; local-storage fallbacks exist for
  when the cloud inventory constraint rejects an item (v11.5.9), and the
  server sync path for coin/XP economy was specifically fixed in v11.5.11.
- **Assignments / Test Mode**: `activeSchoolAssignment.testMode` gates
  fullscreen enforcement, right-click/copy protection, AI Helper/hints
  availability, and the calculator — all deliberately scoped to *only*
  apply during a real test, not ordinary practice.
- **Owner Console**: platform-wide admin tools (roles, coins/XP grants,
  feature flags, activity feed, feedback inbox). Role assignment has been
  touched by two separate fixes (v11.5.3 pass 1's "modal wiped by
  auto-refresh" bug, and v11.5.5's "save button doesn't actually persist
  the role" bug) — worth checking both are still intact if role assignment
  ever misbehaves again.
- **Safety discipline used throughout**: `node --check` on every touched JS
  file, a CSS brace-balance check, `python3 -c "json.load(...)"` for
  manifest validity, live Supabase `execute_sql`/`apply_migration` calls to
  verify DB-side state directly rather than trusting the client code's
  assumptions, and — whenever a CSS/layout bug was suspected — building a
  real static reproduction of the actual markup against the actual
  stylesheet and screenshotting it in a real browser before claiming a fix.

## 5. Known open items (as of v11.5.12)

- No full visual pass has been done across all ~13 question-type renderers
  beyond the one confirmed, fixed indices-formatting bug — if a specific
  type/layout looks wrong, it hasn't necessarily been checked.
- The legacy `lessonMastery` vs. `skillMasteryMap` gap (section 4 above) is
  understood but not rebuilt, due to refactor risk.
- Teacher-facing progress bars have not been specifically audited for
  visual overflow now that mastery can exceed 100%.
- The production-approval safety gate was **removed entirely** (not
  disabled) at the user's explicit request in v11.5.3 pass 3 — if a
  similar gate is ever wanted again before a larger rollout, it would need
  to be rebuilt from scratch, not just re-enabled.

## 6. Reference

- Supabase project: `ewpncbgqutftiqhtkpfl` (ap-southeast-2).
- Live deployment: `mathsexpress.aarush-sharma6.workers.dev`.
- Deploy process: `DEPLOY-CLOUDFLARE-WORKER.md` in the project root
  (`public/` + `worker.js` via the existing Cloudflare Workers pipeline).
- All DB schema changes ship as files under `supabase/migrations/` and are
  applied live as part of the fix, not left as manual follow-up steps.
- Every version's specific file-level change list lives in that version's
  own `V11.5.X-*.md` file in the project root — this document is the
  compacted overview; those are the detailed originals.
