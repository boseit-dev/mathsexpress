import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './IconTile.module.css';

export type IconTileTone = 'brand' | 'solid' | 'success' | 'warning' | 'coin';

interface IconTileProps {
  icon: LucideIcon;
  tone?: IconTileTone;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/** A decorative icon on a tinted rounded square. Hidden from screen readers. */
export function IconTile({
  icon: Icon,
  tone = 'brand',
  size = 'medium',
  className,
}: IconTileProps) {
  return (
    <span className={cx(styles.tile, styles[tone], styles[size], className)}>
      <Icon />
    </span>
  );
}
