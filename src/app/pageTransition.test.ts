import { afterEach, describe, expect, it, vi } from 'vitest';
import { MAIN_CONTENT_ID } from './mainContentFocus';
import { animatePageEntrance } from './pageTransition';

function setUp(reduce = false) {
  document.body.innerHTML = `<main id="${MAIN_CONTENT_ID}"><div id="page"></div><div id="toolbar"></div></main>`;
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query.includes('reduce') }));
  const animate = vi.fn();
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true });
  return animate;
}

describe('animatePageEntrance', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    Reflect.deleteProperty(HTMLElement.prototype, 'animate');
  });

  it('moves only the page, never <main>, so fixed bars and the scrollbar stay put', () => {
    const animate = setUp();
    animatePageEntrance();
    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate.mock.contexts[0]).toBe(document.getElementById('page'));
  });

  it('does nothing for people who prefer reduced motion', () => {
    const animate = setUp(true);
    animatePageEntrance();
    expect(animate).not.toHaveBeenCalled();
  });
});
