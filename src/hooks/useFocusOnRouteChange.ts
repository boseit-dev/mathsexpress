import { useEffect, useRef, type RefObject } from 'react';
import { useLocation } from 'react-router';

/**
 * Moves keyboard and screen-reader focus to `targetRef` after in-app navigation, so the new
 * page is announced and Tab continues from its content instead of the clicked link.
 * The first render is skipped: on page load the browser's own focus handling applies.
 */
export function useFocusOnRouteChange(targetRef: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    targetRef.current?.focus({ preventScroll: true });
  }, [pathname, targetRef]);
}
