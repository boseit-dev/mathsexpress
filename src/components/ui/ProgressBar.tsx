import { clamp, toPercent } from '@/lib/math';
import { cx } from '@/lib/cx';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max: number;
  /** Accessible name, e.g. "Solving linear equations progress". */
  label: string;
  /** Spoken value, e.g. "7 of 12 questions". Defaults to the percentage. */
  valueText?: string;
  tone?: 'brand' | 'success' | 'inverse';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  valueText,
  tone = 'brand',
  size = 'medium',
  className,
}: ProgressBarProps) {
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
      className={cx(styles.track, styles[tone], styles[size], className)}
    >
      <div className={styles.fill} style={{ inlineSize: `${percent}%` }} />
    </div>
  );
}
