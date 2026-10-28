import type { ReactNode } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import styles from './AuthPage.module.css';

/** The page's h1 and a short explanation; also sets the browser tab title. */
export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
  useDocumentTitle(title);
  return (
    <div className={styles.heading}>
      <h1 className={styles.title}>{title}</h1>
      {children && <p className={styles.intro}>{children}</p>}
    </div>
  );
}
