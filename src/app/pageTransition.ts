import { MAIN_CONTENT_ID } from './mainContentFocus';

const reducedMotion = () =>
  typeof window.matchMedia !== 'function' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fades the new page's content in after in-app navigation, using the Web Animations API so nothing
 * remounts and no state is lost. Skipped for reduced motion and where unsupported.
 *
 * Only the page itself moves, never <main>: transforming <main> would briefly make it the
 * containing block of fixed elements inside it (the quick-tools bar), and would push the page
 * past the bottom of a short page, flashing a scrollbar and shifting the layout sideways.
 * The page sits inside <main>'s bottom padding, so its small rise never adds overflow.
 */
export function animatePageEntrance() {
  const main = document.getElementById(MAIN_CONTENT_ID);
  const page = main?.firstElementChild;
  if (!(page instanceof HTMLElement) || typeof page.animate !== 'function' || reducedMotion()) {
    return;
  }
  page.animate(
    [
      { opacity: 0, transform: 'translateY(4px)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  );
}
