# MathsExpress ↔ Receptra (public-site chat)

This release adds the Receptra chat launcher on the **public MathsExpress homepage only** (`public/index.html`). It is intentionally not installed on `app.html` or the signed-in student and teacher workspace, so chat does not automatically share learning activity or account information with Receptra.

## Configured addresses

- MathsExpress website: https://mathsexpress.aarush-sharma6.workers.dev/
- Receptra backend: https://receptra-staging.aarush-sharma6.workers.dev
- Public widget key: `pk_ce260ad7ed8e43b69f8be0c384745306ed9f` (not a secret)

The widget is only loaded on `mathsexpress.aarush-sharma6.workers.dev`, after you deploy this MathsExpress source to that Worker. Other preview domains will not load it. It requires live HTTPS access to Receptra; this environment did not have outbound network connectivity to verify that endpoint.

## Deploy (from this folder)

```bash
npx wrangler@latest login
npx wrangler@latest deploy
```

Make sure you are deploying **MathsExpress**, not the separate Receptra Worker. `wrangler.jsonc` already targets `mathsexpress` and its `public` assets. Do not upload `node_modules`, `.env.local` or any provider secret. Do not manually paste a Groq/Supabase service secret into the public site.

Then visit MathsExpress in a private browser window, refresh, and check for the chat launcher. Send a **test-only** question such as “What does MathsExpress offer teachers?” Check that the conversation reaches the Receptra Inbox. Before using it with real students, complete your privacy review and Receptra's security testing.

## Control the widget

Open `public/receptra-widget.js`. Change `WIDGET_ENABLED` from `true` to `false` and redeploy to hide it. The loader refuses to start on other domains. To change the public widget key or Receptra host, edit them there and update `public/_headers` to match the new HTTPS origin.

## If the launcher does not show

1. Check MathsExpress DevTools → Console for Content Security Policy errors; the supplied `_headers` allows the exact Receptra origin in script, connection and frame rules.
2. Confirm the deployed worker contains `public/receptra-widget.js`; a hard refresh or service-worker update may be needed.
3. Open `https://receptra-staging.aarush-sharma6.workers.dev/widget.js` on your own device to verify that it returns JavaScript (not an error page).
4. In Receptra → MathsExpress → AI Receptionist → Chat widget, ensure the widget is enabled and the Allowed website is `https://mathsexpress.aarush-sharma6.workers.dev`.
5. Chat availability depends on a running, configured Receptra backend, an AI provider and database permissions. A correct embed by itself cannot certify those services.

**Privacy:** The public chat is intended for general product/support questions. Avoid sending school, class, student names, grades, passwords or other personal details into a test conversation.
