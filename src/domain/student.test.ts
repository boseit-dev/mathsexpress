import { describe, expect, it } from 'vitest';
import { getFullName } from './people';
import { formatYearLevel } from './student';

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
