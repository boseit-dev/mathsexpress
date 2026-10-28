import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MathsExpressClient } from './client';
import { createSupabaseAuthService } from './supabaseAuthService';

const config = { url: 'http://127.0.0.1:55321', publishableKey: 'test-publishable-key' };

/** Just the parts of the Supabase client these tests use. */
function fakeClient(auth: Record<string, unknown>): MathsExpressClient {
  return { auth } as unknown as MathsExpressClient;
}

function service(client: MathsExpressClient) {
  return createSupabaseAuthService(client, config, { appOrigin: 'http://localhost:5173' });
}

afterEach(() => {
  localStorage.clear();
});

describe('signing out', () => {
  it('removes the stored session even when the server can’t be reached', async () => {
    localStorage.setItem('mathsexpress-auth', '{"access_token":"t"}');
    localStorage.setItem('mathsexpress-auth-user', '{}');
    localStorage.setItem('unrelated', 'kept');
    const client = fakeClient({
      signOut: vi.fn().mockResolvedValue({ error: new TypeError('Failed to fetch') }),
    });

    await expect(service(client).signOut()).resolves.toBeUndefined();
    expect(Object.keys(localStorage)).toEqual(['unrelated']);
  });

  it('reports sessions that end elsewhere, but not its own sign-out', async () => {
    let emit: (event: string) => void = () => undefined;
    const client = fakeClient({
      onAuthStateChange: (callback: (event: string) => void) => {
        emit = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
      signOut: vi.fn().mockImplementation(() => {
        emit('SIGNED_OUT');
        return Promise.resolve({ error: null });
      }),
    });
    const auth = service(client);
    const listener = vi.fn();
    auth.onSignedOut(listener);

    await auth.signOut();
    expect(listener).not.toHaveBeenCalled();

    emit('SIGNED_OUT');
    expect(listener).toHaveBeenCalledOnce();
  });
});

describe('emailSignInAge', () => {
  it('asks the database, which reads the signed session token with its own clock', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: 42, error: null });
    const auth = service({ rpc } as unknown as MathsExpressClient);
    await expect(auth.emailSignInAge()).resolves.toBe(42);
    expect(rpc).toHaveBeenCalledWith('email_sign_in_age');
  });

  it('is null for a session that signed in with a password', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: null });
    await expect(
      service({ rpc } as unknown as MathsExpressClient).emailSignInAge(),
    ).resolves.toBeNull();
  });

  it('reports failures instead of guessing', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: new TypeError('Failed to fetch') });
    await expect(
      service({ rpc } as unknown as MathsExpressClient).emailSignInAge(),
    ).rejects.toMatchObject({ code: 'network' });
  });
});
