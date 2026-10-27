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
}

afterEach(() => {
  cleanup();
});
