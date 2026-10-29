import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseConfig } from '@/config/env';
import type { Database } from './database.types';

export type MathsExpressClient = SupabaseClient<Database>;

/**
 * How long one request to Supabase may take. Without a limit, a server that accepts the connection
 * but never answers (e.g. the local Docker stack after the computer sleeps) leaves the first page
 * on "Loading MathsExpress…" for ever; with it, the request fails and the error page offers a retry.
 */
export const REQUEST_TIMEOUT_MS = 15_000;

/** fetch with a time limit, keeping any signal the caller passed (both can cancel the request). */
export function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const timeout = AbortSignal.timeout(timeoutMs);
  const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  return fetch(input, { ...init, signal });
}

/** Where the browser keeps the session. Every key the auth client stores starts with this. */
export const AUTH_STORAGE_KEY = 'mathsexpress-auth';

export function createSupabaseClient(config: SupabaseConfig): MathsExpressClient {
  return createClient<Database>(config.url, config.publishableKey, {
    global: { fetch: (input, init) => fetchWithTimeout(input, init) },
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
