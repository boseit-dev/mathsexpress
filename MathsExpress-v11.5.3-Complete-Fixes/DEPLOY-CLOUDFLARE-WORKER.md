# MathsExpress — Cloudflare Worker deployment

This package is structured so Cloudflare deploys both:
- the MathsExpress static website from `public/`
- the API Worker from `worker.js`

The previous dashboard ZIP upload treated the project as static assets only. That is why Cloudflare disabled Runtime variables and secrets.

## Recommended: GitHub + Cloudflare Workers Builds

1. Create a GitHub repository.
2. Upload the CONTENTS of this folder to the repository root. You should see `worker.js`, `wrangler.jsonc`, and the `public` folder at the top level.
3. In Cloudflare, open **Workers & Pages** and choose **Create application** / **Import repository**.
4. Select the GitHub repository.
5. Cloudflare should detect `wrangler.jsonc`. Deploy it as a Worker.
6. Open the deployed Worker -> **Settings** -> **Variables and Secrets**.
7. Add a **Secret** named exactly `GROQ_API_KEY` and paste the Groq key as its value.
8. Save/Deploy the secret change.
9. Test `/api/ai` and then open MathsExpress normally.

## Alternative: Wrangler CLI

From this folder:

```bash
npx wrangler@latest deploy
```

Then add the secret:

```bash
npx wrangler@latest secret put GROQ_API_KEY
```

Paste the key when prompted.

## Important

Never put the Groq key inside `worker.js`, HTML, browser JavaScript, GitHub source, or the `public` folder.
