# Changelog

All notable changes to MathsExpress 2.0 are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/). See "Versioning" in CLAUDE.md.

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
