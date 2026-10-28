import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { findAccessibilityProblems } from '@/test/axe';
import { createFakeState, TEST_PASSWORD, testStudent } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

type User = ReturnType<typeof userEvent.setup>;

async function fillSignIn(user: User, email: string, password: string) {
  await user.type(await screen.findByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
}

describe('signing in', () => {
  it('signs a student in and opens their home page', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/sign-in', { signedInAs: null });
    await fillSignIn(user, testStudent.email, TEST_PASSWORD);
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
    expect(await screen.findByRole('heading', { level: 1, name: /Mia/ })).toBeVisible();
  });

  it('returns people to the page they were trying to open', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/student/class', { signedInAs: null });
    await screen.findByRole('heading', { level: 1, name: 'Sign in' });
    await fillSignIn(user, testStudent.email, TEST_PASSWORD);
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student/class');
    });
  });

  it('never redirects to another website after signing in', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/sign-in?redirectTo=%2F%2Fevil.example', { signedInAs: null });
    await fillSignIn(user, testStudent.email, TEST_PASSWORD);
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
  });

  it('explains a wrong password without revealing whether the account exists', async () => {
    const user = userEvent.setup();
    renderApp('/sign-in', { signedInAs: null });
    await fillSignIn(user, testStudent.email, 'wrong-password-1');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'That email and password don’t match an account.',
    );
  });

  it('checks the fields before sending them', async () => {
    const user = userEvent.setup();
    renderApp('/sign-in', { signedInAs: null });
    await user.click(await screen.findByRole('button', { name: 'Sign in' }));
    expect(await screen.findByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a valid email address.')).toBeVisible();
  });

  it('offers to resend the confirmation email to unconfirmed accounts', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const account = state.accounts.get(testStudent.email);
    if (account) account.confirmed = false;
    renderApp('/sign-in', { signedInAs: null, state });

    await fillSignIn(user, testStudent.email, TEST_PASSWORD);
    expect(await screen.findByRole('alert')).toHaveTextContent('Confirm your email address first.');

    await user.click(screen.getByRole('button', { name: 'Send the confirmation email again' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      `We sent the confirmation email to ${testStudent.email} again.`,
    );
    expect(state.sentEmails).toEqual([{ to: testStudent.email, type: 'email' }]);
  });

  it('explains that Google sign-in is not set up yet', async () => {
    const user = userEvent.setup();
    renderApp('/sign-in', { signedInAs: null });
    await user.click(await screen.findByRole('button', { name: 'Continue with Google' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Google sign-in isn’t set up yet. Use your email and password instead.',
    );
  });

  it('starts Google sign-in when it is available', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    state.googleAvailable = true;
    const { dependencies } = renderApp('/sign-in', { signedInAs: null, state });
    const startGoogle = vi.spyOn(dependencies.auth, 'startGoogleSignIn');
    await user.click(await screen.findByRole('button', { name: 'Continue with Google' }));
    await waitFor(() => {
      expect(startGoogle).toHaveBeenCalledOnce();
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('has no detectable accessibility problems', async () => {
    renderApp('/sign-in', { signedInAs: null });
    await screen.findByRole('heading', { level: 1, name: 'Sign in' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});

describe('registering', () => {
  async function fillRegistration(user: User, role: 'Student' | 'Teacher', email: string) {
    await user.click(await screen.findByRole('radio', { name: new RegExp(role) }));
    await user.type(screen.getByLabelText('First name'), 'Ada');
    await user.type(screen.getByLabelText('Last name'), 'Lovelace');
    await user.type(screen.getByLabelText('Email'), email);
    await user.type(screen.getByLabelText('Password'), 'numbers123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
  }

  it('creates an account, asks for email confirmation, and sets up the profile from the link', async () => {
    const user = userEvent.setup();
    const { state, router } = renderApp('/register', { signedInAs: null });

    await fillRegistration(user, 'Teacher', 'ada@example.test');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Check your email' }),
    ).toBeVisible();
    expect(screen.getByText('ada@example.test')).toBeVisible();
    expect(state.sentEmails).toEqual([{ to: 'ada@example.test', type: 'email' }]);

    await router.navigate('/auth/confirm?token_hash=email-token-1&type=email');

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/teacher');
    });
    expect(state.accounts.get('ada@example.test')?.profile).toMatchObject({
      role: 'teacher',
      firstName: 'Ada',
      lastName: 'Lovelace',
    });
  });

  it('requires a role and a strong enough password', async () => {
    const user = userEvent.setup();
    renderApp('/register', { signedInAs: null });

    await user.click(await screen.findByRole('button', { name: 'Create account' }));
    expect(await screen.findByText('Choose whether you are a student or a teacher.')).toBeVisible();

    await user.click(screen.getByRole('radio', { name: /Student/ }));
    await user.type(screen.getByLabelText('First name'), 'Ada');
    await user.type(screen.getByLabelText('Last name'), 'Lovelace');
    await user.type(screen.getByLabelText('Email'), 'ada@example.test');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(
      await screen.findByText('Use at least 8 characters, including letters and numbers.'),
    ).toBeVisible();
  });

  it('can send the confirmation email again', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/register', { signedInAs: null });
    await fillRegistration(user, 'Student', 'grace@example.test');
    await user.click(await screen.findByRole('button', { name: 'Send the email again' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'We sent the confirmation email again.',
    );
    expect(state.sentEmails).toHaveLength(2);
  });

  it('explains links that have expired or were already used', async () => {
    renderApp('/auth/confirm?token_hash=not-a-real-token&type=email', { signedInAs: null });
    expect(
      await screen.findByRole('heading', { level: 1, name: 'That didn’t work' }),
    ).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'This link has expired or has already been used.',
    );
  });

  it('explains a Google sign-in that did not finish', async () => {
    renderApp('/auth/callback?error=access_denied', { signedInAs: null });
    expect(await screen.findByRole('alert')).toHaveTextContent('Google sign-in didn’t finish.');
  });

  it('has no detectable accessibility problems', async () => {
    renderApp('/register', { signedInAs: null });
    await screen.findByRole('heading', { level: 1, name: 'Create your account' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});

describe('resetting a password', () => {
  it('gives the same answer whether or not the email has an account', async () => {
    const user = userEvent.setup();
    const { state } = renderApp('/forgot-password', { signedInAs: null });
    await user.type(await screen.findByLabelText('Email'), 'nobody@example.test');
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'If an account uses nobody@example.test, we’ve sent it a password reset link.',
    );
    expect(state.sentEmails).toEqual([]);
  });

  it('lets the account owner choose a new password from the email link', async () => {
    const user = userEvent.setup();
    const { state, router } = renderApp('/forgot-password', { signedInAs: null });
    await user.type(await screen.findByLabelText('Email'), testStudent.email);
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));
    await screen.findByRole('status');
    expect(state.sentEmails).toEqual([{ to: testStudent.email, type: 'recovery' }]);

    await router.navigate('/auth/confirm?token_hash=recovery-token-1&type=recovery');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Choose a new password' }),
    ).toBeVisible();

    await user.type(screen.getByLabelText('New password'), 'new-pass-2026');
    await user.type(screen.getByLabelText('Confirm new password'), 'different-2026');
    await user.click(screen.getByRole('button', { name: 'Save new password' }));
    expect(await screen.findByText('The two passwords don’t match.')).toBeVisible();

    await user.clear(screen.getByLabelText('Confirm new password'));
    await user.type(screen.getByLabelText('Confirm new password'), 'new-pass-2026');
    await user.click(screen.getByRole('button', { name: 'Save new password' }));
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Password changed' }),
    ).toBeVisible();
    expect(state.accounts.get(testStudent.email)?.password).toBe('new-pass-2026');
  });

  it('asks for a new link when the reset page is opened without one', async () => {
    renderApp('/reset-password', { signedInAs: null });
    expect(await screen.findByRole('alert')).toHaveTextContent('This link has expired');
    expect(screen.getByRole('link', { name: 'Request a new link' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
  });
});

describe('finishing account setup', () => {
  it('lets a new account choose its role and name, then opens the right home page', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const account = state.accounts.get(testStudent.email);
    if (account) account.profile = null;
    const { router } = renderApp('/welcome', { state });

    await user.click(await screen.findByRole('radio', { name: /Student/ }));
    await user.type(screen.getByLabelText('First name'), 'Mia');
    await user.type(screen.getByLabelText('Last name'), 'Chen');
    await user.click(screen.getByRole('button', { name: 'Finish setting up' }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
    expect(account?.profile).toMatchObject({ role: 'student', firstName: 'Mia' });
  });

  it('is skipped by accounts that are already set up', async () => {
    const { router } = renderApp('/welcome', { signedInAs: 'teacher' });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/teacher');
    });
  });
});
