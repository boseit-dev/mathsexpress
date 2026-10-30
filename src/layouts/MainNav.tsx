import { matchPath, NavLink, useLocation } from 'react-router';
import { useSlidingIndicator } from '@/hooks/useSlidingIndicator';
import type { NavItem } from '@/config/navigation';
import styles from './MainNav.module.css';

interface MainNavProps {
  items: readonly NavItem[];
  /** Names the landmark, e.g. "Student" is announced as "Student navigation". */
  label: string;
  className?: string;
}

/**
 * The top navigation bar. NavLink marks the active item; it is announced as the current page
 * only on its exact address, and as the current section on pages inside it (e.g. Class on the
 * tasks list).
 */
export function MainNav({ items, label, className }: MainNavProps) {
  const { pathname } = useLocation();

  const { listRef, indicatorRef } = useSlidingIndicator<HTMLUListElement>(pathname);
  return (
    <nav aria-label={label} className={className}>
      <ul role="list" className={styles.list} ref={listRef}>
        {items.map(({ label: itemLabel, to, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              aria-current={matchPath({ path: to, end: true }, pathname) ? 'page' : 'true'}
              className={styles.link}
            >
              <Icon className={styles.icon} />
              {itemLabel}
            </NavLink>
          </li>
        ))}
        <li ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
      </ul>
    </nav>
  );
}
