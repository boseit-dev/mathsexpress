import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseConfig } from '@/config/env';
import type { Database } from './database.types';

export type MathsExpressClient = SupabaseClient<Database>;

/** Where the browser keeps the session. Every key the auth client stores starts with this. */
export const AUTH_STORAGE_KEY = 'mathsexpress-auth';

export function createSupabaseClient(config: SupabaseConfig): MathsExpressClient {
  return createClient<Database>(config.url, config.publishableKey, {
    auth: {
      // PKCE for Google sign-in; email links use one-time token hashes instead (see /auth/confirm).
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      // The app handles /auth/callback and /auth/confirm itself.
      detectSessionInUrl: false,
      storageKey: AUTH_STORAGE_KEY,
    },
  });
}
