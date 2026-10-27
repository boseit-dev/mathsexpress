// Keyboard and screen-reader focus after in-app navigation. Focus moves to the page's <main>
// so the new page is announced and Tab continues from its content, never from <body>.

/** The id of the <main> element on every page. */
export const MAIN_CONTENT_ID = 'main-content';

// React Router gives the location of the first page load this key.
const INITIAL_LOCATION_KEY = 'default';

// Module state, not component state: it must survive layouts unmounting and remounting, such
// as when moving between the student and teacher areas or out of a full-page error.
let lastHandledLocationKey: string | null = null;
let focusRequestedAfterRetry = false;

function focusMainContent() {
  document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
}

/**
 * Call after a location has rendered. Focuses <main> once per new location, except for the
 * first page load, where the browser's own focus handling applies.
 */
export function focusMainAfterNavigation(locationKey: string) {
  const isFirstLoad = lastHandledLocationKey === null || locationKey === INITIAL_LOCATION_KEY;
  const isNewLocation = locationKey !== lastHandledLocationKey;
  lastHandledLocationKey = locationKey;
  if (isNewLocation && !isFirstLoad) focusMainContent();
}

/** "Try again" removes the button the user pressed, so focus the reloaded page instead. */
export function requestFocusAfterRetry() {
  focusRequestedAfterRetry = true;
}

/** Call once data loading is idle again; focuses <main> if a retry asked for it. */
export function focusMainAfterRetry() {
  if (!focusRequestedAfterRetry) return;
  focusRequestedAfterRetry = false;
  focusMainContent();
}
