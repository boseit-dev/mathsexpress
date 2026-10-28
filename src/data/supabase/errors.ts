import { AppError, isAppErrorCode, type AppErrorCode } from '@/domain/errors';

// Auth server error codes that mean something specific to the user.
const AUTH_ERROR_CODES: Partial<Record<string, AppErrorCode>> = {
  invalid_credentials: 'invalid_credentials',
  email_not_confirmed: 'email_not_confirmed',
  weak_password: 'weak_password',
  same_password: 'same_password',
  email_address_invalid: 'invalid_email',
  validation_failed: 'invalid_email',
  otp_expired: 'link_invalid',
  flow_state_not_found: 'link_invalid',
  flow_state_expired: 'link_invalid',
  bad_code_verifier: 'link_invalid',
  over_email_send_rate_limit: 'rate_limited',
  over_request_rate_limit: 'rate_limited',
  provider_disabled: 'google_unavailable',
  session_not_found: 'not_signed_in',
};

interface ErrorLike {
  code?: unknown;
  message?: unknown;
  name?: unknown;
  status?: unknown;
}

function isNetworkFailure(error: ErrorLike): boolean {
  return (
    error.name === 'AuthRetryableFetchError' ||
    (error.name === 'TypeError' &&
      typeof error.message === 'string' &&
      /fetch/i.test(error.message))
  );
}

/**
 * Turns any error from Supabase into an AppError. Database functions raise their code as the
 * message (e.g. 'already_member'); the auth server uses error codes; anything unexpected becomes
 * 'unknown' and keeps the original error as its cause for debugging.
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (typeof error !== 'object' || error === null) return new AppError('unknown', { cause: error });

  const details = error as ErrorLike;
  if (isNetworkFailure(details)) return new AppError('network', { cause: error });
  if (details.code === 'P0001' && isAppErrorCode(details.message)) {
    return new AppError(details.message, { cause: error });
  }
  if (typeof details.code === 'string') {
    const authCode = AUTH_ERROR_CODES[details.code];
    if (authCode) return new AppError(authCode, { cause: error });
  }
  if (details.status === 429) return new AppError('rate_limited', { cause: error });
  return new AppError('unknown', { cause: error });
}

/** Rejects with an AppError when a Supabase call returned an error. */
export function throwIfError(error: unknown): void {
  if (error) throw toAppError(error);
}

/** The data from a Supabase call, or an AppError when it failed or returned nothing. */
export function unwrap<T>(result: { data: T | null; error: unknown }): T {
  if (result.error) throw toAppError(result.error);
  if (result.data === null) {
    throw new AppError('unknown', { cause: new Error('The server returned no data') });
  }
  return result.data;
}
