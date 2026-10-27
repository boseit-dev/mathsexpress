import styles from './TopicArt.module.css';

const gridPath = [
  ...[30, 60, 90, 120, 150, 180, 210].map((x) => `M${x} 8V104`),
  ...[20, 44, 68, 92].map((y) => `M12 ${y}H228`),
].join('');

/** Original artwork for a recommended topic: a parabola crossing the axis at its two roots. */
export function TopicArt() {
  return (
    <svg viewBox="0 0 240 112" className={styles.art} aria-hidden="true" focusable="false">
      <path className={styles.grid} d={gridPath} />
      <path className={styles.axis} d="M16 68H224M120 10V104" />
      <path className={styles.curve} d="M58 14Q120 140 182 14" />
      <circle className={styles.root} cx="78" cy="68" r="7" />
      <circle className={styles.root} cx="162" cy="68" r="7" />
    </svg>
  );
}
