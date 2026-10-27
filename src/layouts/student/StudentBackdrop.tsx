import { useId } from 'react';
import styles from './StudentBackdrop.module.css';

const WIDTH = 1440;
const HEIGHT = 900;
const GRID_SPACING = 48;
const GRID_DEPTH = 624;

// Faint graph paper across the upper part of the scene.
const gridPath = [
  ...Array.from(
    { length: WIDTH / GRID_SPACING + 1 },
    (_, i) => `M${i * GRID_SPACING} 0V${GRID_DEPTH}`,
  ),
  ...Array.from(
    { length: GRID_DEPTH / GRID_SPACING + 1 },
    (_, i) => `M0 ${i * GRID_SPACING}H${WIDTH}`,
  ),
].join('');

/**
 * Original MathsExpress scenery for the student area: a lavender sky on graph paper, floating
 * maths shapes and rolling hills in the brand blues. Drawn behind the white panels, never
 * behind text, so it does not affect readability.
 */
export function StudentBackdrop() {
  const skyId = useId();

  return (
    <svg
      className={styles.backdrop}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={styles.skyTop} />
          <stop offset="1" className={styles.skyBottom} />
        </linearGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill={`url(#${skyId})`} />
      <circle className={styles.glowSoft} cx="170" cy="180" r="240" />
      <circle className={styles.glowBright} cx="1320" cy="130" r="290" />
      <path className={styles.grid} d={gridPath} />
      <path className={styles.curve} d="M-40 560Q720 -60 1480 560" />
      {/* Plus signs, triangles and circles: the building blocks of the logo and of maths. */}
      <path
        className={styles.shape}
        d="M250 380v40M230 400h40M1196 300v40M1176 320h40M960 120v32M944 136h32"
      />
      <path className={styles.shape} d="M96 600l34-58 34 58zM1270 560l30-52 30 52z" />
      <circle className={styles.shape} cx="650" cy="96" r="18" />
      <circle className={styles.shape} cx="1110" cy="610" r="14" />
      <path
        className={styles.hillBack}
        d="M0 690C240 610 420 630 620 680S1040 760 1240 690 1440 640 1440 640V900H0Z"
      />
      <path
        className={styles.hillMiddle}
        d="M0 770C200 720 380 728 560 768S940 840 1160 780 1440 736 1440 736V900H0Z"
      />
      <path
        className={styles.hillFront}
        d="M0 842C260 800 520 808 760 842S1200 884 1440 828V900H0Z"
      />
    </svg>
  );
}
