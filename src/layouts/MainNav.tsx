import { NavLink } from 'react-router';
import type { NavItem } from '@/config/navigation';
import styles from './MainNav.module.css';

interface MainNavProps {
  items: readonly NavItem[];
  /** Names the landmark, e.g. "Student" is announced as "Student navigation". */
  label: string;
  className?: string;
}

/** The top navigation bar. The current page is marked with aria-current by NavLink. */
export function MainNav({ items, label, className }: MainNavProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul role="list" className={styles.list}>
        {items.map(({ label: itemLabel, to, icon: Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={styles.link}>
              <Icon className={styles.icon} />
              {itemLabel}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
