import { useId } from 'react';
import styles from './BrandMark.module.css';

/** The MathsExpress symbol: a plus sign and a dot over a smile. Decorative. */
export function BrandMark({ className }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id={gradientId}
          x1="12"
          y1="0"
          x2="34"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" className={styles.gradientStart} />
          <stop offset="1" className={styles.gradientEnd} />
        </linearGradient>
      </defs>
      <path className={styles.plus} d="M10 4.5v12M4 10.5h12" />
      <circle className={styles.dot} cx="31.5" cy="9" r="3.5" />
      <path
        className={styles.smile}
        d="M14 21.5c4.5 5.5 13 5.5 17.5-1.5"
        stroke={`url(#${gradientId})`}
      />
    </svg>
  );
}
