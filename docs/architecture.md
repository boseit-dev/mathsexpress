# MathsExpress 2.0 architecture

How the code is organised, how data reaches a page, and how to extend it. The rules themselves
live in [CLAUDE.md](../CLAUDE.md); this document explains the design behind them.

## Request flow

```text
URL ──▶ React Router (src/app/routes.tsx)
          │
          ├─ RootLayout: focus after navigation, scroll restoration, loading bar, and
          │  re-checking the page when the session ends (e.g. signed out in another tab)
          │
          ├─ layout route loader ──▶ requireAccount(role): signed in? profile? right role?
          │     otherwise redirect to sign in (remembering the page), /welcome, or the other
          │     role's home. StudentLayout also loads the student's classes and passes the
          │     student to pages through the outlet context (useCurrentStudent).
          │
          ├─ page route loader ───▶ repositories (each loader checks the account again,
          │     because React Router runs layout and page loaders at the same time)
          │
          └─ page route action ◀── forms. Pages with several forms send them with fetchers
                (useFetcherForm), so each form keeps its own result and the page stays put;
                every loader on the page then reloads, so lists are never stale.
```

- **Repositories** (`src/data/repositories.ts`) are interfaces: `AuthService`, `AccountRepository`,
  `ClassRepository` and `StudentHomeRepository`. `createAppDependencies()` in `src/data/index.ts`
  builds the Supabase implementations (`src/data/supabase/`); only the home page's unbuilt panels
  still come from `src/data/sample/`. Tests pass in-memory fakes to `createRoutes()`.
- **Loaders and actions** receive the request's `AbortSignal`, so leaving a page cancels its
  requests. Expected problems are `AppError`s with a code from `src/domain/errors.ts`; actions turn
  them into a `FormResult` the page shows next to the form, and anything unexpected shows
  `RouteErrorPage` inside the layout, whose "Try again" re-runs the loaders.
- **Domain functions** (`src/domain/`) hold business rules as pure functions: task status, due
  wording, ranking, validation of names, emails, passwords and join codes, year levels.
- **Components** render props only. Shared primitives are in `src/components/ui/` and form fields in
  `src/components/forms/`; feature components live in `src/features/<feature>/components/`.

## Routes

| Path                        | Page                                                  | Status       |
| --------------------------- | ----------------------------------------------------- | ------------ |
| `/`                         | Sends people to sign in, `/welcome` or their home     | Built        |
| `/sign-in`, `/register`     | Sign in; create a student or teacher account          | Built        |
| `/forgot-password`          | Request a password reset email                        | Built        |
| `/reset-password`           | Choose a new password (from the email link)           | Built        |
| `/auth/confirm`             | Where confirmation and reset email links land         | Built        |
| `/auth/callback`            | Where Google sign-in returns                          | Built        |
| `/welcome`                  | Choose a role and name (accounts without a profile)   | Built        |
| `/sign-out`                 | Sign out (form action only)                           | Built        |
| `/student`                  | Student home (tasks and side panels are sample data)  | Built        |
| `/student/class`            | Classes, teachers, year levels; join or leave a class | Built        |
| `/student/learn`            | Learn                                                 | Planned page |
| `/student/textbook`         | Textbook                                              | Planned page |
| `/student/class/tasks`      | All of the student's tasks                            | Planned page |
| `/student/more`             | More                                                  | Planned page |
| `/student/more/shop`        | Coin shop                                             | Planned page |
| `/teacher`                  | Teacher home                                          | Planned page |
| `/teacher/classes`          | The teacher's classes; create a class                 | Built        |
| `/teacher/classes/:classId` | Students and year levels, class code, class settings  | Built        |
| `/teacher/tasks`            | Tasks                                                 | Planned page |
| `/teacher/reports`          | Reports                                               | Planned page |
| `/teacher/more`             | More                                                  | Planned page |

Every planned page must be replaced by the real feature before release.

## Accounts, data and security

- **Auth:** Supabase Auth with the PKCE flow. Registration sends a confirmation email; its link
  opens `/auth/confirm`, which verifies the one-time token and opens `/welcome`. There the person
  chooses the account's role, name and password (names are prefilled from registration; the role
  never is, as it can't be changed). Registering an address twice before confirming keeps the
  first password and details, so nothing from registration is trusted: the password chosen at
  `/welcome` replaces any password someone else chose.
- **Proving the email address:** an account without a profile can't sign in with a password at
  all: the `custom_access_token_hook` refuses the token, so a password someone else registered
  never gives them a session. Only a session opened from an email link (or Google) in the last day
  may create a profile, which `complete_profile` checks from the session token. `/welcome` and the
  sign-in page offer "Email me a link" (a reset link) to anyone who needs one.
  `email_sign_in_age()` gives the app the age of such a sign-in by the database's clock.
- **Ended sessions:** access tokens stay valid until they expire (an hour), so every database
  function also checks that the token's session still exists. Signing out, or a password change
  that ends other sessions, takes away database access at once.
- **Passwords:** `/welcome` and the reset page are offered only within 30 minutes of opening an
  email link, and the reset page only after a reset link opened in that tab. The reset ends by
  signing out. These are interface rules: the server's own rule (`secure_password_change`) makes
  sessions older than a day sign in again before changing a password, so a session under a day
  old could still change it directly through the auth API.
  Passwords are 8 to 72 bytes with letters and numbers. "Forgot password" gives the same answer
  for every address.
- **Sessions:** kept in `localStorage` (`mathsexpress-auth`) and refreshed automatically. Signing
  out always clears the session on this device, even if the server can't be reached. Sessions that
  end elsewhere (another tab, or the server) send every open page back through its checks.
- **Google:** off until credentials are configured (see `docs/local-development.md`). The sign-in
  and register pages ask the auth server first and show the button as unavailable until then.
- **Database:** `supabase/migrations/` is the only source of the schema. Tables: `profiles`,
  `classes`, `class_teachers`, `class_join_codes`, `class_members` (with each student's year level),
  `former_class_members` (the level a student had when they left) and `year_level_changes` (an
  audit trail). The app reads and writes only through functions such
  as `join_class`, `my_classes`, `create_class`, `class_students`, `set_student_year_level` and
  `remove_student`.
- **Security:** row-level security is on for every table and signed-in users have no direct table
  access except reading their own profile. Each function runs with fixed privileges
  (`SECURITY DEFINER`, empty `search_path`) and first checks who is calling: their role, and for
  class actions that they teach that class. Problems are raised as codes (`teachers_only`,
  `class_not_found`, ...) that the app shows as friendly messages. Another teacher's class is
  reported exactly like a class that doesn't exist. Students never see join codes, email
  addresses or other students; teachers see only their own students' names, year levels and join
  dates.
- **Year levels:** set per class membership, starting at the class's level. Only the class's
  teacher can change it, and changing the class's level moves the students who were on the old
  level. Every change is recorded in `year_level_changes`. A student who leaves (or is removed)
  and rejoins gets back the level they had, so leaving can never undo the teacher's choice;
  a student who was on the class's level rejoins on its current level.
- **Teachers:** a teacher who teaches a class can't be deleted until each class has another teacher
  or is deleted, so no class is ever left without someone to manage it.
- **Join codes:** 8 characters from 31 letters and digits that can't be confused (about 8.5 × 10¹¹
  possibilities), generated in the database from a secure random source. Teachers can replace a
  code at any time; the old one stops working at once.
- **Configuration:** the browser needs only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
  (public values; `npm run env:local` writes them for the local stack). Secret keys are never used
  by the app. The build adds the Supabase address to the Content-Security-Policy's `connect-src`.

## Deploying

Nothing deploys automatically, and deploying needs the owner's approval. When a hosted Supabase
project is created for 2.0:

1. Apply the migrations (`supabase db push` against the new project, with approval).
2. In Authentication settings, match `supabase/config.toml`: email confirmation on, secure password
   change on, minimum password length 8 with letters and digits, the redirect URLs for the site,
   and the confirmation and recovery email templates.
3. Turn on the Custom Access Token hook with `public.custom_access_token_hook`. Without it, someone
   who registers an address before its owner can sign in with their password and keep changing it.
4. Check that the database functions can read `auth.sessions` (they run as `postgres`); otherwise
   every signed-in action fails with "Sign in to continue".
5. Supabase also offers "require current password when updating". Test it first: the welcome and
   reset pages change the password without the current one, from an email-link session.
6. Build with that project's `VITE_SUPABASE_URL` and publishable key (the build adds the address to
   the Content-Security-Policy).

## Adding a feature

1. Add domain types and rules in `src/domain/` with unit tests.
2. If it needs data, add a migration with RLS and permission-checking functions, tests in
   `tests/db/`, then repository methods in `src/data/` (Supabase implementation and the in-memory
   fake in `src/test/fakeDependencies.ts`). Run `npm run db:types` after the migration.
3. Create `src/features/<name>/` with a loader, a page and small components, each with its CSS
   Module, using only design tokens.
4. Register the route in `src/app/studentRoutes.tsx` or `teacherRoutes.tsx`, replacing its planned
   page, and add paths to `src/config/paths.ts`.
5. Write page tests with `renderApp()` (including an axe-core check), check the page in the
   browser at 1280px, 768px and 375px, then follow the commit workflow in CLAUDE.md.

## Visual design

- Tokens: `src/styles/tokens.css` (colours, type, spacing, radii, shadows, sizes, breakpoints).
  The logo has its own colour tokens, used for the logo only.
- The student home follows the structure of the project owner's reference dashboard: a
  full-width welcome banner, a row of task cards with "View all", recommended practice and
  progress on the left, and the class leaderboard, coin shop, daily challenges and rewards on the
  right. All artwork is original: the banner graph, task and topic card scenes, and the student
  backdrop. Never copy artwork, mascots or branding from other products.
- Hosting: `wrangler.jsonc` serves `dist/` from the `mathsexpress-v2` Worker with SPA fallback;
  `public/_headers` sets the Content-Security-Policy (the build adds the Supabase address) and
  caching. `npm run preview:worker` runs the
  production build locally in the Cloudflare runtime.
