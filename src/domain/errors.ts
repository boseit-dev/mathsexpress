// Every problem the app can report, each with the sentence shown to the user. Codes come from the
// database functions (e.g. 'already_member'), the auth server, or the app's own validation.

export const errorMessages = {
  // Signing in and accounts
  invalid_credentials: 'That email and password don’t match an account. Check them and try again.',
  email_not_confirmed:
    'Confirm your email address first. We can send the confirmation email again.',
  invalid_email: 'Enter a valid email address.',
  weak_password: 'Use at least 8 characters, including letters and numbers.',
  password_too_long:
    'That password is too long. Use at most 72 letters and numbers (fewer if it has accented or non-English letters).',
  passwords_do_not_match: 'The two passwords don’t match.',
  same_password: 'Choose a password that is different from your current one.',
  link_invalid: 'This link has expired or has already been used. Request a new one.',
  reset_link_required:
    'To choose a new password, open the link in a password reset email. We can send you one.',
  email_link_required:
    'To finish setting up, open the link we email you. It shows that the email address is yours.',
  google_unavailable: 'Google sign-in isn’t set up yet. Use your email and password instead.',
  google_sign_in_failed: 'Google sign-in didn’t finish. Try again, or use your email and password.',
  password_required: 'Enter your password.',
  rate_limited: 'Too many attempts. Wait a minute, then try again.',
  not_signed_in: 'Sign in to continue.',
  profile_required: 'Finish setting up your account first.',
  profile_exists: 'Your account is already set up.',
  invalid_role: 'Choose whether you are a student or a teacher.',
  invalid_name: 'Enter your first and last name (up to 50 characters each).',
  // Classes
  teachers_only: 'Only teachers can do that.',
  students_only: 'Only students can join classes.',
  invalid_class_name: 'Enter a class name of up to 60 characters.',
  invalid_year_level: 'Choose a year level from Kindergarten to Year 12.',
  invalid_settings: 'Those class settings aren’t valid.',
  class_not_found: 'That class couldn’t be found.',
  invalid_join_code: 'Class codes have 8 letters and numbers, like ABCD-2345.',
  join_code_not_found: 'No class uses that code. Check it with your teacher.',
  joining_closed: 'This class isn’t accepting new students right now. Ask your teacher.',
  already_member: 'You’re already in this class.',
  leaving_not_allowed:
    'Your teacher has turned off leaving this class. Ask them if you need to leave.',
  student_not_found: 'That student is no longer in this class.',
  // Anything else
  network: 'MathsExpress couldn’t connect. Check your internet connection and try again.',
  unknown: 'Something went wrong. Please try again.',
} as const;

export type AppErrorCode = keyof typeof errorMessages;

export function isAppErrorCode(value: unknown): value is AppErrorCode {
  return typeof value === 'string' && Object.hasOwn(errorMessages, value);
}

/** An expected problem with a known code, safe to show to the user. */
export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, options?: { cause?: unknown }) {
    super(errorMessages[code], options);
    this.name = 'AppError';
    this.code = code;
  }
}

export function errorCodeOf(error: unknown): AppErrorCode {
  return error instanceof AppError ? error.code : 'unknown';
}
