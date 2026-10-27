import styles from './HeroIllustration.module.css';

/** A four-pointed sparkle centred on (x, y). */
function sparklePath(x: number, y: number, size: number): string {
  return `M${x} ${y - size}Q${x} ${y} ${x + size} ${y}Q${x} ${y} ${x} ${y + size}Q${x} ${y} ${x - size} ${y}Q${x} ${y} ${x} ${y - size}Z`;
}

const GRID_COLUMNS = [92, 116, 140, 164, 188, 212, 236];
const GRID_ROWS = [64, 88, 112, 136, 160];
const gridPath = [
  ...GRID_COLUMNS.map((x) => `M${x} 52V168`),
  ...GRID_ROWS.map((y) => `M80 ${y}H256`),
].join('');

/**
 * Original MathsExpress artwork for the welcome banner: a rising graph on squared paper with
 * an algebra tile, a triangle and a stack of coins. Purely decorative.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 220" className={className} aria-hidden="true" focusable="false">
      <circle className={styles.disc} cx="196" cy="112" r="104" />
      <g transform="rotate(-4 168 110)">
        <rect className={styles.cardShadow} x="74" y="48" width="200" height="140" rx="18" />
        <rect className={styles.card} x="68" y="40" width="200" height="140" rx="18" />
        <path className={styles.gridLines} d={gridPath} />
        <path className={styles.axes} d="M84 156H252M96 52V168" />
        <path className={styles.curve} d="M100 150C140 148 170 120 196 98S236 64 252 58" />
        <circle className={styles.point} cx="100" cy="150" r="6" />
        <circle className={styles.point} cx="196" cy="98" r="6" />
        <circle className={styles.point} cx="252" cy="58" r="6" />
      </g>
      <rect className={styles.tile} x="22" y="28" width="60" height="46" rx="12" />
      <text className={styles.tileText} x="52" y="59" textAnchor="middle">
        x²
      </text>
      <polygon className={styles.triangle} points="34,198 86,198 60,154" />
      <ellipse className={styles.coinRim} cx="282" cy="202" rx="20" ry="7" />
      <ellipse className={styles.coinFace} cx="282" cy="198" rx="20" ry="7" />
      <ellipse className={styles.coinRim} cx="282" cy="191" rx="20" ry="7" />
      <ellipse className={styles.coinFace} cx="282" cy="187" rx="20" ry="7" />
      <ellipse className={styles.coinRim} cx="282" cy="180" rx="20" ry="7" />
      <ellipse className={styles.coinFace} cx="282" cy="176" rx="20" ry="7" />
      <ellipse className={styles.coinMark} cx="282" cy="176" rx="11" ry="3.5" />
      <path className={styles.sparkle} d={sparklePath(298, 38, 10)} />
      <path className={styles.sparkle} d={sparklePath(30, 120, 7)} />
    </svg>
  );
}
