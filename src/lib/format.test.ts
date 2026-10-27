import { describe, expect, it } from 'vitest';
import { formatCount, formatNumber, getInitials } from './format';

describe('formatNumber', () => {
  it('uses Australian digit grouping', () => {
    expect(formatNumber(1286)).toBe('1,286');
    expect(formatNumber(42)).toBe('42');
  });
});

describe('formatCount', () => {
  it('chooses the singular or plural word', () => {
    expect(formatCount(1, 'coin')).toBe('1 coin');
    expect(formatCount(1240, 'coin')).toBe('1,240 coins');
    expect(formatCount(0, 'day')).toBe('0 days');
  });

  it('accepts an irregular plural', () => {
    expect(formatCount(2, 'match', 'matches')).toBe('2 matches');
  });
});

describe('getInitials', () => {
  it('uses the first and last names', () => {
    expect(getInitials('Mia Chen')).toBe('MC');
    expect(getInitials('  ana  van der berg ')).toBe('AB');
  });

  it('handles a single name and an empty name', () => {
    expect(getInitials('Mia')).toBe('M');
    expect(getInitials('   ')).toBe('?');
  });
});
