import { useEffect } from 'react';
import { useRevalidator } from 'react-router';

/** Reloads the current page's data when the person comes back to the tab. */
export function useRefreshWhenVisible() {
  const { revalidate } = useRevalidator();

  useEffect(() => {
    function refreshIfVisible() {
      if (document.visibilityState === 'visible') void revalidate();
    }
    document.addEventListener('visibilitychange', refreshIfVisible);
    return () => {
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [revalidate]);
}
