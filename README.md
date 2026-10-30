# MathsExpress 2.0

MathsExpress is a K–12 maths learning platform for NSW students and teachers: practice matched to
each student's year level, tasks set by teachers, a built-in textbook, and rewards that keep
students coming back.

**MathsExpress 2.0** is a complete rebuild of the original MathsExpress (v11), with a new
architecture, design system and codebase.

## Status

| Phase | Scope                                                          | Status                  |
| ----- | -------------------------------------------------------------- | ----------------------- |
| 1     | Foundation, design system, top navigation, student homepage    | Complete and approved   |
| 2     | Authentication, student and teacher accounts, class management | Development preview     |
| 3     | Guided learning and practice                                   | Started (Year 9 lesson) |
| Later | Teacher tasks, interactive textbook, rewards, reports          | Planned                 |

- The teacher workspace, lesson tasks, saved student progress, reports and coin shop are
  implemented. Other practice content and textbook chapters are still in development.
- A **new empty hosted V2 database** was created in Sydney, and its eight migrations were
  applied. Every student and teacher must create a **new account**; old accounts are not migrated.
- The old MathsExpress database is paused and preserved. The existing public Worker still
  serves v11 until the separate V2 preview passes hosted-authentication and live-site checks.
  See [hosted launch](docs/hosted-launch.md).

## Getting started

Requires Node.js 24 (see `.nvmrc`).

It also needs Docker and the Supabase CLI for the local database and sign-in service; see
[docs/local-development.md](docs/local-development.md).

```sh
npm install         # installs dependencies and enables the git hooks in .githooks
supabase start      # local database, auth and test mailbox (Docker)
npm run env:local   # writes .env.local for the local stack (never committed)
npm run dev         # starts the app at http://localhost:5173
```

Open http://localhost:5173, create a student or teacher account on the Register page, and
confirm it from the test mailbox at http://127.0.0.1:55324.

## Scripts

| Command                  | What it does                                                      |
| ------------------------ | ----------------------------------------------------------------- |
| `npm run dev`            | Development server with hot reload                                |
| `npm run check`          | Format, lint, type check, tests and production build (same as CI) |
| `npm test`               | Run the tests once (`npm run test:watch` to watch)                |
| `npm run format`         | Apply Prettier formatting                                         |
| `npm run preview:worker` | Build and serve through Wrangler, the way Cloudflare runs it      |
| `npm run test:db`        | Database and sign-in tests against the local Supabase stack       |
| `npm run db:types`       | Regenerate the database types after adding a migration            |

## Technology

React 19, TypeScript (strict), Vite, React Router, CSS Modules with design tokens, Vitest with
Testing Library and axe-core, ESLint and Prettier. Accounts and data use Supabase (Auth and
Postgres); every permission is checked in the database. It is hosted as a Cloudflare Worker that
serves the built app (`wrangler.jsonc`).

## Project structure

```text
src/
  app/            routes, root layout, not-found / error / planned-section pages
  layouts/        student and teacher layouts, header, navigation, logo
  features/       one folder per feature (e.g. student-home): page, loader, components, tests
  components/ui/  shared design-system components (Button, Panel, ProgressBar, ...)
  domain/         types and business rules, as pure tested functions
  data/           data-access interfaces; Supabase implementations; sample data for unbuilt panels
  config/         paths, navigation and app settings
  lib/ hooks/     small shared helpers and React hooks
  styles/         design tokens and global styles
supabase/         local stack config, database migrations, email templates
tests/db/         database and sign-in tests against local Supabase
scripts/          git-hook and CI checks (commit format, credential scanning, deploy guard)
docs/             architecture guide and notes on the old system
```

## Branches and backups

| Branch or tag                | Contents                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `main`                       | MathsExpress 2.0 as last approved, updated from `mathsexpress-v2` by pull request            |
| `mathsexpress-v2`            | Active MathsExpress 2.0 development                                                          |
| `legacy-v11`, tag `v11.5.35` | The original MathsExpress v11.5.35, exactly as it runs on the live site. A permanent backup. |

GitHub rulesets stop anyone, admins included, from force-pushing or deleting `main` and
`legacy-v11`, or moving or deleting the `v11` tags.

## Deployment

GitHub Actions deploys **tested pushes to `mathsexpress-v2`** automatically to the separate
Cloudflare V2 Worker, once the required hosting settings are configured. Until then, CI prints a
setup warning and skips deployment. See [Cloudflare setup](docs/cloudflare-auto-deploy.md).

The original live `mathsexpress` Worker has not yet been replaced. The owner approved a
fresh-account replacement; proceed only after V2 hosting, sign-in and email links have been
verified. The old code and paused database remain available for rollback.

## Quality and contributing

Every change passes Prettier, ESLint, TypeScript, the test suite and a production build. Git
hooks check commit messages, scan for credentials and run the full checks before each push, and
GitHub Actions runs the same checks on every push and pull request. Commits use detailed messages
in the format described in [CLAUDE.md](CLAUDE.md).

## Documentation

- [CLAUDE.md](CLAUDE.md): project rules, architecture, Git workflow and commit format.
- [docs/architecture.md](docs/architecture.md): data flow, routes, adding features, connecting a
  backend.
- [CHANGELOG.md](CHANGELOG.md): changes by version.
- [docs/rebuild-reference.md](docs/rebuild-reference.md): where the old v11 system is kept.
