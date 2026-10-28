/** The app version from package.json, injected at build time (see `define` in vite.config.ts). */
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  /** Supabase API URL, e.g. http://127.0.0.1:55321 for the local stack. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase publishable (anon) key. Safe in the browser: access is enforced by the database. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
