import { sparklePath, starPath } from '@/components/cosmetics/artKit';
import styles from './ShopDecor.module.css';

/** Floating dots, stars and squiggles behind the shop heading. Decorative only. */
export function ShopDecor() {
  return (
    <svg
      className={styles.decor}
      viewBox="0 0 400 160"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.slow}>
        <path
          d="M250 30q12 -14 24 0t24 0t24 0"
          fill="none"
          stroke="#ADBBDA"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.7}
        />
      </g>
      <g className={styles.drift}>
        <path d={starPath(368, 34, 9, 4)} fill="#F2B630" />
      </g>
      <g className={styles.driftAlt}>
        <circle cx={330} cy={120} r={6} fill="#EDE8F5" opacity={0.75} />
        <circle cx={214} cy={130} r={3.5} fill="#7091E6" />
      </g>
      <g className={styles.twinkle}>
        <path d={sparklePath(290, 92, 7)} fill="#FFFFFF" />
      </g>
      <g className={styles.twinkleLate}>
        <path d={sparklePath(384, 98, 5)} fill="#FFE08A" />
      </g>
      <g className={styles.slow}>
        <path
          d="M188 70q8 10 16 0t16 0"
          fill="none"
          stroke="#7091E6"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.6}
        />
        <circle
          cx={380}
          cy={140}
          r={10}
          fill="none"
          stroke="#ADBBDA"
          strokeWidth={2}
          opacity={0.6}
        />
      </g>
    </svg>
  );
}
