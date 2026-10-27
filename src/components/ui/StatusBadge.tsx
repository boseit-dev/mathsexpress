import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './StatusBadge.module.css';

export type StatusTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

interface StatusBadgeProps {
  tone: StatusTone;
  /** The status in words. Colour alone never carries the meaning. */
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function StatusBadge({ tone, children, icon: Icon, className }: StatusBadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], className)}>
      {Icon && <Icon />}
      {children}
    </span>
  );
}
