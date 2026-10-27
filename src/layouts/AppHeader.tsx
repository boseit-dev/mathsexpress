import type { ReactNode } from 'react';
import type { NavItem } from '@/config/navigation';
import { BrandLogo } from './BrandLogo';
import { MainNav } from './MainNav';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  homePath: string;
  navigation: readonly NavItem[];
  navigationLabel: string;
  /** The signed-in person's summary, e.g. coin balance and avatar. */
  account: ReactNode;
}

/** The top bar: logo, main navigation and account summary. Never a side bar. */
export function AppHeader({ homePath, navigation, navigationLabel, account }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <BrandLogo to={homePath} />
        </div>
        <MainNav items={navigation} label={navigationLabel} className={styles.nav} />
        <div className={styles.account}>{account}</div>
      </div>
    </header>
  );
}
