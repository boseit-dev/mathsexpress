import type { ReactNode } from 'react';
import { MAIN_CONTENT_ID } from '@/app/mainContentFocus';
import type { NavItem } from '@/config/navigation';
import { AppHeader } from './AppHeader';
import { DevPreviewNotice } from './DevPreviewNotice';
import { SkipLink } from './SkipLink';
import styles from './AppShell.module.css';

interface AppShellProps {
  homePath: string;
  navigation: readonly NavItem[];
  navigationLabel: string;
  account: ReactNode;
  /** Optional decorative background drawn behind the page content. */
  backdrop?: ReactNode;
  children: ReactNode;
}

/** The frame shared by the student and teacher layouts. */
export function AppShell({
  homePath,
  navigation,
  navigationLabel,
  account,
  backdrop,
  children,
}: AppShellProps) {
  return (
    <div className={styles.shell}>
      {backdrop}
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <DevPreviewNotice />
      <AppHeader
        homePath={homePath}
        navigation={navigation}
        navigationLabel={navigationLabel}
        account={account}
      />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
        {children}
      </main>
    </div>
  );
}
