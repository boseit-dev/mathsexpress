import { useLayoutEffect, useRef } from 'react';

/**
 * Slides one indicator bar under the current item of a navigation list. The bar is moved with
 * transform only (translate and scale on a 1px-wide bar), so it animates without layout work.
 * The current item is the link with aria-current, which NavLink sets, unless `selector` names
 * another marker such as a pressed button.
 */
export function useSlidingIndicator<List extends HTMLElement>(
  dependency: unknown,
  selector = '[aria-current]',
) {
  const listRef = useRef<List>(null);
  const indicatorRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return undefined;

    const place = () => {
      const current = list.querySelector<HTMLElement>(selector);
      if (!current) {
        indicator.style.opacity = '0';
        return;
      }
      const left = current.offsetLeft;
      const width = current.offsetWidth;
      indicator.style.opacity = '1';
      indicator.style.transform = `translateX(${left}px) scaleX(${width})`;
    };

    place();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(place) : null;
    observer?.observe(list);
    return () => {
      observer?.disconnect();
    };
  }, [dependency, selector]);

  return { listRef, indicatorRef };
}
