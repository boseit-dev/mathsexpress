import { useEffect } from 'react';
import { useRevalidator } from 'react-router';
import { millisecondsUntilMidnight } from '@/lib/dates';
import { useRefreshWhenVisible } from './useRefreshWhenVisible';

/**
 * Reloads the current page's data when the student comes back to the tab and at local midnight,
 * so due dates, greetings and daily challenges never show stale information on a page left open.
 */
export function useRefreshWhenStale(loadedAt: Date) {
  const { revalidate } = useRevalidator();
  useRefreshWhenVisible();

  useEffect(() => {
    const midnightTimer = window.setTimeout(() => {
      void revalidate();
    }, millisecondsUntilMidnight(loadedAt));
    return () => {
      window.clearTimeout(midnightTimer);
    };
  }, [loadedAt, revalidate]);
}
