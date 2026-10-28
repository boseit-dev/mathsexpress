// Loaders and actions for the account pages. They validate input, call the auth service and
// decide where to go next; the pages only display the result.
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { formError, readText, runForm, type FormResult } from '@/app/forms/formResult';
import { homePathFor, redirectIfSignedIn, safeRedirectPath } from '@/app/auth/guards';
import { forgetResetLink, openedResetLink, rememberResetLink } from '@/app/auth/resetLink';
import { paths } from '@/config/paths';
import { isAccountRole, type AuthUser } from '@/domain/account';
import { AppError, errorCodeOf, type AppErrorCode } from '@/domain/errors';
import { validateEmail, validateName, validatePassword } from '@/domain/validation';
import type { AppDependencies, AuthService, EmailLinkType } from '@/data/repositories';

export interface SignedOutPageData {
  /** Whether Google sign-in is configured, so the button can say so before anyone presses it. */
  googleAvailable: boolean;
}

/** For pages only signed-out visitors need (sign in, register). */
export function createSignedOutPageLoader(deps: AppDependencies) {
  return async (): Promise<SignedOutPageData> => {
    const [, googleAvailable] = await Promise.all([
      redirectIfSignedIn(deps),
      // If the auth server can't be asked, show Google as unavailable rather than failing the page.
      deps.auth.isGoogleSignInAvailable().catch(() => false),
    ]);
    return { googleAvailable };
  };
}

/** Starts Google sign-in, or explains why it can't. Google returns the user to /auth/callback. */
async function startGoogle({ auth }: AppDependencies): Promise<FormResult> {
  if (!(await auth.isGoogleSignInAvailable())) return formError('google_unavailable');
  await auth.startGoogleSignIn();
  return { ok: true };
}

export function createSignInAction(deps: AppDependencies) {
  return ({ request }: ActionFunctionArgs) =>
    runForm(async () => {
      const form = await request.formData();
      const intent = readText(form, 'intent');
      if (intent === 'google') return startGoogle(deps);

      const email = readText(form, 'email').trim();
      const emailProblem = validateEmail(email);
      if (emailProblem) return formError(emailProblem, 'email');

      if (intent === 'resend') {
        await deps.auth.resendConfirmation(email);
        return { ok: true, message: `We sent the confirmation email to ${email} again.` };
      }
      if (intent === 'send-link') {
        // For accounts not set up yet, which sign in through an email link instead.
        await deps.auth.requestPasswordReset(email);
        return { ok: true, message: `We sent a link to ${email}. Open it to finish setting up.` };
      }

      const password = readText(form, 'password');
      if (password === '') return formError('password_required', 'password');
      await deps.auth.signIn(email, password);
      const returnTo = safeRedirectPath(new URL(request.url).searchParams.get('redirectTo'));
      throw redirect(returnTo ?? paths.root);
    });
}

export function createRegisterAction(deps: AppDependencies) {
  return ({ request }: ActionFunctionArgs) =>
    runForm(async () => {
      const form = await request.formData();
      const intent = readText(form, 'intent');
      if (intent === 'google') return startGoogle(deps);

      const email = readText(form, 'email').trim();
      if (intent === 'resend') {
        try {
          await deps.auth.resendConfirmation(email);
        } catch (error) {
          // Keep the "Check your email" screen (it needs the address) and show the problem there.
          if (error instanceof AppError) return { ok: false, error: error.code, email };
          throw error;
        }
        return { ok: true, email, message: 'We sent the confirmation email again.' };
      }

      const role = readText(form, 'role');
      const firstName = readText(form, 'firstName');
      const lastName = readText(form, 'lastName');
      const password = readText(form, 'password');
      if (!isAccountRole(role)) return formError('invalid_role', 'role');
      if (validateName(firstName)) return formError('invalid_name', 'firstName');
      if (validateName(lastName)) return formError('invalid_name', 'lastName');
      const emailProblem = validateEmail(email);
      if (emailProblem) return formError(emailProblem, 'email');
      const passwordProblem = validatePassword(password);
      if (passwordProblem) return formError(passwordProblem, 'password');

      await deps.auth.register({ email, password, role, firstName, lastName });
      return { ok: true, email };
    });
}

export function createForgotPasswordAction({ auth }: AppDependencies) {
  return ({ request }: ActionFunctionArgs) =>
    runForm(async () => {
      const form = await request.formData();
      const email = readText(form, 'email').trim();
      const emailProblem = validateEmail(email);
      if (emailProblem) return formError(emailProblem, 'email');
      // The same answer whether or not the address has an account, so this page cannot be used
      // to find out who is registered. The auth server limits how often it emails an address,
      // which only happens for real accounts, so that limit gets the same answer too.
      try {
        await auth.requestPasswordReset(email);
      } catch (error) {
        if (errorCodeOf(error) !== 'rate_limited') throw error;
      }
      return { ok: true, email };
    });
}

/**
 * How long after opening an email link its page (choosing a new password, or setting up the
 * account) is offered. Long enough to finish, short enough that a signed-in computer someone
 * walked away from can't be used for it later.
 */
const EMAIL_LINK_WINDOW_SECONDS = 30 * 60;

/** True when the session was opened from an email link (or Google) in the last 30 minutes. */
async function openedEmailLinkRecently(auth: AuthService): Promise<boolean> {
  const age = await auth.emailSignInAge();
  return age !== null && age < EMAIL_LINK_WINDOW_SECONDS;
}

/** True when this tab opened a password-reset link for this account in the last 30 minutes. */
async function cameFromResetLink(deps: AppDependencies): Promise<boolean> {
  const user = await deps.auth.getCurrentUser();
  return user !== null && openedResetLink(user.id) && (await openedEmailLinkRecently(deps.auth));
}

export interface ResetPasswordData {
  signedIn: boolean;
  /**
   * The form is offered only just after a reset link, not to anyone who finds a signed-in
   * computer. The auth server separately requires sessions over a day old to sign in again.
   */
  fromResetLink: boolean;
}

export function createResetPasswordLoader(deps: AppDependencies) {
  return async (): Promise<ResetPasswordData> => {
    const signedIn = (await deps.auth.getCurrentUser()) !== null;
    return { signedIn, fromResetLink: signedIn && (await cameFromResetLink(deps)) };
  };
}

export function createResetPasswordAction(deps: AppDependencies) {
  const { auth } = deps;
  return ({ request }: ActionFunctionArgs) =>
    runForm(async () => {
      const form = await request.formData();
      const password = readText(form, 'password');
      const confirmation = readText(form, 'confirmPassword');
      const passwordProblem = validatePassword(password);
      if (passwordProblem) return formError(passwordProblem, 'password');
      if (password !== confirmation) return formError('passwords_do_not_match', 'confirmPassword');
      if (!(await cameFromResetLink(deps))) return formError('reset_link_required');
      await auth.updatePassword(password);
      // Ends the reset session, so nobody else at this computer can use it to change the
      // password again; the owner signs in with the new one.
      forgetResetLink();
      await auth.signOut();
      throw redirect(`${paths.signIn}?notice=password-changed`);
    });
}

export interface AuthLinkResult {
  error: AppErrorCode;
}

/** /auth/confirm: the link in a confirmation or password-reset email. */
export function createConfirmEmailLoader(deps: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<AuthLinkResult> => {
    const url = new URL(request.url);
    const tokenHash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type');
    if (!tokenHash || (type !== 'email' && type !== 'recovery')) return { error: 'link_invalid' };

    try {
      await deps.auth.confirmEmailLink(tokenHash, type satisfies EmailLinkType);
    } catch (error) {
      if (error instanceof AppError) return { error: error.code };
      throw error;
    }
    // The link proves the email address is the person's own, so an account not set up yet goes
    // to /welcome, where they choose its role, name and password themselves.
    if (!(await deps.accounts.getMyProfile())) throw redirect(paths.welcome);
    if (type !== 'recovery') throw redirect(paths.root);
    const user = await deps.auth.getCurrentUser();
    if (user) rememberResetLink(user.id);
    throw redirect(paths.resetPassword);
  };
}

/** /auth/callback: where Google sends people back. */
export function createGoogleCallbackLoader(deps: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<AuthLinkResult> => {
    const code = new URL(request.url).searchParams.get('code');
    if (!code) return { error: 'google_sign_in_failed' };
    try {
      await deps.auth.completeGoogleSignIn(code);
    } catch (error) {
      if (error instanceof AppError) return { error: 'google_sign_in_failed' };
      throw error;
    }
    throw redirect(paths.root);
  };
}

export interface WelcomeData {
  email: string;
  registration: AuthUser['registration'];
  /**
   * Whether this session came from an email link (or Google) in the last 30 minutes. Only such a
   * session may set up the account (the database checks the link too); others are offered a link.
   */
  fromEmailLink: boolean;
}

/**
 * /welcome: setting up a confirmed account. Registration details are only a starting point:
 * registering an address twice before confirming keeps the first details and password, so the
 * person who opened the email link chooses the role, name and password here.
 */
export function createWelcomeLoader({ auth, accounts }: AppDependencies) {
  return async (): Promise<WelcomeData> => {
    const user = await auth.getCurrentUser();
    if (!user) throw redirect(paths.signIn);
    const profile = await accounts.getMyProfile();
    if (profile) throw redirect(homePathFor(profile.role));
    const fromEmailLink = await openedEmailLinkRecently(auth);
    return { email: user.email, registration: user.registration, fromEmailLink };
  };
}

export function createWelcomeAction({ auth, accounts }: AppDependencies) {
  return ({ request }: ActionFunctionArgs) =>
    runForm(async (): Promise<FormResult> => {
      const form = await request.formData();
      const user = await auth.getCurrentUser();
      if (!user) throw redirect(paths.signIn);

      if (readText(form, 'intent') === 'send-link') {
        // A reset link proves the address is theirs; opening it brings them back here. Unlike
        // "Forgot password", a refusal (e.g. too many emails) is reported: the address is theirs.
        await auth.requestPasswordReset(user.email);
        return { ok: true, message: `We sent a link to ${user.email}. Open it to continue.` };
      }

      const role = readText(form, 'role');
      const firstName = readText(form, 'firstName');
      const lastName = readText(form, 'lastName');
      const password = readText(form, 'password');
      if (!isAccountRole(role)) return formError('invalid_role', 'role');
      if (validateName(firstName)) return formError('invalid_name', 'firstName');
      if (validateName(lastName)) return formError('invalid_name', 'lastName');
      const passwordProblem = validatePassword(password);
      if (passwordProblem) return formError(passwordProblem, 'password');
      if (!(await openedEmailLinkRecently(auth))) return formError('email_link_required');

      // Makes the password the one this person knows. (Someone who registered the address first
      // can't sign in with theirs before the account is set up; see custom_access_token_hook.)
      try {
        await auth.updatePassword(password);
      } catch (error) {
        if (errorCodeOf(error) !== 'same_password') throw error;
      }
      try {
        await accounts.completeProfile({ role, firstName, lastName });
      } catch (error) {
        if (errorCodeOf(error) === 'profile_exists') throw redirect(paths.root);
        throw error;
      }
      throw redirect(homePathFor(role));
    });
}

export function createSignOutAction({ auth }: AppDependencies) {
  return async () => {
    await auth.signOut();
    throw redirect(paths.signIn);
  };
}
