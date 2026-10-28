// Route guards: who may see which pages. They keep the interface consistent; the database still
// checks every action on the server, so these are never the only protection.
import { redirect } from 'react-router';
import { paths } from '@/config/paths';
import type { AuthUser, AccountRole, Profile } from '@/domain/account';
import type { AppDependencies } from '@/data/repositories';

export function homePathFor(role: AccountRole): string {
  return role === 'student' ? paths.student.home : paths.teacher.home;
}

/**
 * A safe place to return to after signing in: only paths inside this app, never another site
 * (so a crafted link like /sign-in?redirectTo=//evil.example cannot send people away).
 */
export function safeRedirectPath(value: string | null): string | null {
  if (!value?.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null;
  return value;
}

function signInRedirect(request: Request): Response {
  const url = new URL(request.url);
  const returnTo = `${url.pathname}${url.search}`;
  return redirect(`${paths.signIn}?redirectTo=${encodeURIComponent(returnTo)}`);
}

interface Account {
  user: AuthUser;
  profile: Profile;
}

/** The signed-in account with this role, or a redirect to where the person should be instead. */
export async function requireAccount(
  { auth, accounts }: AppDependencies,
  request: Request,
  role: AccountRole,
): Promise<Account> {
  const user = await auth.getCurrentUser();
  if (!user) throw signInRedirect(request);
  const profile = await accounts.getMyProfile({ signal: request.signal });
  if (!profile) throw redirect(paths.welcome);
  if (profile.role !== role) throw redirect(homePathFor(profile.role));
  return { user, profile };
}

/** For pages only signed-out visitors need (sign in, register): sends others home. */
export async function redirectIfSignedIn({ auth }: AppDependencies): Promise<null> {
  if (await auth.getCurrentUser()) throw redirect(paths.root);
  return null;
}

/** Sends each person to the right starting page. */
export async function startPageRedirect({ auth, accounts }: AppDependencies): Promise<never> {
  const user = await auth.getCurrentUser();
  if (!user) throw redirect(paths.signIn);
  const profile = await accounts.getMyProfile();
  if (!profile) throw redirect(paths.welcome);
  throw redirect(homePathFor(profile.role));
}
