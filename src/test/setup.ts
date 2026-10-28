import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom does not implement scrolling, which React Router's ScrollRestoration uses.
// Node-environment tests (the scripts' tests) have no window at all.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
  // axe-core probes for canvas support, which jsdom lacks; null is what browsers return then.
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => null,
    writable: true,
  });
  // jsdom does not implement native modal dialogs. Tests still verify opening,
  // closing and keyboard-event handling through the same public component API.
  if (typeof HTMLDialogElement !== 'undefined') {
    if (!HTMLDialogElement.prototype.showModal) {
      Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
        value(this: HTMLDialogElement) {
          this.setAttribute('open', '');
        },
      });
    }
    if (!HTMLDialogElement.prototype.close) {
      Object.defineProperty(HTMLDialogElement.prototype, 'close', {
        value(this: HTMLDialogElement) {
          this.removeAttribute('open');
        },
      });
    }
  }
}

afterEach(() => {
  cleanup();
  if (typeof window !== 'undefined') window.sessionStorage.clear();
});
