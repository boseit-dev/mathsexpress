import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { IconTile } from '@/components/ui/IconTile';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import styles from './MessageLayout.module.css';

interface MessageLayoutProps {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

/** A centred card with a heading and short explanation, for status pages like "not found". */
export function MessageLayout({ icon, eyebrow, title, children, actions }: MessageLayoutProps) {
  useDocumentTitle(title);

  return (
    <div className={styles.message}>
      <IconTile icon={icon} size="large" />
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.body}>{children}</div>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
