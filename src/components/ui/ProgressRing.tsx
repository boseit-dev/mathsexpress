import { clamp, toPercent } from '@/lib/math';
import { cx } from '@/lib/cx';
import styles from './ProgressRing.module.css';

const RADIUS = 20;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ProgressRingProps {
  value: number;
  max: number;
  /** Accessible name, e.g. "Solving linear equations progress". */
  label: string;
  /** Spoken value, e.g. "7 of 12 questions". Defaults to the percentage. */
  valueText?: string;
  className?: string;
}

/** Circular progress with the percentage in the middle. */
export function ProgressRing({ value, max, label, valueText, className }: ProgressRingProps) {
  const safeMax = Math.max(max, 0);
  const percent = toPercent(value, safeMax);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamp(value, 0, safeMax)}
      aria-valuetext={valueText ?? `${percent}%`}
      className={cx(styles.ring, className)}
    >
      <svg viewBox="0 0 48 48" className={styles.svg} aria-hidden="true" focusable="false">
        <circle className={styles.track} cx="24" cy="24" r={RADIUS} strokeWidth={STROKE_WIDTH} />
        {percent > 0 && (
          <circle
            className={styles.fill}
            cx="24"
            cy="24"
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${(percent / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          />
        )}
      </svg>
      <span className={styles.centre} aria-hidden="true">
        {percent}%
      </span>
    </div>
  );
}
