import type { ReactNode } from 'react';
import { paths } from '@/config/paths';
import { BrandLogo } from './BrandLogo';
import styles from './StandalonePage.module.css';

/** A minimal frame for pages shown outside the student and teacher areas, such as errors. */
export function StandalonePage({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <BrandLogo to={paths.root} />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
