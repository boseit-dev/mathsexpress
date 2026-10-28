// Loaders and actions for the account pages. They validate input, call the auth service and
// decide where to go next; the pages only display the result.
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { formError, readText, runForm, type FormResult } from '@/app/auth/formResult';
import { homePathFor, safeRedirectPath } from '@/app/auth/guards';
import { paths } from '@/config/paths';
import { isAccountRole, type AuthUser, type RegistrationDetails } from '@/domain/account';
import { AppError, errorCodeOf, type AppErrorCode } from '@/domain/errors';
import { validateEmail, validateName, validatePassword } from '@/domain/validation';
import type { AppDependencies, EmailLinkType } from '@/data/repositories';

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
        await deps.auth.resendConfirmation(email);
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
      // to find out who is registered.
      await auth.requestPasswordReset(email);
      return { ok: true, email };
    });
}

export function createResetPasswordLoader({ auth }: AppDependencies) {
  return async () => ({ signedIn: (await auth.getCurrentUser()) !== null });
}

export function createResetPasswordAction({ auth }: AppDependencies) {
  return ({ request }: ActionFunctionArgs) =>
    runForm(async () => {
      const form = await request.formData();
      const password = readText(form, 'password');
      const confirmation = readText(form, 'confirmPassword');
      const passwordProblem = validatePassword(password);
      if (passwordProblem) return formError(passwordProblem, 'password');
      if (password !== confirmation) return formError('passwords_do_not_match', 'confirmPassword');
      await auth.updatePassword(password);
      return { ok: true };
    });
}

function isCompleteRegistration(details: AuthUser['registration']): details is RegistrationDetails {
  return (
    details.role !== undefined &&
    validateName(details.firstName ?? '') === null &&
    validateName(details.lastName ?? '') === null
  );
}

/**
 * Sets up the profile from what was entered when registering, the first time a confirmed user
 * arrives. Does nothing when the profile exists or the details are incomplete (the welcome page
 * then asks for them).
 */
async function setUpProfileFromRegistration({ auth, accounts }: AppDependencies): Promise<void> {
  const user = await auth.getCurrentUser();
  if (!user || (await accounts.getMyProfile())) return;
  if (!isCompleteRegistration(user.registration)) return;
  try {
    await accounts.completeProfile(user.registration);
  } catch (error) {
    if (errorCodeOf(error) !== 'profile_exists') throw error;
  }
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
    if (type === 'recovery') throw redirect(paths.resetPassword);
    await setUpProfileFromRegistration(deps);
    throw redirect(paths.root);
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
}

/** /welcome: for signed-in people who have not set up their profile (e.g. after Google). */
export function createWelcomeLoader({ auth, accounts }: AppDependencies) {
  return async (): Promise<WelcomeData> => {
    const user = await auth.getCurrentUser();
    if (!user) throw redirect(paths.signIn);
    const profile = await accounts.getMyProfile();
    if (profile) throw redirect(homePathFor(profile.role));
    return { email: user.email, registration: user.registration };
  };
}

export function createWelcomeAction({ accounts }: AppDependencies) {
  return ({ request }: ActionFunctionArgs) =>
    runForm(async () => {
      const form = await request.formData();
      const role = readText(form, 'role');
      const firstName = readText(form, 'firstName');
      const lastName = readText(form, 'lastName');
      if (!isAccountRole(role)) return formError('invalid_role', 'role');
      if (validateName(firstName)) return formError('invalid_name', 'firstName');
      if (validateName(lastName)) return formError('invalid_name', 'lastName');
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
