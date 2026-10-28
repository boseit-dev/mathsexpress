import type { PersonName } from './people';

export type AccountRole = 'student' | 'teacher';

/** A signed-in account as the auth server knows it. */
export interface AuthUser {
  id: string;
  email: string;
  /**
   * What the person entered when registering, kept until their profile is set up after they
   * confirm their email. Empty for Google accounts, which choose a role on the welcome page.
   */
  registration: Partial<RegistrationDetails>;
}

export interface RegistrationDetails extends PersonName {
  role: AccountRole;
}

/** A MathsExpress profile. The role is chosen once and cannot be changed by the user. */
export interface Profile extends RegistrationDetails {
  id: string;
}

export function isAccountRole(value: unknown): value is AccountRole {
  return value === 'student' || value === 'teacher';
}

export function formatRole(role: AccountRole): string {
  return role === 'student' ? 'Student' : 'Teacher';
}
