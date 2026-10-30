import { NavLink, useLocation } from 'react-router';
import { useSlidingIndicator } from '@/hooks/useSlidingIndicator';
import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './TabNav.module.css';

export interface TabItem {
  label: string;
  to: string;
  icon?: LucideIcon;
  /** Only current on its exact address, for a section's first tab. */
  end?: boolean;
}

/** Links between the areas of one workspace, such as a class's overview and students. */
export function TabNav({ label, items }: { label: string; items: readonly TabItem[] }) {
  const { pathname } = useLocation();
  const { listRef, indicatorRef } = useSlidingIndicator<HTMLUListElement>(pathname);
  return (
    <nav aria-label={label} className={styles.nav}>
      <ul className={styles.list} ref={listRef}>
        {items.map(({ label: itemLabel, to, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => cx(styles.tab, isActive && styles.active)}
            >
              {Icon && <Icon aria-hidden="true" />}
              {itemLabel}
            </NavLink>
          </li>
        ))}
        <li ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
      </ul>
    </nav>
  );
}
