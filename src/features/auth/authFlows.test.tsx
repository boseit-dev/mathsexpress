import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { findAccessibilityProblems } from '@/test/axe';
import { AppError } from '@/domain/errors';
import { createFakeState, TEST_PASSWORD, testStudent, testTeacher } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

type User = ReturnType<typeof userEvent.setup>;

/** Waits for a status message containing `text`, which may be split by formatting. */
async function findStatus(text: string) {
  return waitFor(() => {
    const status = screen
      .getAllByRole('status')
      .find((region) => region.textContent.includes(text));
    if (!status) throw new Error(`No status message says "${text}"`);
    return status;
  });
}

/** Every message region on the page is empty: nothing went wrong. */
function expectNoProblems() {
  for (const alert of screen.queryAllByRole('alert')) expect(alert).toBeEmptyDOMElement();
}

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
    expect(
      await screen.findByText('That email and password don’t match an account.', { exact: false }),
    ).toBeVisible();
  });

  it('checks the fields before sending them, and moves focus to the one to fix', async () => {
    const user = userEvent.setup();
    renderApp('/sign-in', { signedInAs: null });
    await user.click(await screen.findByRole('button', { name: 'Sign in' }));
    const email = await screen.findByLabelText('Email');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Enter a valid email address.');
    await waitFor(() => {
      expect(email).toHaveFocus();
    });
  });

  it('never redirects to another website through dot segments', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/sign-in?redirectTo=%2F.%2F%2Fevil.example', {
      signedInAs: null,
    });
    await fillSignIn(user, testStudent.email, TEST_PASSWORD);
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
  });

  it('never redirects to another website, even through characters browsers ignore', async () => {
    const user = userEvent.setup();
    const { router } = renderApp('/sign-in?redirectTo=%2F%09%2Fevil.example', {
      signedInAs: null,
    });
    await fillSignIn(user, testStudent.email, TEST_PASSWORD);
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
  });

  it('offers to resend the confirmation email to unconfirmed accounts', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const account = state.accounts.get(testStudent.email);
    if (account) account.confirmed = false;
    renderApp('/sign-in', { signedInAs: null, state });

    await fillSignIn(user, testStudent.email, TEST_PASSWORD);
    expect(
      await screen.findByText('Confirm your email address first.', { exact: false }),
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Send the confirmation email again' }));
    expect(
      await screen.findByText(`We sent the confirmation email to ${testStudent.email} again.`),
    ).toBeVisible();
    expect(state.sentEmails).toEqual([{ to: testStudent.email, type: 'email' }]);
  });

  it('shows that Google sign-in isn’t available before anyone presses it', async () => {
    renderApp('/sign-in', { signedInAs: null });
    const google = await screen.findByRole('button', { name: 'Continue with Google' });
    expect(google).toBeDisabled();
    expect(google).toHaveAccessibleDescription(
      'Google sign-in isn’t available yet. Use your email address and a password.',
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
    expectNoProblems();
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

  /** Fills in the welcome page: the role is never chosen in advance. */
  async function finishSetup(user: User, role: 'Student' | 'Teacher', password: string) {
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Welcome to MathsExpress' }),
    ).toBeVisible();
    for (const radio of screen.getAllByRole('radio')) expect(radio).not.toBeChecked();
    await user.click(screen.getByRole('radio', { name: new RegExp(role) }));
    await user.type(screen.getByLabelText('Password'), password);
    await user.click(screen.getByRole('button', { name: 'Finish setting up' }));
  }

  it('creates an account, then sets it up from the email link', async () => {
    const user = userEvent.setup();
    const { state, router } = renderApp('/register', { signedInAs: null });

    await fillRegistration(user, 'Teacher', 'ada@example.test');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Check your email' }),
    ).toBeVisible();
    expect(screen.getByText('ada@example.test')).toBeVisible();
    expect(state.sentEmails).toEqual([{ to: 'ada@example.test', type: 'email' }]);
    // Nothing is set up until the email link is opened.
    expect(state.accounts.get('ada@example.test')?.profile).toBeNull();

    await router.navigate('/auth/confirm?token_hash=email-token-1&type=email');
    expect(await screen.findByLabelText('First name')).toHaveValue('Ada');
    await finishSetup(user, 'Teacher', 'numbers123');

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/teacher');
    });
    expect(state.accounts.get('ada@example.test')).toMatchObject({
      password: 'numbers123',
      profile: { role: 'teacher', firstName: 'Ada', lastName: 'Lovelace' },
    });
  });

  it('never lets someone who registered the address first take the account over', async () => {
    const user = userEvent.setup();
    const { state, router } = renderApp('/register', { signedInAs: null });
    // Someone registers the owner's address first, as a student, with their own password.
    await fillRegistration(user, 'Student', 'grace@example.test');
    // The owner registers it as a teacher, with a different password; the server keeps the
    // first password and details, but sends the owner a new link.
    await router.navigate('/register');
    await user.click(await screen.findByRole('radio', { name: /Teacher/ }));
    await user.type(screen.getByLabelText('First name'), 'Grace');
    await user.type(screen.getByLabelText('Last name'), 'Hopper');
    await user.type(screen.getByLabelText('Email'), 'grace@example.test');
    await user.type(screen.getByLabelText('Password'), 'owners-pass-1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    await screen.findByRole('heading', { level: 1, name: 'Check your email' });

    // The owner opens their link and chooses the role and password themselves.
    await router.navigate('/auth/confirm?token_hash=email-token-2&type=email');
    await finishSetup(user, 'Teacher', 'owners-pass-1');
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/teacher');
    });
    const account = state.accounts.get('grace@example.test');
    expect(account?.profile?.role).toBe('teacher');
    // The first registrant's password no longer works.
    expect(account?.password).toBe('owners-pass-1');
  });

  it('asks for a new link when the session didn’t come from one in the last 30 minutes', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const account = state.accounts.get(testStudent.email);
    if (account) account.profile = null;
    // Opened from a link 31 minutes ago, e.g. on a computer someone walked away from.
    state.emailSignInAt = Date.now() - 31 * 60 * 1000;
    const { router } = renderApp('/welcome', { state });

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Confirm it’s you' }),
    ).toBeVisible();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Email me a link' }));
    expect(await findStatus(`We sent a link to ${testStudent.email}.`)).toBeVisible();

    // The link brings them back to finish setting up.
    await router.navigate('/auth/confirm?token_hash=recovery-token-1&type=recovery');
    await user.type(await screen.findByLabelText('First name'), 'Mia');
    await user.type(screen.getByLabelText('Last name'), 'Chen');
    await finishSetup(user, 'Student', TEST_PASSWORD);
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
    expect(account?.profile?.role).toBe('student');
  });

  it('keeps the “Check your email” screen when sending the email again fails', async () => {
    const user = userEvent.setup();
    const { dependencies } = renderApp('/register', { signedInAs: null });
    await fillRegistration(user, 'Student', 'grace@example.test');
    await screen.findByRole('heading', { level: 1, name: 'Check your email' });
    vi.spyOn(dependencies.auth, 'resendConfirmation').mockRejectedValue(
      new AppError('rate_limited'),
    );

    await user.click(screen.getByRole('button', { name: 'Send the email again' }));
    expect(
      await screen.findByText('Too many attempts. Wait a minute, then try again.'),
    ).toBeVisible();
    expect(screen.getByRole('heading', { level: 1, name: 'Check your email' })).toBeVisible();
    expect(screen.getByText('grace@example.test')).toBeVisible();
  });

  it('explains passwords that are too long for the server', async () => {
    const user = userEvent.setup();
    renderApp('/register', { signedInAs: null });
    await user.click(await screen.findByRole('radio', { name: /Student/ }));
    await user.type(screen.getByLabelText('First name'), 'Ada');
    await user.type(screen.getByLabelText('Last name'), 'Lovelace');
    await user.type(screen.getByLabelText('Email'), 'ada@example.test');
    await user.type(screen.getByLabelText('Password'), `a1${'x'.repeat(80)}`);
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText(/That password is too long/)).toBeVisible();
    await waitFor(() => {
      expect(screen.getByLabelText('Password')).toHaveFocus();
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
    expect(await screen.findByText('We sent the confirmation email again.')).toBeVisible();
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

  it('refuses a password sign-in until the account is set up, and offers a link', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const account = state.accounts.get(testStudent.email);
    if (account) account.profile = null;
    renderApp('/sign-in', { signedInAs: null, state });

    await fillSignIn(user, testStudent.email, TEST_PASSWORD);
    expect(
      await screen.findByText(/To finish setting up, open the link we email you/),
    ).toBeVisible();
    expect(state.signedInEmail).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Email me a link' }));
    expect(
      await findStatus(`We sent a link to ${testStudent.email}. Open it to finish setting up.`),
    ).toBeVisible();
    expect(state.sentEmails).toEqual([{ to: testStudent.email, type: 'recovery' }]);
  });

  it('says so when the link can’t be sent just now', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const account = state.accounts.get(testStudent.email);
    if (account) account.profile = null;
    const { dependencies } = renderApp('/welcome', { state });
    vi.spyOn(dependencies.auth, 'requestPasswordReset').mockRejectedValue(
      new AppError('rate_limited'),
    );
    await user.click(await screen.findByRole('button', { name: 'Email me a link' }));
    expect(
      await screen.findByText('Too many attempts. Wait a minute, then try again.'),
    ).toBeVisible();
  });

  it('asks for a new link when the server won’t change the password from this session', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const account = state.accounts.get(testStudent.email);
    if (account) account.profile = null;
    state.emailSignInAt = Date.now();
    const { dependencies } = renderApp('/welcome', { state });
    vi.spyOn(dependencies.auth, 'updatePassword').mockRejectedValue(new AppError('link_invalid'));

    await user.click(await screen.findByRole('radio', { name: /Student/ }));
    await user.type(screen.getByLabelText('First name'), 'Mia');
    await user.type(screen.getByLabelText('Last name'), 'Chen');
    await user.type(screen.getByLabelText('Password'), 'numbers123');
    await user.click(screen.getByRole('button', { name: 'Finish setting up' }));
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Confirm it’s you' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Email me a link' })).toBeVisible();
    expect(account?.profile).toBeNull();
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
    expect(await findStatus('If an account uses nobody@example.test, we’ve sent it')).toBeVisible();
    expect(state.sentEmails).toEqual([]);
  });

  it('gives the same answer when the server limits emails to a real account', async () => {
    const user = userEvent.setup();
    const { state, router } = renderApp('/forgot-password', { signedInAs: null });
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await router.navigate('/forgot-password');
      await user.type(await screen.findByLabelText('Email'), testStudent.email);
      await user.click(screen.getByRole('button', { name: 'Send reset link' }));
      expect(await findStatus(`If an account uses ${testStudent.email}`)).toBeVisible();
      expectNoProblems();
    }
    // The second request was refused by the (fake) server's limit, but looked the same.
    expect(state.sentEmails).toHaveLength(1);
  });

  it('lets the account owner choose a new password from the email link', async () => {
    const user = userEvent.setup();
    const { state, router } = renderApp('/forgot-password', { signedInAs: null });
    await user.type(await screen.findByLabelText('Email'), testStudent.email);
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));
    await findStatus('we’ve sent it a password reset link');
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

    // The reset session ends, so nobody else at this computer can use it again.
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/sign-in');
    });
    expect(state.signedInEmail).toBeNull();
    expect(
      await screen.findByText('Your password has been changed. Sign in with your new password.'),
    ).toBeVisible();
    expect(state.accounts.get(testStudent.email)?.password).toBe('new-pass-2026');
  });

  it('asks for a new link when the reset page is opened without one', async () => {
    renderApp('/reset-password', { signedInAs: null });
    expect(await screen.findByText(/This link has expired/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Request a new link' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
  });

  it('offers a new password only after a reset link, not after other email links or Google', async () => {
    const state = createFakeState();
    // Signed in from a confirmation link (or Google) a minute ago: not a reset link.
    state.emailSignInAt = Date.now() - 60 * 1000;
    renderApp('/reset-password', { signedInAs: 'student', state });
    expect(
      await screen.findByText(
        'To choose a new password, open the link in a password reset email. We can send you one.',
      ),
    ).toBeVisible();
    expect(screen.queryByLabelText('New password')).not.toBeInTheDocument();
  });

  it('won’t let a signed-in session change the password without a reset link', async () => {
    const { state } = renderApp('/reset-password', { signedInAs: 'student' });
    expect(
      await screen.findByText(
        'To choose a new password, open the link in a password reset email. We can send you one.',
      ),
    ).toBeVisible();
    expect(screen.queryByLabelText('New password')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Send me a reset link' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
    expect(state.accounts.get(testStudent.email)?.password).toBe(TEST_PASSWORD);
  });
});

describe('signing out', () => {
  it('signs out from the account menu and returns to sign in', async () => {
    const user = userEvent.setup();
    const { state, router } = renderApp('/teacher', { signedInAs: 'teacher' });
    await user.click(
      await screen.findByRole('button', {
        name: `Account: ${testTeacher.firstName} ${testTeacher.lastName}`,
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/sign-in');
    });
    expect(state.signedInEmail).toBeNull();
  });

  it('treats opening the sign-out address directly as going to the start page', async () => {
    const { router } = renderApp('/sign-out', { signedInAs: null });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/sign-in');
    });
    expect(
      within(screen.getByRole('main')).getByRole('heading', { level: 1, name: 'Sign in' }),
    ).toBeVisible();
  });
});

describe('finishing account setup', () => {
  it('lets a new account choose its role, name and password, then opens the right home page', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const account = state.accounts.get(testStudent.email);
    if (account) account.profile = null;
    state.emailSignInAt = Date.now();
    const { router } = renderApp('/welcome', { state });

    await user.click(await screen.findByRole('button', { name: 'Finish setting up' }));
    expect(await screen.findByText('Choose whether you are a student or a teacher.')).toBeVisible();

    await user.click(screen.getByRole('radio', { name: /Student/ }));
    await user.type(screen.getByLabelText('First name'), 'Mia');
    await user.type(screen.getByLabelText('Last name'), 'Chen');
    await user.click(screen.getByRole('button', { name: 'Finish setting up' }));
    const password = await screen.findByLabelText('Password');
    await waitFor(() => {
      expect(password).toHaveFocus();
    });

    // Their existing password is accepted as it is.
    await user.type(password, TEST_PASSWORD);
    await user.click(screen.getByRole('button', { name: 'Finish setting up' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
    expect(account?.profile).toMatchObject({ role: 'student', firstName: 'Mia' });
  });

  it('has no detectable accessibility problems', async () => {
    const state = createFakeState();
    const account = state.accounts.get(testStudent.email);
    if (account) account.profile = null;
    state.emailSignInAt = Date.now();
    renderApp('/welcome', { state });
    await screen.findByRole('heading', { level: 1, name: 'Welcome to MathsExpress' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });

  it('is skipped by accounts that are already set up', async () => {
    const { router } = renderApp('/welcome', { signedInAs: 'teacher' });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/teacher');
    });
  });
});
