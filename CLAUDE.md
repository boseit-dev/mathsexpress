# MathsExpress 2.0: permanent rules for Claude Code sessions

MathsExpress 2.0 is a from-scratch rebuild of MathsExpress, a K–12 maths learning platform for NSW
students and teachers. Read this whole file before changing anything and follow it in every session.
It overrides habits and defaults. If an instruction from the user conflicts with it, ask before acting.

## Status

- **Phase 1** (`2.0.0-alpha.1`): built and awaiting the user's review. It covers the project
  foundation, design system, student and teacher layouts with top navigation, and the student
  homepage, all on clearly labelled development sample data.
- Not built yet: authentication, backend/API, database access, learning engine, textbook,
  teacher tools, shop purchases. Nav destinations for unbuilt areas show the "planned section" page
  (the full route list is in `docs/architecture.md`).
- Never start the next phase until the user has reviewed and approved the current one.

## Production safety: never break these

- The live website is the **old** MathsExpress (v11.5.35) on the Cloudflare Worker `mathsexpress`.
  Its code is preserved in tag `v11.5.35` and branch `legacy-v11`. It must keep running untouched
  until the user approves the MathsExpress 2.0 release.
- This project deploys to a **separate** Worker, `mathsexpress-v2` (`wrangler.jsonc`). Never point
  it at `mathsexpress`, and never run `wrangler deploy` (any Worker) without the user's explicit
  approval in the current conversation. Never change the old Worker's routes, domains or secrets.
- Never touch the production Supabase project `dsjrxkxjcaurrbijihja`: no migrations, writes,
  deletions or exports. Student, teacher and class data must never be removed or exposed.
- Never commit, print or paste passwords, API keys or tokens. Real values belong in untracked
  `.dev.vars` / `.env` files or Cloudflare secrets; only placeholder examples are committed. The
  repository is **public**.

## Git and GitHub workflow

Repository: `boseit-dev/mathsexpress` (public). One repository only; never create another.

| Ref                          | Purpose                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `mathsexpress-v2`            | All MathsExpress 2.0 development. Commit and push here.                           |
| `main`                       | Still the old v11 code. Replaced by 2.0 only after the user approves the release. |
| `legacy-v11`, tag `v11.5.35` | Permanent backup of the original project. Never move, rewrite or delete.          |

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

**Release (only after the user approves 2.0):** open a pull request from `mathsexpress-v2` into
`main` and merge it normally so all history is preserved. Then deploy with approval, after renaming
the Worker in `wrangler.jsonc` as part of the agreed release plan.

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
Cloudflare Worker serving the built static files (`wrangler.jsonc`, SPA fallback); API routes will
be added to that Worker under `/api/*`, with Supabase as the database. `docs/architecture.md`
explains the data flow, the route list, how to add a feature and how to connect a backend.

```text
src/
  app/            router, route table, RootLayout (focus after navigation, scroll restoration),
                  app-level pages (not found, route errors, planned sections)
  layouts/        StudentLayout, TeacherLayout, AppHeader, navigation, brand, dev-preview notice
  features/<x>/   one folder per feature: page, route loader, feature components and their tests
  components/ui/  shared design-system primitives (Button, Panel, ProgressBar, ...)
  domain/         types and pure business rules: no React, no I/O
  data/           repository interfaces and implementations (sample/ now, a real backend later)
  config/         paths, navigation and app settings
  lib/            small generic helpers (formatting, dates, class names)
  hooks/          shared React hooks
  styles/         tokens.css (design tokens) and global.css
  test/           test setup and helpers
scripts/          git-hook and CI scripts (TypeScript, run directly by Node 24)
```

Rules:

- **Separation:** components render props; they never fetch data or know where it comes from.
  Route loaders call repositories; pages pass typed data down. Business rules (task status, due
  labels, ranking, accuracy) are pure functions in `domain/` or `lib/` with unit tests.
- **Data access:** repository interfaces live in `src/data/repositories.ts` and reach the app through
  `AppDependencies` (`src/data/index.ts`). A real backend is added as a new implementation beside
  `src/data/sample/`; components and pages must not change.
- **Sample data:** only in `src/data/sample/`, always labelled in the UI by the development preview
  notice, and never presented as real students or teachers.
- **Year levels:** teachers set a student's year level when the student joins a class. Students
  never choose it; never add a year selector for students.
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
- Student home layout follows the owner's reference dashboard: a full-width welcome banner, a row
  of task cards with "View all", recommended practice and progress on the left, and the class
  leaderboard, coin shop, daily challenges and rewards on the right. Desktop navigation is text
  links; phones and tablets use icon tabs. All artwork must be original (never copy another
  product's illustrations, mascots or branding).
- Card grids size themselves from their panel with container queries, so layouts hold at every
  width, including just after the sidebar appears.

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
- Page tests use `renderApp(path)` (`src/test/renderApp.tsx`), which runs the real route table on
  sample data with the time fixed at `TEST_NOW`; tests run in the Australia/Sydney time zone.
- Never claim something works without running it. Interactive features count as done only when
  they have been exercised in a test or in the browser.

## Commands

| Command                  | What it does                                                           |
| ------------------------ | ---------------------------------------------------------------------- |
| `npm run dev`            | Development server at http://localhost:5173                            |
| `npm run check`          | Everything CI runs: format, lint, types, tests, build                  |
| `npm run check:quick`    | Format, lint and types (also run by the pre-commit hook)               |
| `npm test`               | Unit and component tests once (`npm run test:watch` to watch)          |
| `npm run format`         | Apply Prettier formatting                                              |
| `npm run preview:worker` | Build, then serve `dist/` through Wrangler exactly as Cloudflare would |

## Reference: the old system

See `docs/rebuild-reference.md` for where the old code, feature inventory and live-system notes
are kept. Use them for reference only; never copy old code in wholesale.
