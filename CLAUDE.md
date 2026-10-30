# MathsExpress 2.0: permanent rules for Claude Code sessions

MathsExpress 2.0 is a from-scratch rebuild of MathsExpress, a K–12 maths learning platform for NSW
students and teachers. Read this whole file before changing anything and follow it in every session.
It overrides habits and defaults. If an instruction from the user conflicts with it, ask before acting.

## Status

- **Phase 1** (`2.0.0-alpha.1`): approved and merged into `main`. It covers the project
  foundation, design system, student and teacher layouts with top navigation, and the student
  homepage, all on clearly labelled development sample data.
- **Phase 2** (`2.0.0-alpha.2`): built on `mathsexpress-v2` and waiting for the user's review. It
  adds the redesigned assignment cards, accounts (email and password with email confirmation,
  password reset, Google sign-in once credentials are configured), student and teacher roles, and
  class management (classes, join codes, joining and leaving, teacher-set year levels).
- **Phase 3** (`2.0.0-alpha.3`): started; a real student Learn catalogue with one complete Year 9 guided linear-equations lesson and interactive practice. This first slice is not the complete learning engine; progress is not yet saved to the student account.
- The Textbook now has a library of individual books, navigation and one original Year 9 pilot
  chapter. **Most chapters are still in preparation** and are not claimed syllabus-complete;
  see `docs/textbook-coverage.md` for exact coverage and source links.
- The teacher experience is built: teacher home, class workspaces (Overview, Students, Tasks,
  Progress), real tasks (lessons for a class or chosen students), saved server-marked lesson
  progress and Reports. Students see real tasks.
- Not built yet: the rest of the learning engine (practice sets, worksheets, tests), full
  textbook contents and profile/settings pages. Planned destinations explain
  the limitations; example scores and panels still have Sample data badges.
- Never start the next phase until the user has reviewed and approved the current one.

## Production safety: never break these

- The owner authorised replacing the old website with MathsExpress 2.0 on 30 October 2026,
  with **fresh student and teacher accounts**. No old auth accounts or data are migrated.
  The old code remains backed up in `legacy-v11` and tag `v11.5.35`.
- The old Cloudflare Worker `mathsexpress` still serves the legacy code until a new-site
  cutover succeeds. First deploy and verify the separate `mathsexpress-v2` staging Worker;
  after hosted authentication and smoke tests pass, publish V2 to the legacy Worker name.
  Never delete the old code backup or deploy to the old Worker without a tested release.
- The old Supabase project `dsjrxkxjcaurrbijihja` was paused (not deleted) to free the
  Free plan slot. Never change its schema, data or account records.
- The owner approved the separate hosted V2 Supabase project `czvmrksotfpzitjgopnj` in
  Sydney; all seven schema migrations are installed there (the shop migration
  last, on 30 October 2026). It starts
  with no auth accounts. Use it only for V2, never the old database.
- Local development still uses Docker's local Supabase stack. Hosted V2 database changes
  require reviewed migrations and tests. The hosted migration tool assigned its own migration
  versions; reconcile history before any future CLI `supabase db push` to avoid reapplying SQL.
  Follow `docs/hosted-launch.md` for hosted authentication and release requirements.
- Never commit, print or paste passwords, API keys or tokens. Real values belong in untracked
  `.dev.vars` / `.env` files or Cloudflare secrets; only placeholder examples are committed. The
  repository is **public**.

## Git and GitHub workflow

Repository: `boseit-dev/mathsexpress` (public). One repository only; never create another.

| Ref                          | Purpose                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| `mathsexpress-v2`            | All MathsExpress 2.0 development. Commit and push here.                                     |
| `main`                       | MathsExpress 2.0 as last approved; GitHub's default branch. Updated only by pull request.   |
| `legacy-v11`, tag `v11.5.35` | The original v11.5.35, exactly as it runs on the live site. Permanent backup; never change. |

GitHub rulesets enforce this on the server for everyone, admins included: `main` and `legacy-v11`
cannot be force-pushed or deleted ("Protect main and legacy-v11"), and `v11.*` tags cannot be moved
or deleted ("Protect v11 backup tags"). Pull requests are not required yet. Never change or
disable these rulesets without the user's approval.

**After every completed, tested feature or fix** (one logical change, not every small edit), do
this automatically without being asked:

1. Review exactly what changed: `git status` and `git diff`. Nothing unrelated, generated or
   sensitive may be included.
2. Run `npm run check` (Prettier, ESLint, TypeScript, Vitest, production build) and fix every
   failure. For UI changes, also check the page in the browser at desktop (1280px) and mobile
   (375px) widths with no console errors.
3. Update `CHANGELOG.md` when the change is user-visible.
4. Commit with a detailed message in the format below. The `commit-msg` hook checks the title, that
   there is a description, a `Testing:` section and a `Version:` line matching `package.json`; the
   other sections are required by this file. The `pre-commit` hook scans staged files for
   credentials and runs `npm run check:quick`.
5. Push the checked-out branch: `git push origin mathsexpress-v2`. The `pre-push` hook blocks pushes
   to `main`, `legacy-v11` and `v11.*` tags, branch deletions, history rewrites and anything other
   than the checked-out commit; scans every pushed commit for credentials; and runs `npm run check`.
6. Confirm the GitHub Actions CI run passed (`gh run list --branch mathsexpress-v2 --limit 1`).
7. Tell the user the commit title, a short summary of the description, what was tested and the
   commit hash.

**Never:** force-push; amend, rebase or reset commits that were already pushed; delete branches or
tags; bypass hooks with `--no-verify`; push code that fails checks; set
`MATHSEXPRESS_ALLOW_PROTECTED_PUSH` (reserved for an approved release, set by the user's
instruction only); deploy to production without approval. If GitHub authentication fails, ask the
user to run `gh auth login` once; never ask for tokens in chat.

**Updating `main`** (after the user approves a phase or asks for it): open a pull request from
`mathsexpress-v2` into `main`, wait for CI to pass, and merge it with a merge commit (never squash,
rebase or force). Then fast-forward `mathsexpress-v2` to `main` (`git merge --ff-only origin/main`)
and push it. Never push to `main` directly.

**Deploying is separate from `main`.** After both CI jobs pass on a `mathsexpress-v2`
push, GitHub Actions deploys automatically to the **separate** `mathsexpress-v2` Worker if its
hosting secrets and a separate V2 Supabase project are configured. See
`docs/cloudflare-auto-deploy.md`. This does not deploy from `main` or touch the old live site.
The owner has approved the V2 replacement; verify hosted auth and a staging deployment before
changing the live Worker. No account migration is requested.

### Commit messages

Use a proper multi-line commit body so the full notes appear on GitHub:

```text
feat: build the student homepage

<What was added, changed or fixed — short paragraphs or bullet points.>

Architecture:
<How it works and the important technical decisions, where relevant.>

Reason:
<Why the change was needed.>

Files and systems:
<Main folders, components or systems affected.>

Testing:
- Prettier: passed
- ESLint: passed (0 warnings)
- TypeScript: passed
- Vitest: 42 passed, 0 failed
- Production build: passed
- Browser: <what was checked by hand, or "not run">

Known limitations:
- <Anything incomplete, or "None">

Version: 2.0.0-alpha.1

Co-Authored-By: <trailer provided by the session>
```

- Title: `type: summary` or `type(scope): summary`, imperative, at most 72 characters, no full
  stop. Types: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `build`, `ci`, `chore`,
  `revert`.
- `Testing:` lists only checks that actually ran in this session, with the real numbers. Never
  invent or round up results; write "not run" for anything skipped.
- No secrets, personal data or private URLs in commit messages.

### Versioning

- Semantic versioning in `package.json`. During the rebuild the version is `2.0.0-alpha.N`.
- Bump `N` once per phase, when that phase's work starts (Phase 1 = `2.0.0-alpha.1`); not per
  commit. `2.0.0` is the approved release that replaces the old site.
- Record user-visible changes in `CHANGELOG.md` (Keep a Changelog format) in the same commit.

## Architecture

Stack: React 19, TypeScript 6 (strict), Vite 8, React Router 8 (data router), CSS Modules with
design tokens, Vitest with Testing Library and axe-core, ESLint 9 and Prettier. Hosting: a
Cloudflare Worker serving the built static files (`wrangler.jsonc`, SPA fallback). Accounts and
data use Supabase: the browser signs in with Supabase Auth and calls Postgres functions directly
with the public (publishable) key, so **all security lives in the database**. The build adds the
Supabase address to the site's Content-Security-Policy (`public/_headers`). `docs/architecture.md`
explains the data flow, the route list, security and how to add a feature.

```text
src/
  app/            router, route table, RootLayout (focus after navigation, scroll restoration),
                  auth guards, form helpers, app-level pages (not found, errors, planned sections)
  layouts/        StudentLayout, TeacherLayout, AppHeader, navigation, brand, dev-preview notice
  features/<x>/   one folder per feature: page, route loader, feature components and their tests
  components/ui/  shared design-system primitives (Button, Panel, ProgressBar, ...)
  domain/         types and pure business rules: no React, no I/O
  data/           repository interfaces; supabase/ (accounts, classes) and sample/ (home examples)
  config/         paths, navigation and app settings
  lib/            small generic helpers (formatting, dates, class names)
  hooks/          shared React hooks
  styles/         tokens.css (design tokens) and global.css
  test/           test setup, renderApp and in-memory fakes of the services
supabase/         local stack config, migrations (the only way to change the schema), email templates
tests/db/         database and auth tests against local Supabase (`npm run test:db`)
scripts/          git-hook, CI and setup scripts (TypeScript, run directly by Node 24)
```

Rules:

- **Separation:** components render props; they never fetch data or know where it comes from.
  Route loaders call repositories; pages pass typed data down. Business rules (task status, due
  labels, ranking, accuracy) are pure functions in `domain/` or `lib/` with unit tests.
- **Data access:** repository interfaces live in `src/data/repositories.ts` and reach the app through
  `AppDependencies` (`src/data/index.ts`). `src/data/supabase/` implements them and maps database
  rows to domain types (`mappers.ts`); components never see database shapes.
- **Sample data:** only the home page's unbuilt panels use it (`src/data/sample/`), each with a
  "Sample data" badge. Accounts and classes are always real, never sample data.
- **Year levels:** a student's year level belongs to each class membership. It starts at the class's
  year level and only that class's teacher can change it. Students never choose it: no year
  selector for students, and the database refuses the change from a student.
- **Security and permissions:**
  - Every permission check happens in the database: row-level security on every table, no direct
    table access (except reading your own profile), and `SECURITY DEFINER` functions with
    `search_path = ''` that check the caller's role and class permission. Route guards and hidden
    buttons only keep the interface tidy; never rely on them.
  - A new table needs RLS enabled, privileges revoked from `anon` and `authenticated`, access
    through functions that raise an error code listed in `src/domain/errors.ts`, and tests in
    `tests/db/` for each rule, including attempts by the wrong role.
  - Students never see join codes, email addresses or other students. Teachers see only their own
    classes, and only students' names, year levels and join dates.
  - Change the schema only with a new migration file, then run `npm run db:types` and commit the
    regenerated types (CI fails if they differ).
  - Accounts: an account without a profile can't sign in with a password (the
    `custom_access_token_hook`), and only a session from an email link (or Google) may create a
    profile, which the database checks. Never set up a profile from registration details
    (registering twice keeps the first details and password). Every database function checks the
    session still exists. Signing out must always clear this device's session.
  - Lock order in database functions: the class row first, then memberships.
- **Code style:** small, focused components, one component per file, named exports, files under
  roughly 200 lines. Import with the `@/` alias (`@/` = `src/`). Strong types; no `any`. Comments
  explain why, not what. Handle errors explicitly; never swallow them.
- **Styling:** CSS Modules plus the tokens in `src/styles/tokens.css`. No hard-coded colours,
  spacing, radii, shadows or font sizes in components.
- **No fake functionality:** every button and link must work. A destination that is not built
  yet uses the planned-section page and is reported as a limitation. None may remain at release.
- **Dependencies:** add one only when it is clearly justified. Versions are pinned exactly
  (`.npmrc` has `save-exact`). New packages with install scripts need `npm install-scripts approve`.

## Design system

- Official colours: primary `#3D52A0`, secondary `#7091E6`, muted `#8697C4`, soft `#ADBBDA`, pale
  lavender `#EDE8F5`. White surfaces, dark text, rounded corners, subtle shadows, the Lexend font.
- Secondary, muted and soft blues are below 4.5:1 contrast on white: use them for shapes, accents
  and large text only, never for normal-size text.
- Navigation is always at the top, never a permanent left sidebar. Student: Home | Learn |
  Textbook | Class | More. Teacher: Home | Classes | Tasks | Reports | More.
- Clean, minimal, original, and not a generic AI-generated dashboard. No decorative animation.
- Must work on desktop, tablet and mobile (check 1280px, 768px and 375px).
- Logo: the owner's MathsExpress logo (blue plus and violet dot over a smile; "Maths" navy,
  "Express" violet), drawn in `src/layouts/BrandMark.tsx`. Its colours are the `--color-logo-*`
  tokens and are used for the logo only. It was recreated from a screenshot; if the owner provides
  the original artwork file, replace the drawing with it.
- Student home is the owner's original **Study Journal**, not a copy of Mathspace: a compact
  personal greeting, three study shortcuts, and clearly separated task, progress and practice
  sections. Do not restore the old banner, right-side dashboard sidebar, decorative backdrop
  or any competitor-specific layout, illustrations, mascot or task cards.
- The separate student quick-tools toolbar gives access to Leaderboard, Shop, Daily challenges,
  Achievements and Rewards. These currently contain labelled preview data, not real scores,
  coins, purchases or awards. Its panel motion will be added in a separately tested pass.
- Card layouts must respond to their available width and never overlap lesson controls.

## Accessibility and quality

- Semantic HTML and landmarks, one `h1` per page, a skip link, a page title per route.
- Everything works with the keyboard and shows a visible focus ring. Text contrast at least 4.5:1.
- After in-app navigation, focus moves to `<main id="main-content">` (handled once, in
  `src/app/RootLayout.tsx` and `mainContentFocus.ts`); new pages need nothing extra.
- Small text on coloured, gradient or translucent backgrounds needs an opaque backing that keeps
  4.5:1. axe-core cannot measure contrast in jsdom, so check contrast in the browser.
- Progress bars, icons-only controls and status colours have text equivalents.
- Respect `prefers-reduced-motion`.

## Testing

- Unit tests for domain and lib logic; component tests (Testing Library) for rendering, states and
  interactions; axe-core checks for layouts and pages. Tests sit next to the code as `*.test.ts(x)`.
- Page tests use `renderApp(path, { signedInAs })` (`src/test/renderApp.tsx`), which runs the real
  route table with in-memory fakes of the auth and class services (`src/test/fakeDependencies.ts`)
  and the time fixed at `TEST_NOW`; tests run in the Australia/Sydney time zone. The fakes follow
  the database's rules and error codes; keep them in step when a rule changes.
- The real rules are tested against local Supabase in `tests/db/` (`npm run test:db`, after
  `supabase start`). CI runs them on a fresh stack. Test accounts use `example.test` addresses and
  throwaway passwords that are never printed or committed.
- Never claim something works without running it. Interactive features count as done only when
  they have been exercised in a test or in the browser.

## Commands

| Command                   | What it does                                                           |
| ------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`             | Development server at http://localhost:5173                            |
| `npm run check`           | Everything CI runs: format, lint, types, tests, build                  |
| `npm run check:quick`     | Format, lint and types (also run by the pre-commit hook)               |
| `npm test`                | Unit and component tests once (`npm run test:watch` to watch)          |
| `npm run format`          | Apply Prettier formatting                                              |
| `npm run preview:worker`  | Build, then serve `dist/` through Wrangler exactly as Cloudflare would |
| `supabase start` / `stop` | Start or stop the local database, auth server and test mailbox         |
| `npm run env:local`       | Write `.env.local` with the local Supabase address and public key      |
| `npm run test:db`         | Database and auth tests against local Supabase                         |
| `npm run db:types`        | Regenerate `src/data/supabase/database.types.ts` after a migration     |

## Reference: the old system

See `docs/rebuild-reference.md` for where the old code, feature inventory and live-system notes
are kept. Use them for reference only; never copy old code in wholesale.

## Coin Shop

The shop is a real authenticated student feature at `/student/more/shop`, with My collection
(`/collection`) and Coin history (`/history`) tabs. It sells 98 original cosmetics in seven
kinds (avatars, accessories, backgrounds, frames, effects, titles, dashboard themes) from free
to 5,000 coins, in five rarities whose price bands the database enforces.

- The catalogue lives twice on purpose: prices and ownership in SQL
  (`supabase/migrations/20261031090000_shop_collection.sql`), names and artwork keys in
  `src/domain/shopCatalogue.ts`. A database test fails if they differ, and a unit test fails if
  any item has no artwork. Add items to both, with art in `src/components/cosmetics/`.
- All artwork is original code-drawn SVG. Capybara avatars are built from the mascot rig, so
  they match the official character (and never have a mouth).
- Coins: 100 welcome coins; 20 the first time each lesson question is solved; 25 per finished
  lesson plus 5 per first-try answer, for the first four finished lessons each day (Sydney
  time). Never let the browser set coins or prices, expose shop tables directly, or add real
  money, random rewards or gameplay advantages.
- Trying on is free and saves nothing. Buying locks the wallet row, so duplicate or racing
  requests charge once. Teachers see students' avatar parts (not themes or effects) in class lists.
- Other rewards in the side panels remain explicitly sample data.
