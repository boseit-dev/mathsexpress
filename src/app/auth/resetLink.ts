// Remembers, for this browser tab, that a password-reset link was just opened. Every email link
// signs in the same way, so the session alone can't tell a reset link from a confirmation link or
// a Google sign-in; only a reset link should lead to the "choose a new password" form.
// The auth server's own rules still apply; this decides only what the page offers.

const KEY = 'mathsexpress-reset-link';

// Storage can be unavailable (private windows, blocked site data): then no form is offered and
// the person is sent for a new link, which is the safe way to fail.
function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function rememberResetLink(userId: string) {
  try {
    storage()?.setItem(KEY, userId);
  } catch {
    // Not stored: the reset page will ask for a new link.
  }
}

export function openedResetLink(userId: string): boolean {
  try {
    return storage()?.getItem(KEY) === userId;
  } catch {
    return false;
  }
}

export function forgetResetLink() {
  try {
    storage()?.removeItem(KEY);
  } catch {
    // Nothing stored.
  }
}
