import styles from './BrandMark.module.css';

/** The MathsExpress symbol: a rising line on the primary tile. Decorative. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect className={styles.tile} width="32" height="32" rx="8" />
      <path className={styles.line} d="M7.5 21.5 13 15l4 3.5 7-8" />
      <path className={styles.line} d="M19 10.5h5v5" />
    </svg>
  );
}
