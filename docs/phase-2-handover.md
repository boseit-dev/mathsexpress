# MathsExpress 2.0: Phase 2 handover

Written 28 October 2026 for whoever continues Phase 2 (a person or another AI assistant). Read
`CLAUDE.md` first: it holds the project rules, which still apply. Phase 3 must not start until
the owner approves Phase 2.

## Where things are

- Branch `mathsexpress-v2` holds all Phase 2 work. Last commits:
  - `cc1e7c8` fix: resolve every finding from the Phase 2 security and quality review
  - `72c1931` fix: let the built site connect to its Supabase project
  - `860dc16` feat: add the student Class page and teacher class management
  - `e937c95` feat: add sign-in, registration and secure sessions
  - `84ee4d8` feat: add the accounts and classes database with server-side security
  - `c9c6333` feat: redesign assignment cards with an original MathsExpress look
- `main` (GitHub's default branch) is MathsExpress 2.0 Phase 1 (`2f076ff`). Phase 2 is merged into
  `main` by pull request only after the owner approves it (see CLAUDE.md, "Updating main").
- The live site still runs the old v11.5.35 on the Cloudflare Worker `mathsexpress`. Never deploy
  or change it. Backups: branch `legacy-v11` and tag `v11.5.35`, protected by GitHub rulesets.

## Built and tested in Phase 2

- Redesigned assignment cards.
- Accounts (Supabase Auth):
  - registration with email confirmation;
  - account set-up from the email link (role, name and password);
  - sign in and sign out; forgot and reset password; persistent sessions.
- Security hardening:
  - a sign-in hook refuses password sign-ins for accounts that aren't set up yet;
  - the database checks that the session still exists on every call.
- Student Class page: join with a code, leave when allowed. The year level is set by the teacher
  only.
- Teacher pages:
  - Classes: create classes;
  - each class: its code (copy it, make a new one), students' year levels, removing students,
    and settings.
- All permissions are enforced in Postgres (RLS and `SECURITY DEFINER` functions).
- Tests: 252 app tests, 42 database tests (`npm run test:db`), and CI on GitHub.

## What's left in Phase 2

1. **Final review results.** A fourth focused review of the last round of fixes (database, sign-in
   hook, session check, lock order, welcome and reset pages) was still running when this was
   written. Re-review those areas, fix any real problems, and add tests for them.
2. **Confirm CI on `cc1e7c8`.** Run `gh run list --branch mathsexpress-v2 --limit 1`. The
   database job starts a fresh Supabase stack with the new sign-in hook, so check it passes there.
3. **Flaky test watch.** One app test failed once while other test runs loaded the machine. It
   passed in about 20 runs since. If it recurs, find it (`npx vitest run`) and remove the timing
   dependence.
4. **Google sign-in is not tested.** It needs the owner's Google OAuth client. The steps are in
   `docs/local-development.md`. Never commit the values: they go in `supabase/.env`, which is
   ignored by git. Once enabled, check the account set-up and reset flows with Google.
5. **Owner review and approval.** Give the owner the report and screenshots, then wait. Only after
   approval: open a PR `mathsexpress-v2` → `main`, merge it with a merge commit, and fast-forward
   `mathsexpress-v2`.
6. **Known limits to tell the owner about:**
   - The reset and welcome pages' 30-minute rule is an interface rule. The auth server itself
     only forces re-sign-in for sessions over a day old.
   - The hosted Supabase project (not created yet) must be set up as in `docs/architecture.md`
     → "Deploying". That includes the custom access token hook and checking that the functions
     can read `auth.sessions`.

## How to run and test locally

Requires Node 24, Docker and the Supabase CLI.

```sh
npm install
supabase start      # local database, auth server and test mailbox
npm run env:local   # writes .env.local (never committed)
npm run dev         # http://localhost:5173
npm run check       # format, lint, types, tests, build
npm run test:db     # database and auth tests against the local stack
```

Confirmation and reset emails arrive in the test mailbox at http://127.0.0.1:55324. To be a
teacher and a student at once, use http://localhost:5173 in one tab and http://[::1]:5173 in
another (see `docs/local-development.md`).

## Rules that matter most

- Work only on `mathsexpress-v2`. Never push to `main`, force-push, or use `--no-verify`.
- After each tested change, commit with the detailed format in CLAUDE.md, including the line
  `Version: 2.0.0-alpha.2`, then push.
- Never deploy. Never touch the production Supabase project `dsjrxkxjcaurrbijihja`.
- The repository is public: never commit secrets.
- Change the database only with a new migration file, then run `npm run db:types`.
