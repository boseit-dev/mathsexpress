import { describe, expect, it } from 'vitest';
import { toAppError } from './errors';

describe('toAppError', () => {
  it('reads the codes the database functions raise', () => {
    expect(toAppError({ code: 'P0001', message: 'already_member' }).code).toBe('already_member');
    expect(toAppError({ code: 'P0001', message: 'not_a_code' }).code).toBe('unknown');
  });

  it('tells apart the auth server’s email and password checks, which share one code', () => {
    const tooLong = {
      code: 'validation_failed',
      message: 'Password cannot be longer than 72 characters',
    };
    const badEmail = {
      code: 'validation_failed',
      message: 'Unable to validate email address: invalid format',
    };
    expect(toAppError(tooLong).code).toBe('password_too_long');
    expect(toAppError(badEmail).code).toBe('invalid_email');
    expect(toAppError({ code: 'validation_failed', message: 'Something else' }).code).toBe(
      'unknown',
    );
  });

  it('maps rate limits and network failures', () => {
    expect(toAppError({ code: 'over_email_send_rate_limit' }).code).toBe('rate_limited');
    expect(toAppError({ status: 429 }).code).toBe('rate_limited');
    expect(toAppError(new TypeError('Failed to fetch')).code).toBe('network');
  });

  it('treats requests that ran out of time as network failures', () => {
    expect(toAppError(new DOMException('signal timed out', 'TimeoutError')).code).toBe('network');
    // How the database client reports a failed request.
    expect(toAppError({ code: '', message: 'TimeoutError: signal timed out' }).code).toBe(
      'network',
    );
    expect(toAppError({ code: '', message: 'TypeError: Failed to fetch' }).code).toBe('network');
  });
});
