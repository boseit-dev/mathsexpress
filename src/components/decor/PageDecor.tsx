import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import { arrangementFor, type DecorColour, type DecorVariant } from './decorArrangements';
import styles from './PageDecor.module.css';

const COLOUR: Record<DecorColour, string> = {
  primary: 'var(--color-brand-primary)',
  secondary: 'var(--color-brand-secondary)',
  muted: 'var(--color-brand-muted)',
  soft: 'var(--color-brand-soft)',
  lavender: 'var(--color-brand-pale)',
};

/** A tall, smooth wave, drawn once and reused for every squiggle. */
const WAVE = 'M30 0C58 34 2 76 30 116S58 198 30 238S2 318 30 360';

/**
 * Decorative background motion: squiggles that sway and bend near the edges, small dots that
 * drift and pulse, and a few soft shapes. Purely visual: behind everything, never clickable,
 * hidden from screen readers, and still (but visible) for reduced motion.
 */
export function PageDecor({ variant }: { variant: DecorVariant }) {
  const { squiggles, dots, shapes } = arrangementFor(variant);

  return (
    <div className={styles.layer} aria-hidden="true" data-decor={variant}>
      {squiggles.map((squiggle, i) => (
        <svg
          key={`squiggle-${i}`}
          className={cx(styles.squiggle, styles[squiggle.side])}
          viewBox="0 0 60 360"
          style={
            {
              top: `${squiggle.top}%`,
              '--colour': COLOUR[squiggle.colour],
              '--speed': `${squiggle.speed}s`,
            } as CSSProperties
          }
        >
          <g className={styles.sway}>
            <g className={styles.bend}>
              <path d={WAVE} className={styles.line} />
              <path d={WAVE} className={styles.flow} />
            </g>
          </g>
        </svg>
      ))}
      {dots.map((dot, i) => (
        <span
          key={`dot-${i}`}
          className={cx(styles.dot, dot.x > 5 && dot.x < 95 && styles.inner)}
          style={
            {
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              '--size': `${dot.size}px`,
              '--colour': COLOUR[dot.colour],
              '--duration': `${dot.duration}s`,
              '--delay': `${dot.delay}s`,
              '--dx': dot.drift === 'down' ? '0px' : dot.drift === 'left' ? '-34px' : '34px',
              '--peak': String(0.35 + (dot.size / 12) * 0.35),
            } as CSSProperties
          }
        />
      ))}
      {shapes.map((shape, i) => (
        <svg
          key={`shape-${i}`}
          className={cx(styles.shape, styles[shape.kind])}
          viewBox="0 0 100 100"
          style={
            {
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              '--size': `${shape.size}px`,
              '--colour': COLOUR[shape.colour],
              '--duration': `${shape.duration}s`,
            } as CSSProperties
          }
        >
          {shape.kind === 'ring' && <circle cx="50" cy="50" r="40" />}
          {shape.kind === 'arc' && <path d="M10 90A80 80 0 0 1 90 10" />}
          {shape.kind === 'plus' && <path d="M50 18V82M18 50H82" />}
          {shape.kind === 'blob' && (
            <path d="M52 6C74 6 94 22 94 46S78 94 50 94 6 76 8 50 30 6 52 6Z" />
          )}
        </svg>
      ))}
    </div>
  );
}
