import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  /** A sentence or two under the heading about what the page is for. */
  children?: ReactNode;
  /** Shown above the heading, e.g. a link back to the list this page belongs to. */
  before?: ReactNode;
}

/** The h1 and introduction at the top of a page. */
export function PageHeader({ title, children, before }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {before}
      <h1 className={styles.title}>{title}</h1>
      {children && <div className={styles.description}>{children}</div>}
    </header>
  );
}
