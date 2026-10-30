import type { CSSProperties } from 'react';
import { sparklePath } from '@/components/cosmetics/artKit';
import { CoinIcon } from '@/components/ui/CoinIcon';
import styles from './PurchaseCelebration.module.css';

const BURST = Array.from({ length: 10 }, (_, index) => {
  const angle = (index / 10) * Math.PI * 2;
  const distance = 70 + (index % 3) * 18;
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    delay: (index % 4) * 40,
  };
});

/** Coins and sparkles burst out once when a purchase succeeds. Decorative only. */
export function PurchaseCelebration() {
  return (
    <div className={styles.burst} aria-hidden="true">
      {BURST.map(({ x, y, delay }, index) => (
        <span
          key={index}
          className={styles.coin}
          style={{ '--x': `${x}px`, '--y': `${y}px`, '--delay': `${delay}ms` } as CSSProperties}
        >
          {index % 3 === 0 ? (
            <svg viewBox="-10 -10 20 20" className={styles.sparkle}>
              <path d={sparklePath(0, 0, 9)} fill="#FFE08A" />
            </svg>
          ) : (
            <CoinIcon />
          )}
        </span>
      ))}
    </div>
  );
}
