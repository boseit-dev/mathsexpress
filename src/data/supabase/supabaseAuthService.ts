import type { User } from '@supabase/supabase-js';
import type { SupabaseConfig } from '@/config/env';
import { isAccountRole, type AuthUser } from '@/domain/account';
import { cleanText } from '@/domain/validation';
import type { AuthService } from '../repositories';
import type { MathsExpressClient } from './client';
import { throwIfError, toAppError } from './errors';

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function toAuthUser(user: User): AuthUser {
  const metadata = user.user_metadata;
  const role: unknown = metadata.role;
  return {
    id: user.id,
    email: user.email ?? '',
    registration: {
      ...(isAccountRole(role) ? { role } : {}),
      ...(readString(metadata.first_name) ? { firstName: readString(metadata.first_name) } : {}),
      ...(readString(metadata.last_name) ? { lastName: readString(metadata.last_name) } : {}),
    },
  };
}

interface AuthServiceOptions {
  /** Where the app is served, e.g. http://localhost:5173; Google sends users back here. */
  appOrigin: string;
}

export function createSupabaseAuthService(
  client: MathsExpressClient,
  config: SupabaseConfig,
  { appOrigin }: AuthServiceOptions,
): AuthService {
  return {
    async getCurrentUser() {
      // getSession reads the stored session (refreshing it if needed); getUser then confirms it
      // with the server, so a revoked or deleted account is not trusted from local storage alone.
      const { data: sessionData } = await client.auth.getSession();
      if (!sessionData.session) return null;
      const { data, error } = await client.auth.getUser();
      if (error) {
        if (error.status === 401 || error.status === 403) return null;
        throw toAppError(error);
      }
      return toAuthUser(data.user);
    },

    async signIn(email, password) {
      const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
      throwIfError(error);
    },

    async register({ email, password, role, firstName, lastName }) {
      const { error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { role, first_name: cleanText(firstName), last_name: cleanText(lastName) },
        },
      });
      throwIfError(error);
    },

    async resendConfirmation(email) {
      const { error } = await client.auth.resend({ type: 'signup', email: email.trim() });
      throwIfError(error);
    },

    async confirmEmailLink(tokenHash, type) {
      const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type });
      throwIfError(error);
    },

    async isGoogleSignInAvailable() {
      try {
        const response = await fetch(`${config.url}/auth/v1/settings`, {
          headers: { apikey: config.publishableKey },
        });
        if (!response.ok) return false;
        const settings = (await response.json()) as { external?: { google?: unknown } };
        return settings.external?.google === true;
      } catch (error) {
        throw toAppError(error);
      }
    },

    async startGoogleSignIn() {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${appOrigin}/auth/callback` },
      });
      throwIfError(error);
    },

    async completeGoogleSignIn(code) {
      const { error } = await client.auth.exchangeCodeForSession(code);
      throwIfError(error);
    },

    async requestPasswordReset(email) {
      const { error } = await client.auth.resetPasswordForEmail(email.trim());
      throwIfError(error);
    },

    async updatePassword(password) {
      const { error } = await client.auth.updateUser({ password });
      throwIfError(error);
    },

    async signOut() {
      const { error } = await client.auth.signOut();
      // A session that already expired counts as signed out.
      if (error && error.status !== 401 && error.status !== 403) throw toAppError(error);
    },

    onSignedOut(listener) {
      const { data } = client.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') listener();
      });
      return () => {
        data.subscription.unsubscribe();
      };
    },
  };
}
