import { useId, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/cx';
import { IconTile } from './IconTile';
import styles from './Panel.module.css';

interface PanelProps {
  title: string;
  /** Optional icon shown beside the title. */
  icon?: LucideIcon;
  /** Optional content at the end of the header, e.g. a balance or a short status. */
  action?: ReactNode;
  /** Optional centred link at the bottom of the panel, e.g. "View all". */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A white card that groups one section of a page under an h2 heading. */
export function Panel({ title, icon, action, footer, children, className }: PanelProps) {
  const headingId = useId();

  return (
    <section className={cx(styles.panel, className)} aria-labelledby={headingId}>
      <div className={styles.header}>
        <div className={styles.heading}>
          {icon && <IconTile icon={icon} size="small" />}
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </section>
  );
}
