import { appConfig } from '@/config/app';

const numberFormat = new Intl.NumberFormat(appConfig.locale);

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

/** "1 coin", "1,240 coins". */
export function formatCount(count: number, singular: string, plural = `${singular}s`): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}

/** Initials for an avatar: first letters of the first and last words ("Mia Chen" → "MC"). */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0];
  if (first === undefined) return '?';
  const last = words.length > 1 ? words[words.length - 1] : undefined;
  return `${first.charAt(0)}${last?.charAt(0) ?? ''}`.toUpperCase();
}
