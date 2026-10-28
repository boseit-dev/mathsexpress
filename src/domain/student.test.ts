import { describe, expect, it } from 'vitest';
import { getFullName } from './people';
import { formatYearLevel, parseYearLevel } from './student';

describe('formatYearLevel', () => {
  it('names Kindergarten and numbered years', () => {
    expect(formatYearLevel('K')).toBe('Kindergarten');
    expect(formatYearLevel(9)).toBe('Year 9');
  });
});

describe('getFullName', () => {
  it('joins first and last names', () => {
    expect(getFullName({ firstName: 'Mia', lastName: 'Chen' })).toBe('Mia Chen');
  });
});

describe('parseYearLevel', () => {
  it('reads the numbers year-level fields send, with 0 for Kindergarten', () => {
    expect(parseYearLevel('0')).toBe('K');
    expect(parseYearLevel('7')).toBe(7);
    expect(parseYearLevel('12')).toBe(12);
  });

  it('rejects anything else', () => {
    for (const value of ['', '13', '-1', '1.5', ' 7', 'K', 'Year 7', '007']) {
      expect(parseYearLevel(value)).toBeNull();
    }
  });
});
