import { describe, expect, it } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins class names and skips empty values', () => {
    expect(cx('card', false, 'active', undefined, null, '')).toBe('card active');
  });

  it('returns an empty string when nothing is set', () => {
    expect(cx(undefined, false)).toBe('');
  });
});
