# MathsExpress 2.0

MathsExpress is a K–12 maths learning platform for NSW students and teachers. This branch
(`mathsexpress-v2`) is a complete rebuild. The current live site still runs the original v11 code
from `main` until 2.0 is finished and approved.

## Getting started

Requires Node.js 24 (see `.nvmrc`).

```sh
npm install   # also enables the git hooks in .githooks
npm run dev   # http://localhost:5173
```

## Scripts

| Command                  | What it does                                                      |
| ------------------------ | ----------------------------------------------------------------- |
| `npm run dev`            | Development server with hot reload                                |
| `npm run check`          | Format, lint, type check, tests and production build (same as CI) |
| `npm test`               | Run the tests once (`npm run test:watch` to watch)                |
| `npm run format`         | Apply Prettier formatting                                         |
| `npm run preview:worker` | Build and serve through Wrangler, the way Cloudflare runs it      |

## Documentation

- [CLAUDE.md](CLAUDE.md): project rules, architecture, Git workflow and commit format.
- [docs/architecture.md](docs/architecture.md): data flow, routes, adding features, connecting a
  backend.
- [CHANGELOG.md](CHANGELOG.md): changes by version.
- [docs/rebuild-reference.md](docs/rebuild-reference.md): where the old v11 system is kept.

## Deployment

Nothing deploys automatically. `wrangler.jsonc` targets a separate development Worker,
`mathsexpress-v2`, so this branch can never overwrite the live `mathsexpress` Worker. Deploying
requires the project owner's approval.
