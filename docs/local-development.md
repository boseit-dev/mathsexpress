# Local development

MathsExpress 2.0 runs entirely on your computer for development: the app (Vite) and a local
Supabase stack (Postgres, Supabase Auth and a test mailbox in Docker). Nothing here touches the
production database or the live website.

## Requirements

- Node.js 24 (`.nvmrc`)
- Docker (Docker Desktop, OrbStack or Colima)
- The Supabase CLI: `brew install supabase/tap/supabase`

## First run

```sh
npm install
supabase start      # first run downloads the Docker images; later starts take seconds
npm run env:local   # writes .env.local (not committed) with the local URL and publishable key
npm run dev         # http://localhost:5173
```

Create accounts on the Register page; the confirmation email arrives in the test mailbox below.

The local stack uses its own ports, so it can run beside other Supabase projects:

| Service                | Address                |
| ---------------------- | ---------------------- |
| API                    | http://127.0.0.1:55321 |
| Database               | 127.0.0.1:55322        |
| Supabase Studio        | http://127.0.0.1:55323 |
| Test mailbox (Mailpit) | http://127.0.0.1:55324 |

Every email the app sends locally (account confirmation, password reset) lands in the test mailbox
instead of a real inbox.

## Trying the class features

1. Register a teacher at http://localhost:5173/register, open the confirmation link from the test
   mailbox, and choose the role, name and password. Go to **Classes**, create a class and note its
   code.
2. Open http://[::1]:5173 in another tab and sign in as the teacher there. A different address
   keeps its own session, so you can be the teacher and a student at once.
3. In the first tab, sign out, then register and confirm a student the same way. Open **Class**
   and join with the code.
4. In the teacher's tab, open the class to see the student, change their year level, replace the
   code, change the settings or remove the student.

Use made-up addresses ending in `example.test` and throwaway passwords for local accounts.
`supabase db reset` deletes them all.

## Database changes

- Change the schema only with a new file in `supabase/migrations/`; never edit the database by hand.
- `supabase db reset` rebuilds the local database from the migrations (it deletes local data).
- `npm run db:types` regenerates `src/data/supabase/database.types.ts`; CI fails if it is out of date.
- `npm run test:db` runs the database and authentication tests against the local stack.

## Google sign-in

Google sign-in needs an OAuth client from Google Cloud; it is the only part that cannot be tested
without your own credentials.

1. In Google Cloud Console, create an OAuth client of type "Web application".
2. Add the authorised redirect URI `http://127.0.0.1:55321/auth/v1/callback`.
3. Put the client ID and secret in an untracked `supabase/.env` file:

   ```sh
   SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-client-id
   SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-client-secret
   ```

4. In `supabase/config.toml`, set `enabled = true` under `[auth.external.google]`.
5. Restart the stack: `supabase stop && supabase start`.

Until then the "Continue with Google" button explains that Google sign-in is not set up yet.

Never commit these values; `supabase/.env` is ignored by Git.
