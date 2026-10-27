import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation, useRevalidator } from 'react-router';
import { focusMainAfterNavigation, focusMainAfterRetry } from './mainContentFocus';

/**
 * Wraps every page. It stays mounted when moving between the student and teacher areas, so it
 * owns the behaviour that must span them: focus after navigation and scroll restoration.
 */
export function RootLayout() {
  const { key } = useLocation();
  const { state: revalidationState } = useRevalidator();

  useEffect(() => {
    focusMainAfterNavigation(key);
  }, [key]);

  useEffect(() => {
    if (revalidationState === 'idle') focusMainAfterRetry();
  }, [revalidationState]);

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
