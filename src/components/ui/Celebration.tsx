import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import styles from './Celebration.module.css';

// Small geometric maths shapes in brand colours: a plus, a times sign, a triangle and a circle.
const SHAPES = ['plus', 'times', 'triangle', 'circle'] as const;
const PIECES = Array.from({ length: 12 }, (_, i) => ({
  shape: SHAPES[i % SHAPES.length],
  angle: i * 30 + (i % 2) * 12,
  distance: 56 + (i % 3) * 18,
}));

/**
 * A single, short burst for a genuinely completed task. Decorative only: hidden from screen
 * readers, never loops, and removed entirely for reduced motion.
 */
export function Celebration() {
  return (
    <span className={styles.burst} aria-hidden="true">
      {PIECES.map(({ shape, angle, distance }, i) => (
        <span
          key={i}
          className={cx(styles.piece, shape && styles[shape])}
          style={
            {
              '--angle': `${angle}deg`,
              '--distance': `${distance}px`,
              '--delay': `${(i % 4) * 30}ms`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
