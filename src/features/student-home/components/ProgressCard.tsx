import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { IconTile, type IconTileTone } from '@/components/ui/IconTile';
import styles from './ProgressCard.module.css';

interface ProgressCardProps {
  icon: LucideIcon;
  tone?: IconTileTone;
  label: string;
  value: string;
  detail: string;
  /** Optional extra visual, such as a progress bar. */
  children?: ReactNode;
}

/** One learning statistic: a label, a large value and a short explanation. */
export function ProgressCard({
  icon,
  tone = 'brand',
  label,
  value,
  detail,
  children,
}: ProgressCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <IconTile icon={icon} tone={tone} size="small" />
        <p className={styles.label}>{label}</p>
      </div>
      <p className={styles.value}>{value}</p>
      <p className={styles.detail}>{detail}</p>
      {children && <div className={styles.extra}>{children}</div>}
    </div>
  );
}
