import { describe, expect, it } from 'vitest';
import { formatJoinCode, normalizeJoinCode } from './classes';
import { AppError, errorCodeOf, errorMessages, isAppErrorCode } from './errors';
import { getShortName } from './people';
import { yearLevelFromNumber, yearLevelToNumber } from './student';
import {
  cleanText,
  validateClassName,
  validateEmail,
  validateJoinCode,
  validateName,
  validatePassword,
} from './validation';

describe('validation', () => {
  it('checks email addresses', () => {
    expect(validateEmail('mia@example.com')).toBeNull();
    expect(validateEmail(' mia@example.com ')).toBeNull();
    expect(validateEmail('mia@')).toBe('invalid_email');
    expect(validateEmail('mia example.com')).toBe('invalid_email');
  });

  it('applies the same password policy as the server', () => {
    expect(validatePassword('maths2026')).toBeNull();
    expect(validatePassword('short1')).toBe('weak_password');
    expect(validatePassword('onlyletters')).toBe('weak_password');
    expect(validatePassword('12345678')).toBe('weak_password');
  });

  it('checks names and class names after tidying spaces', () => {
    expect(cleanText('  9M2   Maths ')).toBe('9M2 Maths');
    expect(validateName('   ')).toBe('invalid_name');
    expect(validateName('A'.repeat(50))).toBeNull();
    expect(validateName('A'.repeat(51))).toBe('invalid_name');
    expect(validateClassName('9M2 Mathematics')).toBeNull();
    expect(validateClassName('A'.repeat(61))).toBe('invalid_class_name');
  });

  it('accepts join codes typed with spaces, hyphens or lower case', () => {
    expect(normalizeJoinCode('abcd-2345')).toBe('ABCD2345');
    expect(validateJoinCode('abcd 2345')).toBeNull();
    expect(validateJoinCode('ABCD234')).toBe('invalid_join_code');
    expect(validateJoinCode('ABCD1234')).toBe('invalid_join_code');
    expect(formatJoinCode('ABCD2345')).toBe('ABCD-2345');
  });
});

describe('year levels', () => {
  it('converts between the database numbers and year levels', () => {
    expect(yearLevelFromNumber(0)).toBe('K');
    expect(yearLevelFromNumber(9)).toBe(9);
    expect(yearLevelToNumber('K')).toBe(0);
    expect(yearLevelToNumber(12)).toBe(12);
    expect(() => yearLevelFromNumber(13)).toThrow(RangeError);
    expect(() => yearLevelFromNumber(2.5)).toThrow(RangeError);
  });
});

describe('errors', () => {
  it('gives every code a message and recognises known codes', () => {
    expect(new AppError('already_member').message).toBe(errorMessages.already_member);
    expect(errorCodeOf(new AppError('joining_closed'))).toBe('joining_closed');
    expect(errorCodeOf(new Error('boom'))).toBe('unknown');
    expect(isAppErrorCode('already_member')).toBe(true);
    expect(isAppErrorCode('toString')).toBe(false);
  });
});

describe('getShortName', () => {
  it('shows the first name and last initial', () => {
    expect(getShortName({ firstName: 'Mia', lastName: 'chen' })).toBe('Mia C.');
  });
});
