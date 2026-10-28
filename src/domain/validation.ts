// Checks run in the browser before anything is sent. The server applies the same rules, so these
// exist for fast, clear feedback, not for security.
import type { AppErrorCode } from './errors';
import { isValidJoinCode } from './classes';

export const MIN_PASSWORD_LENGTH = 8;
/** The auth server stores passwords with bcrypt, which reads at most 72 bytes. */
const MAX_PASSWORD_BYTES = 72;
const MAX_NAME_LENGTH = 50;
const MAX_CLASS_NAME_LENGTH = 60;

/** Trims and collapses inner whitespace, as the server does. */
export function cleanText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateEmail(value: string): AppErrorCode | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? null : 'invalid_email';
}

/** Matches the server's policy: 8 to 72 bytes, with at least one letter and one digit. */
export function validatePassword(value: string): AppErrorCode | null {
  if (new TextEncoder().encode(value).length > MAX_PASSWORD_BYTES) return 'password_too_long';
  const strongEnough =
    value.length >= MIN_PASSWORD_LENGTH && /[A-Za-z]/.test(value) && /\d/.test(value);
  return strongEnough ? null : 'weak_password';
}

export function validateName(value: string): AppErrorCode | null {
  const name = cleanText(value);
  return name.length > 0 && name.length <= MAX_NAME_LENGTH ? null : 'invalid_name';
}

export function validateClassName(value: string): AppErrorCode | null {
  const name = cleanText(value);
  return name.length > 0 && name.length <= MAX_CLASS_NAME_LENGTH ? null : 'invalid_class_name';
}

export function validateJoinCode(value: string): AppErrorCode | null {
  return isValidJoinCode(value) ? null : 'invalid_join_code';
}
