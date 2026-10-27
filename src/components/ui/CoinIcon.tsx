import styles from './CoinIcon.module.css';

/** The MathsExpress coin. Decorative: always pair it with the amount in text. */
export function CoinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false">
      <circle className={styles.face} cx="10" cy="10" r="8.75" strokeWidth="1.5" />
      <circle className={styles.mark} cx="10" cy="10" r="5.25" strokeWidth="1.25" />
      <path className={styles.mark} d="M10 7.5v5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
