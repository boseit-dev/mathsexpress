import { Sparkles } from 'lucide-react';
import type { Rarity } from '@/domain/shop';
import { cx } from '@/lib/cx';
import styles from './TitleBadge.module.css';

/** A profile title, styled by its rarity. */
export function TitleBadge({
  name,
  rarity,
  size = 'small',
  className,
}: {
  name: string;
  rarity: Rarity;
  size?: 'small' | 'large';
  className?: string;
}) {
  return (
    <span className={cx(styles.badge, styles[size], className)} data-rarity={rarity}>
      {rarity === 'legendary' && <Sparkles aria-hidden="true" className={styles.icon} />}
      {name}
    </span>
  );
}
