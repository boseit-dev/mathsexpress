import { describe, expect, it } from 'vitest';
import { safeRedirectPath } from './guards';

describe('safeRedirectPath', () => {
  it('keeps paths inside MathsExpress, with their query and fragment', () => {
    expect(safeRedirectPath('/student/class')).toBe('/student/class');
    expect(safeRedirectPath('/teacher/classes/abc?tab=2#students')).toBe(
      '/teacher/classes/abc?tab=2#students',
    );
  });

  it('rejects anything that could lead to another website', () => {
    for (const value of [
      null,
      '',
      'student',
      'https://evil.example/',
      '//evil.example',
      '/\\evil.example',
      '/\t/evil.example',
      '/\n/evil.example',
      '/%09/evil.example'.replace('%09', '\u0009'),
      '\u0000/student',
      // Dot segments that would collapse into "//evil.example".
      '/.//evil.example',
      '/..//evil.example',
      '/%2e//evil.example',
      '/%2E%2E//evil.example',
      '/student/..//evil.example',
      // Values a browser can't even read as an address.
      '//[',
      '//a b',
      '//evil.example:99999',
    ]) {
      expect(safeRedirectPath(value)).toBeNull();
    }
  });

  it('only ever returns paths that start with exactly one slash', () => {
    for (const value of ['/student', '/./student', '/a/../teacher', '/%2e/student?x=1']) {
      const result = safeRedirectPath(value);
      expect(result).toMatch(/^\/(?!\/)/);
    }
  });
});
