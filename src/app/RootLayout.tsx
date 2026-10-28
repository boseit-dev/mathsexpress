import { useEffect } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigation,
  useRevalidator,
} from 'react-router';
import type { AuthService } from '@/data/repositories';
import { focusMainAfterNavigation, focusMainAfterRetry } from './mainContentFocus';
import styles from './RootLayout.module.css';

/**
 * Wraps every page. It stays mounted when moving between areas, so it owns the behaviour that
 * must span them: focus after navigation, scroll restoration, the loading indicator, and
 * reacting when the session ends (for example after signing out in another tab).
 */
export function RootLayout({ auth }: { auth: AuthService }) {
  const { key, pathname } = useLocation();
  const navigation = useNavigation();
  const { state: revalidationState, revalidate } = useRevalidator();

  useEffect(() => {
    focusMainAfterNavigation({ key, pathname });
  }, [key, pathname]);

  useEffect(() => {
    if (revalidationState === 'idle') focusMainAfterRetry();
  }, [revalidationState]);

  // Re-running the page's loaders sends a signed-out visitor to the sign-in page.
  useEffect(
    () =>
      auth.onSignedOut(() => {
        void revalidate();
      }),
    [auth, revalidate],
  );

  const isLoading = navigation.state === 'loading';

  return (
    <>
      {isLoading && <div className={styles.loadingBar} aria-hidden="true" />}
      <p aria-live="polite" className={styles.visuallyHidden}>
        {isLoading ? 'Loading…' : ''}
      </p>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
