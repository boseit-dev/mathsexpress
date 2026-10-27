import { appConfig } from '@/config/app';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const weekdayFormat = new Intl.DateTimeFormat(appConfig.locale, { weekday: 'long' });
const shortDateFormat = new Intl.DateTimeFormat(appConfig.locale, {
  day: 'numeric',
  month: 'short',
});

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Whole calendar days from `from` to `to` in local time: 1 means `to` is tomorrow, -1 yesterday.
 * Rounding absorbs the 23- and 25-hour days at daylight-saving changes.
 */
export function calendarDaysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MILLISECONDS_PER_DAY);
}

/** "Friday" */
export function formatWeekday(date: Date): string {
  return weekdayFormat.format(date);
}

/** "12 Nov" */
export function formatShortDate(date: Date): string {
  return shortDateFormat.format(date);
}

export function getGreeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Milliseconds from `now` until the next local midnight, when daily things reset. */
export function millisecondsUntilMidnight(now: Date): number {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return midnight.getTime() - now.getTime();
}
