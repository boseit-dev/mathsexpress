# MathsExpress 2.0: automatic Cloudflare updates

The owner approved automatic deployments **only to the separate V2 test Worker**. Every push to
`mathsexpress-v2` that passes the GitHub application and database tests will update
`mathsexpress-v2` in Cloudflare.

## One-time activation

1. Create or select the **mathsexpress-v2** Worker in Cloudflare. Keep it separate from the old
   live `mathsexpress` Worker and do not add the old site's custom domain or routes.
2. In Cloudflare, get your **Account ID** and make a scoped **Workers editing** API token for
   that account. Never share or commit the token.
3. Set up a **separate hosted Supabase project** for MathsExpress 2.0. Apply this repository's
   V2 migrations to the new project, using a reviewed migration process. Do not connect to
   the old live MathsExpress Supabase database (`dsjrxkxjcaurrbijihja`).
4. Open GitHub **Settings > Secrets and variables > Actions** for `boseit-dev/mathsexpress`.
   Under **Secrets**, create:
   - `CLOUDFLARE_V2_API_TOKEN`: the scoped Cloudflare API token.
   - `CLOUDFLARE_V2_ACCOUNT_ID`: the Cloudflare Account ID.
5. Under **Variables**, create:
   - `V2_SUPABASE_URL`: the new V2 Supabase project's HTTPS URL.
   - `V2_SUPABASE_PUBLISHABLE_KEY`: the public browser publishable key for that new project.
     Never use the service-role key or a database password for the public frontend.
6. Push the next tested change to `mathsexpress-v2` and watch
   [GitHub Actions](https://github.com/boseit-dev/mathsexpress/actions).
   A successful **Deploy tested V2 updates to Cloudflare** job publishes the V2 test site.

Until all four settings exist, the workflow prints a warning and skips deployment. If either
CI test job fails, the deploy job does not run.

## Safety

- The workflow builds exactly the tested `mathsexpress-v2` branch commit.
- It verifies `wrangler.jsonc` targets exactly `mathsexpress-v2` without custom routes.
- It refuses the existing production Supabase project's URL.
- Pushes to `main`, pull requests and legacy branches never publish the V2 Worker.
- The live original `mathsexpress` Worker must remain unchanged until a separate release.
- Do not also enable Cloudflare's built-in automatic Git builds for the same Worker while this
  GitHub Actions pipeline is enabled, or both systems will try to deploy the same commits.
