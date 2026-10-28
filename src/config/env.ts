export interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

/**
 * Reads the Supabase connection from the build environment (.env.local in development).
 * Returns null when it is missing, so the app can explain how to set it up instead of failing.
 */
export function readSupabaseConfig(env: ImportMetaEnv = import.meta.env): SupabaseConfig | null {
  const url = env.VITE_SUPABASE_URL?.trim();
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}
