# MathsExpress 2.0

MathsExpress is a K–12 maths learning platform for NSW students and teachers: practice matched to
each student's year level, tasks set by teachers, a built-in textbook, and rewards that keep
students coming back.

**MathsExpress 2.0** is a complete rebuild of the original MathsExpress (v11), with a new
architecture, design system and codebase.

## Status

| Phase | Scope                                                          | Status                |
| ----- | -------------------------------------------------------------- | --------------------- |
| 1     | Foundation, design system, top navigation, student homepage    | Complete and approved |
| 2     | Authentication, student and teacher accounts, class management | In progress           |
| Later | Learning engine, tasks, textbook, rewards, reports             | Planned               |

- 2.0 is a development preview. The home page shows clearly labelled sample data, and sections that
  are not built yet say so.
- The live website (https://mathsexpress.aarush-sharma6.workers.dev) still runs the original
  v11.5.35. It is replaced only when 2.0 is complete and the owner approves the release.

## Getting started

Requires Node.js 24 (see `.nvmrc`).

```sh
npm install   # installs dependencies and enables the git hooks in .githooks
npm run dev   # starts the app at http://localhost:5173
```

Open http://localhost:5173 to see the student home page. A bar at the top links to the teacher
layout.

## Scripts

| Command                  | What it does                                                      |
| ------------------------ | ----------------------------------------------------------------- |
| `npm run dev`            | Development server with hot reload                                |
| `npm run check`          | Format, lint, type check, tests and production build (same as CI) |
| `npm test`               | Run the tests once (`npm run test:watch` to watch)                |
| `npm run format`         | Apply Prettier formatting                                         |
| `npm run preview:worker` | Build and serve through Wrangler, the way Cloudflare runs it      |

## Technology

React 19, TypeScript (strict), Vite, React Router, CSS Modules with design tokens, Vitest with
Testing Library and axe-core, ESLint and Prettier. It is hosted as a Cloudflare Worker that serves
the built app (`wrangler.jsonc`).

## Project structure

```text
src/
  app/            routes, root layout, not-found / error / planned-section pages
  layouts/        student and teacher layouts, header, navigation, logo
  features/       one folder per feature (e.g. student-home): page, loader, components, tests
  components/ui/  shared design-system components (Button, Panel, ProgressBar, ...)
  domain/         types and business rules, as pure tested functions
  data/           data-access interfaces and their implementations (sample data for now)
  config/         paths, navigation and app settings
  lib/ hooks/     small shared helpers and React hooks
  styles/         design tokens and global styles
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

Nothing deploys automatically: there are no deploy workflows or Git-connected Cloudflare builds.
`wrangler.jsonc` targets a separate development Worker, `mathsexpress-v2`, and a test fails if it
is ever pointed at the live `mathsexpress` Worker. Deploying requires the owner's approval.

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
