# MathsExpress 2.0 hosted launch readiness

Owner decision (30 October 2026): **replace old MathsExpress with V2** and require all
teachers and students to register new accounts. Do not transfer legacy user data.

## Confirmed preparation

- GitHub repo: `boseit-dev/mathsexpress`, code in `main` and `mathsexpress-v2`.
- V2 Supabase: `czvmrksotfpzitjgopnj` (Sydney), quoted $0/month on Free plan.
- Eight V2 SQL migrations are applied to that hosted database: six on 30 October 2026, then
  `shop_collection` (the full shop) and `shop_more_items` (130 items) the same day, after their
  local tests passed.
- It has 18 public tables, all with RLS; there were zero Auth accounts and profiles on creation.
- Paused legacy Supabase: `dsjrxkxjcaurrbijihja`, preserved as a rollback reference.
- The public Cloudflare Worker `mathsexpress` still runs the old site until cutover.
- GitHub Actions has a separate V2 Cloudflare deployment job; the Worker is not yet verified.
- Supabase **Customize Access Token (JWT) Claims** hook was enabled in the hosted V2 dashboard,
  using the Postgres function `public.custom_access_token_hook` (confirmed by the owner).

## Hosting and authentication requirements before public cutover

1. Rotate the previously exposed Cloudflare API token. Save the replacement in the GitHub
   Actions repository secret `CLOUDFLARE_V2_API_TOKEN`; retain a scoped Account ID secret
   `CLOUDFLARE_V2_ACCOUNT_ID`.
2. Under GitHub **Settings > Secrets and variables > Actions > Variables**, configure:
   - `V2_SUPABASE_URL` = `https://czvmrksotfpzitjgopnj.supabase.co`.
   - `V2_SUPABASE_PUBLISHABLE_KEY` = the new V2 project's **publishable** (not secret) key.
3. Run a fresh V2 push after both CI checks pass and verify that the Cloudflare deploy step
   actually executed rather than being marked **skipped**. Use `mathsexpress-v2` staging first.
4. In [V2 Supabase](https://supabase.com/dashboard/project/czvmrksotfpzitjgopnj):
   - Authentication > Hooks: enable **Custom Access Token**, Postgres function
     `public.custom_access_token_hook`. Its SQL definition and grants already exist.
   - Authentication > URL Configuration: set the deployed Cloudflare staging site as Site URL,
     and allow its `/auth/confirm` and `/auth/callback` redirects; update to the live URL at
     cutover. Keep localhost redirects only for intentional development.
   - Authentication > Email Templates: configure **Confirm signup** and **Reset password**
     to use the token-hash links from `supabase/templates/confirmation.html` and
     `supabase/templates/recovery.html`. The app expects `/auth/confirm?token_hash=...`.
   - Confirm email enabled, no anonymous users, signups enabled. Configure an appropriate
     outgoing SMTP provider for real email signups, following Supabase's sending limits.
   - Google sign-in is optional until explicitly configured, and must not appear as working
     before OAuth credentials and callbacks are installed.
5. Test a newly registered teacher and student **on the hosted domain**: confirmation mail,
   profile setup, class creation/joining, assignment, five-question lesson, saved progress,
   teacher report, sign out, revoked session behaviour and password reset.
6. Only after staging passes, change the live `mathsexpress` Worker to serve the verified V2
   bundle with V2 Supabase config. Keep the `legacy-v11` branch and version tag as backup.
   Confirm the public URL loads V2 and that new users can register.

## Honest limitations

The V2 learning catalogue currently contains one published Year 9 lesson. Most additional
lessons, textbooks, worksheets and tests remain unfinished. Never claim full K–12 coverage.

**Do not** restore legacy accounts into the new project or re-use legacy user records. Do not
delete the paused project or change its schema. The Auth and Cloudflare dashboard settings
must be independently verified; deploying React assets alone is not a successful launch.

The hosted migrations were installed through the Supabase integration and have newly
generated migration-history versions rather than their original Git filename timestamps.
Before future CLI pushes, reconcile the migration history to prevent duplicate DDL.
