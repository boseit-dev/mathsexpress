# Deploy MathsExpress v11.5.7 to Cloudflare

On macOS, extract the ZIP, open Terminal, enter the extracted folder, then run:

```bash
npx wrangler@latest deploy
```

This project deploys to the existing Worker named `mathsexpress` from `wrangler.jsonc`.

After deployment, hard refresh the site with Command + Shift + R.

## v11.5.7 includes
- Profile page mascot removed.
- Built-in CambridgeMATHS NSW Stage 5 Year 9 PDF.
- Owner account directory and permanent account deletion.
- Teacher Safety Alerts.
- Maths Chess Restart Game control.
- Clean interaction and page animations.
