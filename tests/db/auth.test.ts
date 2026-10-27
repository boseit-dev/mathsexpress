import { describe, expect, it } from 'vitest';
import {
  anonClient,
  latestEmailTo,
  testPassword,
  tokenHashFromEmail,
  uniqueEmail,
} from './helpers.ts';

describe('registration and email verification', () => {
  it('requires the email address to be confirmed before signing in', async () => {
    const client = anonClient();
    const email = uniqueEmail('register');
    const password = testPassword();

    const { data: signUp, error: signUpError } = await client.auth.signUp({
      email,
      password,
      options: { data: { role: 'student', first_name: 'Ada', last_name: 'Lovelace' } },
    });
    expect(signUpError).toBeNull();
    expect(signUp.session).toBeNull();

    const { error: unconfirmed } = await client.auth.signInWithPassword({ email, password });
    expect(unconfirmed?.code).toBe('email_not_confirmed');

    const html = await latestEmailTo(email, 'Confirm your MathsExpress account');
    const { data: verified, error: verifyError } = await client.auth.verifyOtp({
      token_hash: tokenHashFromEmail(html),
      type: 'email',
    });
    expect(verifyError).toBeNull();
    expect(verified.session).not.toBeNull();
    expect(verified.user?.email_confirmed_at).toBeTruthy();
    expect(verified.user?.user_metadata).toMatchObject({ role: 'student', first_name: 'Ada' });

    const { error: signInError } = await anonClient().auth.signInWithPassword({ email, password });
    expect(signInError).toBeNull();
  });

  it('rejects a wrong password and an unknown account with the same error', async () => {
    const client = anonClient();
    const email = uniqueEmail('wrong-password');
    const password = testPassword();
    await client.auth.signUp({ email, password });
    const html = await latestEmailTo(email, 'Confirm your MathsExpress account');
    await client.auth.verifyOtp({ token_hash: tokenHashFromEmail(html), type: 'email' });

    const wrong = await anonClient().auth.signInWithPassword({ email, password: 'Wrong-pass-1' });
    const unknown = await anonClient().auth.signInWithPassword({
      email: uniqueEmail('nobody'),
      password,
    });
    expect(wrong.error?.code).toBe('invalid_credentials');
    expect(unknown.error?.code).toBe('invalid_credentials');
  });

  it('rejects passwords that do not meet the policy', async () => {
    const { error } = await anonClient().auth.signUp({
      email: uniqueEmail('weak'),
      password: 'short1',
    });
    expect(error?.code).toBe('weak_password');

    const { error: noDigits } = await anonClient().auth.signUp({
      email: uniqueEmail('weak'),
      password: 'onlyletters',
    });
    expect(noDigits?.code).toBe('weak_password');
  });

  it('does not reveal whether an email address already has an account', async () => {
    const client = anonClient();
    const email = uniqueEmail('existing');
    await client.auth.signUp({ email, password: testPassword() });
    // Supabase sends at most one email per address per second.
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const { data, error } = await anonClient().auth.signUp({ email, password: testPassword() });
    expect(error).toBeNull();
    expect(data.session).toBeNull();
  });
});

describe('password reset', () => {
  it('lets the owner of the email address choose a new password', async () => {
    const client = anonClient();
    const email = uniqueEmail('reset');
    const oldPassword = testPassword();
    const newPassword = testPassword();
    await client.auth.signUp({ email, password: oldPassword });
    const confirmation = await latestEmailTo(email, 'Confirm your MathsExpress account');
    await client.auth.verifyOtp({ token_hash: tokenHashFromEmail(confirmation), type: 'email' });

    const resetter = anonClient();
    const { error: requestError } = await resetter.auth.resetPasswordForEmail(email);
    expect(requestError).toBeNull();

    const recovery = await latestEmailTo(email, 'Reset your MathsExpress password');
    const { error: verifyError } = await resetter.auth.verifyOtp({
      token_hash: tokenHashFromEmail(recovery),
      type: 'recovery',
    });
    expect(verifyError).toBeNull();
    const { error: updateError } = await resetter.auth.updateUser({ password: newPassword });
    expect(updateError).toBeNull();

    const withOld = await anonClient().auth.signInWithPassword({ email, password: oldPassword });
    const withNew = await anonClient().auth.signInWithPassword({ email, password: newPassword });
    expect(withOld.error?.code).toBe('invalid_credentials');
    expect(withNew.error).toBeNull();
  });

  it('accepts a reset link only once', async () => {
    const client = anonClient();
    const email = uniqueEmail('reset-once');
    await client.auth.signUp({ email, password: testPassword() });
    const confirmation = await latestEmailTo(email, 'Confirm your MathsExpress account');
    await client.auth.verifyOtp({ token_hash: tokenHashFromEmail(confirmation), type: 'email' });

    await anonClient().auth.resetPasswordForEmail(email);
    const tokenHash = tokenHashFromEmail(
      await latestEmailTo(email, 'Reset your MathsExpress password'),
    );
    const first = await anonClient().auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' });
    const second = await anonClient().auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' });
    expect(first.error).toBeNull();
    expect(second.error).not.toBeNull();
  });
});

describe('sessions', () => {
  it('signs out and stops the session from being used', async () => {
    const client = anonClient();
    const email = uniqueEmail('session');
    const password = testPassword();
    await client.auth.signUp({ email, password });
    const confirmation = await latestEmailTo(email, 'Confirm your MathsExpress account');
    await client.auth.verifyOtp({ token_hash: tokenHashFromEmail(confirmation), type: 'email' });

    const signedIn = anonClient();
    await signedIn.auth.signInWithPassword({ email, password });
    const { data: before } = await signedIn.auth.getUser();
    expect(before.user?.email).toBe(email);

    const { data: session } = await signedIn.auth.getSession();
    const accessToken = session.session?.access_token;
    await signedIn.auth.signOut();

    const { error } = await anonClient().auth.refreshSession({
      refresh_token: session.session?.refresh_token ?? '',
    });
    expect(accessToken).toBeTruthy();
    expect(error).not.toBeNull();
  });
});
