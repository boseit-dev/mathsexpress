import { describe, expect, it } from 'vitest';
import { clamp, toPercent } from './math';

describe('clamp', () => {
  it('keeps a value inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(12, 0, 10)).toBe(10);
  });
});

describe('toPercent', () => {
  it('rounds to a whole percentage', () => {
    expect(toPercent(7, 12)).toBe(58);
    expect(toPercent(1, 3)).toBe(33);
  });

  it('stays between 0 and 100', () => {
    expect(toPercent(15, 12)).toBe(100);
    expect(toPercent(-1, 12)).toBe(0);
  });

  it('returns 0 when there is nothing to complete', () => {
    expect(toPercent(0, 0)).toBe(0);
  });
});
