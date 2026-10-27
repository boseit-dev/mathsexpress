import { describe, expect, it } from 'vitest';
import {
  calendarDaysBetween,
  formatShortDate,
  formatTimeUntilMidnight,
  formatWeekday,
  getGreeting,
} from './dates';

// Tests run in Australia/Sydney time (see vite.config.ts). Months are zero-based.
describe('calendarDaysBetween', () => {
  it('counts calendar days, not 24-hour periods', () => {
    const lateTonight = new Date(2026, 9, 28, 23, 30);
    const earlyTomorrow = new Date(2026, 9, 29, 0, 30);
    expect(calendarDaysBetween(lateTonight, earlyTomorrow)).toBe(1);
    expect(calendarDaysBetween(earlyTomorrow, lateTonight)).toBe(-1);
    expect(calendarDaysBetween(lateTonight, new Date(2026, 9, 28, 1, 0))).toBe(0);
  });

  it('is correct across the start of daylight saving (4 October 2026 in NSW)', () => {
    expect(calendarDaysBetween(new Date(2026, 9, 3, 12), new Date(2026, 9, 5, 12))).toBe(2);
  });
});

describe('getGreeting', () => {
  it('changes at noon and 6 pm', () => {
    expect(getGreeting(new Date(2026, 9, 28, 11, 59))).toBe('Good morning');
    expect(getGreeting(new Date(2026, 9, 28, 12, 0))).toBe('Good afternoon');
    expect(getGreeting(new Date(2026, 9, 28, 17, 59))).toBe('Good afternoon');
    expect(getGreeting(new Date(2026, 9, 28, 18, 0))).toBe('Good evening');
  });
});

describe('date formatting', () => {
  it('formats weekdays and short dates for Australia', () => {
    const date = new Date(2026, 10, 12);
    expect(formatWeekday(date)).toBe('Thursday');
    expect(formatShortDate(date)).toBe('12 Nov');
  });
});

describe('formatTimeUntilMidnight', () => {
  it('shows hours and minutes left in the day', () => {
    expect(formatTimeUntilMidnight(new Date(2026, 9, 28, 15, 30))).toBe('8h 30m');
    expect(formatTimeUntilMidnight(new Date(2026, 9, 28, 23, 15))).toBe('45m');
  });
});
