import { MAIN_CONTENT_ID } from './mainContentFocus';

const reducedMotion = () =>
  typeof window.matchMedia !== 'function' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fades the new page's content in after in-app navigation. Uses the Web Animations API on <main>
 * so nothing remounts and no state is lost. Skipped for reduced motion and where unsupported.
 */
export function animatePageEntrance() {
  const main = document.getElementById(MAIN_CONTENT_ID);
  if (!main || typeof main.animate !== 'function' || reducedMotion()) return;
  main.animate(
    [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: 240, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  );
}
