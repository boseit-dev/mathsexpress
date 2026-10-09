# MathsExpress — Compacted Chat / Message History

> Compacted from the available MathsExpress conversation history. This records user requests, assistant actions, implementation decisions, deployment instructions, bugs, fixes, and major project state. It intentionally excludes private chain-of-thought/internal reasoning.

## 1. Project identity

MathsExpress is a K–12 maths learning platform inspired by products such as Mathspace, but expanded with assignments, teacher dashboards, school/class tools, adaptive practice, mastery, rewards, cosmetics, games, AI support, reporting, textbooks, and platform administration.

Current deployment pattern:
- Cloudflare Worker named `mathsexpress`
- Worker/static-assets layout with `worker.js`, `wrangler.jsonc`, and `public/`
- Live Supabase backend project: `ewpncbgqutftiqhtkpfl`
- Typical deploy command: `npx wrangler@latest deploy`
- User commonly deploys from iCloud Downloads on macOS.

## 2. Main product direction discussed

Across the conversation, the platform evolved from a basic maths-practice site into a school-ready product with distinct Student, Teacher, Admin, Owner, Parent/Guardian, Bug Tester, Content Editor, and Support roles.

Repeated design goals from the user:
- Keep the interface simple, clean, and Mathspace-like rather than overloaded.
- Make student navigation easy: Home, Learn/Practice, Assignments, Textbook, Progress.
- Let teachers create and assign work quickly.
- Make teacher reports useful and visually simple.
- Reward correct learning with coins, XP, streaks, achievements, Game Time, cosmetics, and class activities.
- Keep the app polished enough to sell/use in schools.
- Use Cloudflare + Supabase for the live app.
- Provide ZIP releases that can be deployed directly.

## 3. Major systems requested over time

### Student learning
- Year-level-specific curriculum and practice.
- Adaptive practice and recommended tasks.
- Skill mastery and Learning Path progression.
- Multiple question types: numeric, fractions, algebra, indices, MCQ, graphing, coordinates, written answers, matching, drag/drop, number lines, tables, and multi-part questions.
- Step marking and partial-method support.
- AI Helper designed to guide without simply giving the final answer.
- Hints, worked examples, textbook links, handwriting input, rough working, calculator, and read-aloud/accessibility tools.
- Test Mode that locks hints, AI, worked solutions, and other support features.

### Assignments
Requested assignment/task types across development included:
- Custom
- Adaptive
- Lesson
- Worksheet
- Test Mode
- Topic Readiness
- Revision
- Recommended Practice
- Self-directed Adaptive
- Topic tests
- Skill checks / Skills check-ins
- Tutorial tasks
- Bulk assignment workflows
- Templates and task groups

Teacher requests also included planner/calendar tools, task templates, folders, co-teachers, differentiated groups, bulk assign, and quick assignment creation.

### Teacher and school tools
- Create/archive classes.
- Class codes and student membership.
- Teacher dashboards and class dashboards.
- Reports: mastery, activity, scorecards, curriculum progress, student insights, question-level reports.
- Teacher recognition/rewards.
- Parent/Guardian linking.
- Class Expedition and classroom games.
- Teacher Safety Alerts for serious inappropriate student content/actions inside MathsExpress.
- Student activity/integrity events during assessments.
- School branding, integrations, school staff, and admin controls.

### Owner Console
The Owner Console became a major platform-management area with requests for:
- User directory.
- Role changes.
- Admin/Owner assignment.
- Account suspension/banning.
- Account deletion with confirmation.
- Coin/XP/Game Time grants.
- Test tools and platform diagnostics.
- Feature controls.
- Feedback/bug reports.
- Safety alerts.
- Platform activity/audit tooling.

## 4. Rewards, games, and cosmetics

The platform includes:
- Coins
- XP and levels
- Streaks
- Weekly points
- Game Time (capped)
- Achievements
- Daily/weekly challenges
- Class Expedition
- Recognition rewards
- Lucky Box
- Leaderboards
- Cosmetic shop and Locker

Games discussed/added include educational quick-maths modes, Maths Drive, Maths Chess, and class games. Maths Chess was later changed to normal chess against bots with Easy/Medium/Hard levels and support for standard rules such as castling, en passant, promotion, checkmate, stalemate, repetition, 50-move rule, and insufficient-material draws. A Restart Game control was added later.

Cosmetics grew to include outfits, pets, frames, backgrounds, titles, themes, game skins, name effects, and avatars.

## 5. UI direction and repeated user feedback

The user repeatedly asked to make screens less overwhelming. Important UI direction included:
- Reduce giant cards and excessive panels.
- Keep main navigation visible and simple.
- Use compact dropdowns instead of huge lists where possible.
- Keep the Home screen minimalist and focused.
- Improve responsive/mobile layouts.
- Add clean animations rather than distracting flashes.
- Improve dark mode/high-contrast behavior.
- Add a mascot/guide character (Clove) in useful positions without taking over the screen.
- Improve profile and character presentation.
- Make Shop/Locker previews actually show cosmetics clearly.

## 6. Important backend / Supabase fixes discussed

The live backend used throughout the later versions is Supabase project `ewpncbgqutftiqhtkpfl`.

Notable server-side fixes/actions during the conversation:
- Class Expedition reward-event mismatch repaired by adding an `id` column/index to `mathsexpress_reward_events`.
- Email verification was removed from MathsExpress signup/login flow as requested.
- Parent/Guardian invite RPC was hardened and tested.
- Owner role assignment RPC was inspected and tested for Admin/Owner changes.
- Owner account deletion edge function was inspected and wired into the UI flow.
- Teacher Safety Alerts table and RPCs were added and tested.
- Cosmetic inventory constraint was expanded so real cosmetic IDs are accepted.
- Owner reward persistence/coin sync was repaired so Owner coin/XP/Game Time changes are saved server-side rather than only in local browser state.
- The live Owner account was corrected to use a server-side coin balance so Shop purchases and the header agree.

## 7. v11.5 release history captured in this chat

### v11.5.0 — AI chat auto-clear
AI Helper history resets when the current task/question context changes so old responses cannot leak into a new question.

### v11.5.1 — Profile/task polish
Added character appearance settings, clothes colours/styles, assignment top-bar improvements, visible Focus/Pomodoro timer, and responsive task layout fixes.

### v11.5.2 — Handwriting fixes
Updated handwriting recognition model/service behavior, longer timeout, typed fallback, clearer errors, and responsive modal handling.

### v11.5.3 — Large audit/fix pass
A very large bug/feature review covered signup roles, Owner role behavior, school-detail RPCs, mastery, fullscreen behavior, read-aloud, titles, Pomodoro reset, achievement filters, weekly challenge PB handling, CSS/layout bugs, exponent formatting, goals, parent linking, Test Mode protections, student permission guards, Enter-to-submit behavior, recommended-practice layout, and server-side verification of several existing systems.

### v11.5.4 — Fast fixes / UI fixes
Included items such as email-verification removal, Class Expedition sync repair, parent linking improvements, skillMasteryMap alignment, Owner role save verification, Leaderboard moved into Home, hover tooltips, correct-answer sound, and Coming Soon Worksheet Builder tile. A separate fox tour-guide experiment also existed around the same version number.

### v11.5.5 — Owner role save fix
The main Save Account Details path was updated so role changes actually save and verify correctly rather than reverting.

### v11.5.6 — Profile + Pomodoro
Profile hero redesigned; Pomodoro card added to Home.

### v11.5.7 — Safety + textbook + Owner + chess
- Profile mascot cleanup.
- Cambridge Stage 5 Year 9 PDF integrated based on the user's stated permission.
- Owner account directory/delete controls.
- Teacher Safety Alerts.
- Chess restart button.
- General animation polish.

### v11.5.8 — Recognition + PDF
- Recognition sticker text corrected to use a proper star icon.
- Textbook PDF viewing changed away from the blocked iframe approach.

### v11.5.9 — Shop preview + menu visibility
- Live character preview added to Shop.
- Character enlarged so outfits are more visible.
- Header/menu contrast improved.
- Coins display improved.
- Purchase/equip fallbacks added for inventory problems.

### v11.5.10 — Character / fullscreen / task protection
- Shop cards moved toward full-body cosmetic previews.
- Live unsaved skin/clothes preview added; Save Character commits changes.
- Starting tasks requests fullscreen from the user click.
- Common copy/right-click/drag routes were restricted in task contexts.
- Explicit caveat preserved: a website cannot completely block browser-level Google Lens, OS screenshots, or a separate camera/device.
- Supabase cosmetic inventory IDs were fixed server-side.

### v11.5.11 — Server coin sync
- Owner reward tools save to Supabase.
- Header and Shop use the same authoritative economy balance.
- Owner coin grants survive refresh.
- Login performs a final server economy sync.

### v11.5.12 — Locker & Shop layout fix
- Locker layout restructured so the character preview and controls fit properly.
- Shop grid changed to responsive auto-fill behavior to prevent cards from being cut off.

### v11.5.13 — Quick Assign due-date improvement
Quick Assign due-date controls were simplified with:
- Today
- Tomorrow
- Friday
- Next week
- No due date
- Separate Date and Time fields
- Default of 7 days later at 11:59 PM
- Human-readable due-date preview

The assignment backend behavior was intentionally left unchanged; this was a focused UI improvement.

## 8. Current Quick Assign requirement

The latest request was specifically to make Quick Assign easier when setting a due date. The chosen design was to make the due-date step immediately understandable instead of forcing the teacher to work with one awkward date/time field.

Expected UX:
1. Pick a quick preset OR manually pick a date.
2. Pick a time separately.
3. See a clear human-readable due-date preview before assigning.
4. Allow No due date.
5. Keep assignment creation logic otherwise unchanged.

## 9. Deployment workflow repeatedly used

On the user's Mac, Downloads are commonly in iCloud Drive. Typical sequence:

```bash
cd "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Downloads"
unzip -o "<MathsExpress ZIP name>.zip"
cd "<extracted folder name>"
ls
npx wrangler@latest deploy
```

If Wrangler asks whether to install the package, enter `y`.

After the Worker reports a successful deploy, the user typically hard-refreshes with:

```text
Command + Shift + R
```

A repeated terminal issue in earlier chats was entering `cd` alone and then pasting a path on the next line; that makes the shell try to execute the folder and can produce `permission denied`. The path must be part of the same `cd` command.

## 10. Important product constraints / decisions

- Students should generally see only their own year level where appropriate.
- Teachers create/assign school work; student views should not expose teacher-only creation tools.
- Test Mode is intentionally stricter than ordinary learning.
- AI Helper should guide students, not simply dump final answers.
- School safety/integrity features should be proportional and app-scoped rather than covert password/keylogging surveillance.
- Browser-level screenshots, Google Lens, and external cameras cannot be guaranteed to be blocked by site code.
- Cloud/server data should be authoritative for important account economy/role state so refreshes do not undo Owner actions.
- The user strongly prefers simple UI, simple wording, deployable ZIPs, and fast iterative fixes.

## 11. Known technical structure that matters when editing

Main client files:
- `public/deploy-app.js` — large SPA UI/router/action handling.
- `public/deploy-core-1.js` — shared modules including cosmetics, progression, auth/school clients, etc.
- `public/deploy-core-2.js` — additional shared functionality.
- `public/styles.css` — main application styling.
- `public/app.html` — application shell/top navigation.
- `worker.js` — Cloudflare Worker routes + asset serving.
- `supabase/migrations/` — DB schema/function migrations.

State is stored locally and synchronized with Supabase. Care is required because the same value can exist both locally and server-side; this specifically caused the Owner coin bug when local 50k coins were replaced by the real server balance after refresh.

## 12. Testing/verification pattern used

Recent work has commonly used:
- `node --check` for JavaScript syntax.
- Focused Node tests for new helper behavior.
- DB/RPC inspection with Supabase tools.
- Direct server-side state verification for roles/rewards.
- CSS/layout reproduction and screenshots for difficult responsive problems.
- Cache/version bumps when Cloudflare/service-worker stale assets could hide a fix.

## 13. Current release state at time of this compact history

Base ZIP: `MathsExpress-v11.5.13-Quick-Assign-Due-Date.zip`.

The current package includes the v11.5.13 Quick Assign due-date improvements on top of the recent Shop/Locker, character, fullscreen, inventory, and coin-sync work.

Two history files are being bundled into the project root in this packaging step:
- The user-supplied MathsExpress development-history Markdown file.
- This `CHAT-HISTORY-COMPACT.md` file summarising available message history.

