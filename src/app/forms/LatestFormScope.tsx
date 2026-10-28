import { useMemo, useState, type ReactNode } from 'react';
import { LatestFormContext } from './latestFormContext';

/**
 * Wrap a page with several forms in this so a form's message disappears once another form is
 * used, and the page never shows an out-of-date result (e.g. "You left" after rejoining).
 */
export function LatestFormScope({ children }: { children: ReactNode }) {
  const [latest, setLatest] = useState<string | null>(null);
  const value = useMemo(() => ({ latest, setLatest }), [latest]);
  return <LatestFormContext value={value}>{children}</LatestFormContext>;
}
