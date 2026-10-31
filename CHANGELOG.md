# Changelog

All notable changes to MathsExpress 2.0 are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/). See "Versioning" in CLAUDE.md.

## [2.0.0-alpha.3] - Unreleased

### Student and teacher usability improvements

- Replaced the student and teacher More placeholders with useful shortcuts to working features. Added a local focus timer with 5-, 15- and 25-minute choices.
- Added lesson search, textbook topic search, and Continue Reading links on the student home and textbook library. The most recent chapter is saved only on the student's device.
- Made class assignments and learning easier to reach with direct Class shortcuts.
- Added regression tests for the new tools and reading history. These changes do not add unverified learning material or alter the production database.

### Textbook reader and syllabus structure

- Replace generic textbook chapter placeholders with stage-aware NSW syllabus focus-area outlines across 25 books, including Stage 5 Core/Paths and the distinct 2024 senior courses.
- Replace a copied-feeling sidebar and question tabs with an original, continuous Study Notebook:
  a five-part learning path, an interactive balance model, three fully explained examples,
  a guided intermediate step, common mistakes, practice and a recap.
- Preserve honest status labels: full textbook chapters and content-point auditing are still in preparation.

### Deployment

- Added CI-gated automatic Cloudflare V2 test-site deployment after both app and database checks
  pass. Requires scoped Cloudflare secrets and a separate V2 Supabase project. The old live site
  remains untouched.

Phase 3 first learning slice (in development).

### Added

- Added 32 more shop items (130 in all): 8 dashboard themes (Forest Green, Cherry Blossom,
  Arctic Teal, Citrus Pop, Berry Burst, Volcano Red, Midnight Navy and the legendary Royal
  Gold), 3 avatars, 5 accessories (including a bow tie and scarf on a new neck slot), 4
  backgrounds, 3 frames, 3 effects and 6 titles. Trying on a theme now recolours the whole page
  until it is cancelled. The home shortcut is now simply called Shop.

- Rebuilt the student Shop as a full customisation experience: 98 original cosmetics (22
  avatars, 23 accessories, 16 backgrounds, 13 frames, 12 effects, 8 titles and 4 dashboard
  themes) from free to 5,000 coins in five rarities, all drawn as original SVG. A live preview
  shows the student's avatar with everything they are wearing and trying on; Try On is free,
  works in combinations, and Cancel or Back to my look puts the student's own look back.
  Buying asks to confirm, is checked and charged once on the server, celebrates with a coin
  burst and offers Equip now. Search, category tabs, rarity, price, owned and affordable
  filters, and sorting by price or name. My collection equips owned items and restores the
  default look; Coin history explains how to earn. Students' looks appear in the header, on
  the home page, in the quick-tools shop and leaderboard row, and in teachers' class lists.

- Finishing a lesson now earns 25 coins plus 5 for each question right first time, for the
  first four lessons finished each day, and the lesson page says how many were earned.

- Added a sliding selection bar under the top navigation and the class workspace tabs, a
  smooth drop-open for the account menu (its arrow turns as it opens), and a gentle float on
  empty-state icons. All transform and opacity only, and still for reduced motion.

- Added gentle background motion in the brand colours: squiggles that sway and bend near the
  left and right edges, small dots that swell, drift and fade (some in little groups), and a
  few soft floating shapes. Each area has its own arrangement; lessons and textbook reading
  stay calm. Decorative only: behind content, not clickable, hidden from screen readers, still
  for reduced motion, and kept to the very edges on phones.

- Built teacher Reports from saved, server-marked lesson work only: class summaries (active
  students, lessons completed, right-first-time accuracy, tasks completed), per-lesson progress
  bars, a searchable and sortable student table, task completion, and each student's attempts.
  Filters for class, period and student live in the address. Each class workspace gains a
  Progress tab, and the teacher home shows recent activity. No activity shows as none, never
  as an invented score.

- Built real tasks. Teachers set a published lesson for a whole class or chosen students with a
  due date and optional instructions, publish now or save a draft, move the due date, delete
  with confirmation, and see each student's result. Tasks are listed across classes (search,
  class and status filters) and in each class's new Tasks tab, and the teacher home shows what
  is coming up and what needs following up.
- Students see their real tasks on the home page and on a new Your tasks page, and can open a
  lesson their teacher set even outside their year level.
- Lesson progress is now saved to the student's account as they answer. The server marks every
  answer against its own answer key, so completion and accuracy can't be faked, and practice
  keeps working (with a clear message) if saving fails.
- New database tables and functions with row-level security for the learning catalogue, lesson
  attempts, tasks and task students, with database tests for every permission.

- Replaced the teacher home placeholder with a real dashboard: a personal greeting, quick
  actions and the teacher's classes, all from real data, with a helpful first-class empty state.
- Turned each class into a workspace with Overview and Students tabs. The Classes page and the
  student list can be searched and sorted. Class codes, joining settings, year levels and
  removing students work exactly as before.

- Introduced the official MathsExpress capybara mascot: a flat, mouthless 2D character drawn
  once as a layered SVG rig, so all eight views (front, back, both sides and four
  three-quarter views), 29 poses and 16 eyes-and-eyebrows expressions keep identical colours
  and proportions.
- Added 24 smooth mascot animations (movement, learning, feedback and rewards) and an
  animation controller that eases between a resting state and short reactions to real events.
- The mascot now responds around the site: it waves when a student arrives, reads and points
  at lessons on Learn, reacts kindly to wrong answers, lights a bulb for hints, celebrates
  correct answers and finished lessons (a special level-up for a perfect run), walks on the
  loading screen, and appears in empty states, the achievements and challenges panels and the
  teacher home page. Reduced-motion visitors see still poses.
- Upgraded the mascot's animation quality: arms now bend at the elbow, faces move with real
  eyelids (smiles squeeze, blinks close, brows glide), ears and tuft follow through, every
  animation uses anticipation, squash and stretch and overshoot, celebrations are bigger (the
  lesson-complete jump includes a mid-air twirl), changing direction plays a quick turn, and
  the character has soft volume shading.
- Added the `/mascot` workshop page to review every view, pose and animation, transparent SVG
  and PNG exports in `src/assets/mascot/`, `npm run mascot:export` and mascot documentation.

- Built the first real account-backed Coin Shop with an original catalogue of eight
  permanent themes and avatar frames, a starter wallet, secure transactional buying,
  owned-item locker, equip/unequip controls, and recent purchase history.
- Added server-verified, once-per-question coin earnings for the published Year 9
  guided lesson, with database protection against forging rewards or overspending.
- Replaced the fake shop side-panel contents with the student's real coin balance
  and a working link to the full Shop page. No real-money payments or chance items.

- Improved the existing textbook library with All books, My year, and Ready to learn filters,
  visible result counts and an easy reset when a search returns no matching books.
- Clarified that books without a maths lesson contain only a syllabus outline and introduction.
  Added direct links into ready chapters and previous/next chapter navigation.
- Connected the original Year 9 equations textbook to the existing guided Learn lesson in both
  directions, only offering practice when the student's teacher-assigned year permits it.
- Unified textbook numeric checking with Learn's strict parser (including typed negative signs)
  and kept the floating quick tools clear of the interactive textbook exercise page.

- Introduced an original MathsExpress textbook library with 25 separate books for K–10,
  secondary Life Skills and the distinct Year 11–12 mathematics courses. All books open
  through their own links, with chapter contents, a getting-started chapter and syllabus links.
- Added a Year 9 linear-equations textbook pilot with an original worked example, six
  checkable exercises, hints and retry feedback. Other chapters explicitly say they are in
  preparation rather than presenting unreviewed content as finished.
- Added a textbook curriculum coverage record and unit/interface tests for the book
  routes, course distinctions, chapter navigation and numerical answer checking.

- Added a compact student quick-tools toolbar for Leaderboard, Shop, Daily challenges,
  Achievements and Rewards, with a mobile Quick tools menu.
- Each control opens a real, keyboard-accessible modal panel with a close button, native
  Escape handling, backdrop dismissal and focus restored to the opening control.
- The panels reuse existing labelled sample content; achievement examples are explicitly
  previews, shop purchase buttons are disabled, and students without a class get a class link.
- The quick-tools toolbar stays out of the way on active guided-lesson pages. Animation and
  visual motion polish are deliberately deferred for a separate Claude pass.

- Replaced the student Learn placeholder with a real topic catalogue. Only published lessons for
  teacher-assigned year levels appear. Students without a class are prompted to join one.
- One carefully authored Year 9 algebra lesson: solving linear equations with an explanation,
  a worked example, five interactive questions, graduated hints and verified numeric marking.
- Clear correct/incorrect feedback, worked solutions, a completion summary and replay.
- Unit and interface tests for the published content, answer checking, access by year and the
  complete lesson flow.

### Changed

- Strengthened the MathsExpress blue and lavender identity on the new teacher pages and shared
  components: brand-tinted tab highlights, tinted table headers and row highlights, statistic
  tiles with a brand accent bar, coloured section markers, tinted filter bars and empty states,
  filled step numbers and a clear brand focus ring on every field. New semantic colour tokens
  build on the brand tokens, so equipped shop themes still recolour everything.

- The student home's task list and next step now come from real tasks instead of sample data.

- The lesson-completion burst of shapes is replaced by the mascot's own celebration, so there
  is one celebration instead of two.

- Extended the official MathsExpress blue/lavender palette across the 2.0 site:
  softly colourful page backgrounds, navigation, active tabs, buttons, Study Journal
  shortcuts, progress and practice cards, guided lessons, class cards, teacher empty
  states, sign-in panels, quick tools and error screens. Kept dark, readable text,
  existing layouts, reduced-motion support and all current functionality.

- Brightened the textbook library with five distinctive book-cover treatments using the
  existing MathsExpress navy, blue, lavender and muted-blue palette. Added colourful but
  readable library and chapter headers, stronger chapter navigation, and exercise accents,
  without changing any textbook content or answers.

- Redesigned the student homepage as the original MathsExpress **Learning Desk**: a compact
  welcome card alongside learning progress, a separate practice-and-assignments workbench,
  and classroom/reward panels grouped along the bottom instead of a copycat dashboard sidebar.
- Kept real student/class details, labelled sample content, learning links, assignment links
  and existing accessibility labels, while giving the page its own navy/blue visual hierarchy.
- Deferred mascot artwork and animation integration until the approved character assets are ready.

### Changed

- Rebuilt the student homepage into an original, minimal **Study Journal** instead of a
  game-like dashboard. The layout now has a plain personal greeting, one clear next step,
  three study shortcuts, and separate vertical sections for tasks, progress and practice.
- Removed the old hero illustration, background decoration, leaderboard, shop, challenge and
  rewards panels from the student homepage. Their underlying data and separate routes are
  untouched; sample information stays clearly labelled wherever it is shown.
- Removed the purple development-preview bar from both student and teacher layouts.
  On the student homepage, a quiet note and individual badges still distinguish sample
  panels from the real account and class data.
- Preserved teacher-assigned year levels, existing lesson links, refresh behaviour, keyboard
  navigation and accessibility labels. Mascot and motion design remain a separate later task.

### Known limitations

- Only one Year 9 lesson has been published so far. Other year levels have honest empty states.
- Lesson progress and attempts currently stay in the browser session and are **not yet saved to
  the student's account**. Persistent account-based progress is planned later in Phase 3.
- No rewards, teacher assignments or adaptive question generation are claimed for this slice.
- Google sign-in and the remaining Phase 2 security review are still pending.

## [2.0.0-alpha.2] - Unreleased

Phase 2: authentication, accounts and class management.

### Added

- Accounts and classes database (Supabase Postgres), built only from migrations: profiles with a
  student or teacher role, classes, teacher permissions per class, join codes, class membership
  with teacher-assigned year levels, and an audit trail of year-level changes.
- Server-side security: row-level security on every table, no direct table access except reading
  your own profile, and server functions that check the caller's role and class permission for
  every action. Students never see join codes, other students or email addresses.
- Secure 8-character join codes from an alphabet without look-alike characters; teachers can
  replace a code at any time.
- Local Supabase stack for development with a test mailbox, branded confirmation and password-reset
  emails, a password policy (8+ characters with letters and digits), and Google sign-in ready for
  credentials.
- Database and authentication integration tests (`npm run test:db`), also run in CI against a
  fresh Supabase stack, with a check that the generated database types match the migrations.
- Sign in, registration (student or teacher), email confirmation, resending the confirmation,
  forgot password and reset password pages, Google sign-in (explains when it is not set up), and
  a welcome page to finish setting up accounts without a profile (e.g. after Google).
- Persistent sessions that refresh automatically; signing out (also in another tab) returns
  people to the sign-in page. Pages are protected by role, and people are returned to the page
  they wanted after signing in (only ever to a page in MathsExpress).
- Account menu with the signed-in person's name and Sign out, replacing the sample avatar.
- The home page uses the signed-in student's real name, class and teacher-assigned year level,
  invites students without a class to join one, and labels every panel that still shows sample
  data.
- A loading indicator during page changes, clear error messages for every account and class
  problem, and a setup page when the app has no database connection configured.
- Student Class page: each class with its teacher and the student's teacher-set year level (which
  students can't change), joining a class with a code (any case, with or without the hyphen),
  leaving a class when the teacher allows it, and clear messages for wrong, unknown, closed or
  already-joined codes.
- Teacher Classes page: the teacher's classes with their codes, year levels and student counts,
  and creating a class.
- Teacher class page: every student with their year level, which the teacher can change; removing
  students; the class code with Copy and "Make a new code"; and class settings (name, class year
  level, whether students can join with the code and whether they can leave by themselves).
- Confirmations before leaving a class, removing a student or replacing a code, and messages that
  always describe the latest action.

### Changed

- The header no longer shows a coin balance: coins are not real until the rewards system is built.
- The Google button shows that Google sign-in isn't available yet before anyone presses it.

### Fixed

- Fixed the page jumping sideways and back when moving between pages. The page-entrance
  animation moved the whole main area down a few pixels, briefly pushing short pages past the
  window and flashing a scrollbar (and moving the fixed quick-tools bar). Now only the page
  content animates, and space for the scrollbar is always reserved.

- The site's Content-Security-Policy now allows connections to its Supabase project; before, a
  build served by the Worker could not reach the database.
- Fixes from the independent Phase 2 review:
  - The student's classes reload on every page change and when the tab is shown again, so Home
    and Class always show a teacher's latest changes.
  - Leaving or removing several classes or students at once is no longer possible, so a second
    confirmation can't cancel the first.
  - A form never shows an old result again while a new one is on its way.
  - Focus stays on Save after saving a student's year level or the class settings, moves to the
    field that needs fixing on the account pages, and success messages are announced.
  - "Copy code" says on screen when copying fails.
  - Sending the confirmation email again keeps the "Check your email" screen if it fails.
  - Passwords over 72 bytes get a clear message instead of "Enter a valid email address".
  - Opening `/sign-out` directly goes to the start page instead of a blank page.
  - Text fields have a border with enough contrast, the year badge's label is readable, and the
    footer notice on the account pages has its own background.
  - The home banner's task summary is labelled as sample data.

### Security

- Setting up an account now needs the email link: the person who opens it chooses the role, name
  and password. An account that isn't set up can't sign in with a password at all (a sign-in hook
  refuses it), and the database only creates a profile for a session from an email link. So
  someone who registered an address first can neither take the account over nor lock its owner
  out. Before, confirming quietly kept the first registration's password and role.
- Ended sessions lose database access at once: every database function checks that the session
  still exists, so signing out or a password change takes effect immediately, not when the access
  token expires.
- The welcome and reset pages are offered only within 30 minutes of an email link (the reset page
  only after a reset link), and a reset signs out afterwards. The auth server asks sessions older
  than a day to sign in again before changing a password.
- Leaving and rejoining a class can no longer undo the year level a teacher set, even when both are
  sent at the same moment; class and membership rows are always locked in the same order, so
  changes made at the same time can't deadlock.
- A teacher who teaches classes can't be deleted, so no class is left without a teacher; a class
  without one can't stop a student's pages loading either.
- "Forgot password" gives the same answer even when the server limits emails to a real account.
- Signing out always clears the session on this device, even when the server can't be reached.
- Return addresses after signing in must stay on MathsExpress: characters browsers ignore and
  dot segments can't point them at another site.

## [2.0.0-alpha.1] - 2026-10-28

Phase 1: project foundation and student homepage.

### Added

- New project foundation replacing the v11 codebase on the development branch: React 19,
  TypeScript (strict), Vite, React Router, Vitest, ESLint and Prettier.
- Git hooks that check commit messages (including the version), scan staged files and every pushed
  commit for credentials, run all checks before a push, and refuse pushes to `main`, branch
  deletions, history rewrites and anything other than the checked-out commit.
- GitHub Actions CI for the `mathsexpress-v2` branch and pull requests, including a credential
  scan of every file and of every commit on the branch.
- Cloudflare Worker configuration for a separate `mathsexpress-v2` Worker with security headers.
- Design system: colour, type, spacing, radius, shadow and size tokens built on the official
  MathsExpress palette; global base styles; the Lexend font (self-hosted).
- Shared UI components: Button, ButtonLink, ArrowLink, Panel, ProgressBar, StatusBadge, IconTile,
  CoinAmount, CoinIcon, Avatar and VisuallyHidden.
- Student and teacher layouts with navigation at the top, never a side bar. Student: Home, Learn,
  Textbook, Class, More. Teacher: Home, Classes, Tasks, Reports, More. On phones and tablets the
  navigation becomes a row of tabs under the logo.
- Accessibility basics: skip link, landmarks, page titles, focus moved to the page after
  navigation, and the current page marked for screen readers.
- Not-found and error pages; "Try again" on the error page reloads the page's data.
- "Planned for a later phase" pages for sections that are not built yet, so every link works.
- A development preview notice on every page stating that all data is sample data, with a link
  to switch between the student and teacher layouts.
- Data access through repository interfaces, with sample implementations for Phase 1.
- The MathsExpress logo (plus, dot and smile symbol with the two-colour wordmark) in the header,
  loading screen and favicon.
- Student home page, laid out like the agreed reference: a full-width welcome banner with a
  personalised greeting, task summary, "pick up where you left off" progress and a prominent
  Continue learning button; assigned tasks as compact MathsExpress task strips (progress ring,
  original task-type icons, due date, coin reward, status, and a Start, Continue or Review button;
  completed tasks in pale lavender with a check) with View all; recommended practice with a
  quick review of recent mistakes; learning progress (topics, questions, accuracy, streak); and a
  right-hand column with the class leaderboard, coin shop, daily challenges and rewards.
- Original illustrations and icons: the welcome-banner graph, topic card artwork, task-type
  icons, and a scenery backdrop for student pages, all in the Metallic Chic brand palette.
- Development sample data for the home page, generated relative to today's date, clearly labelled
  and kept consistent by tests.
- The home page reloads its data when you return to the tab and at midnight, so due dates,
  the greeting and daily challenges stay current on a page left open.

### Removed

- The v11 code from the development branch. It is preserved in tag `v11.5.35` and branch
  `legacy-v11`.
