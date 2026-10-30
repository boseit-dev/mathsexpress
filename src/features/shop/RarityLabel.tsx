import { Gem } from 'lucide-react';
import { RARITY_LABELS, type Rarity } from '@/domain/shop';
import { cx } from '@/lib/cx';
import styles from './RarityLabel.module.css';

export function RarityLabel({ rarity, className }: { rarity: Rarity; className?: string }) {
  return (
    <span className={cx(styles.rarity, className)} data-rarity={rarity}>
      <Gem aria-hidden="true" />
      {RARITY_LABELS[rarity]}
    </span>
  );
}
