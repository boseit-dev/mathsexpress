import { useRef, type ReactNode } from 'react';
import { ScrollRestoration } from 'react-router';
import type { NavItem } from '@/config/navigation';
import { useFocusOnRouteChange } from '@/hooks/useFocusOnRouteChange';
import { AppHeader } from './AppHeader';
import { DevPreviewNotice } from './DevPreviewNotice';
import { SkipLink } from './SkipLink';
import styles from './AppShell.module.css';

const MAIN_CONTENT_ID = 'main-content';

interface AppShellProps {
  homePath: string;
  navigation: readonly NavItem[];
  navigationLabel: string;
  account: ReactNode;
  previewSwitchLink: { label: string; to: string };
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
  previewSwitchLink,
  backdrop,
  children,
}: AppShellProps) {
  const mainRef = useRef<HTMLElement>(null);
  useFocusOnRouteChange(mainRef);

  return (
    <div className={styles.shell}>
      {backdrop}
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <DevPreviewNotice switchLink={previewSwitchLink} />
      <AppHeader
        homePath={homePath}
        navigation={navigation}
        navigationLabel={navigationLabel}
        account={account}
      />
      <main ref={mainRef} id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
        {children}
      </main>
      <ScrollRestoration />
    </div>
  );
}
