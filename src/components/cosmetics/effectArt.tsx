import type { CSSProperties } from 'react';
import { C, sparklePath, starPath, type Draw } from './artKit';
import styles from './Cosmetics.module.css';

/*
 * Effects are light particle layers in a 100 × 100 box around the portrait. They move slowly,
 * stay small and mostly keep to the edges so they never cover the face. Glows sit behind the
 * avatar; particles sit in front.
 */
export type EffectLayer = 'behind' | 'front';

export interface EffectArt {
  layer: EffectLayer;
  draw: Draw;
}

function delay(index: number, step = 0.7): CSSProperties {
  return { '--delay': `${(-index * step).toFixed(2)}s` } as CSSProperties;
}

/** Spots near the edge of the box, by a fixed pattern. */
const EDGE_SPOTS = [
  [12, 18],
  [86, 14],
  [92, 46],
  [8, 52],
  [20, 84],
  [80, 86],
  [52, 6],
  [64, 94],
  [34, 92],
  [94, 70],
] as const;

const sparkles: Draw = () => (
  <g>
    {EDGE_SPOTS.slice(0, 5).map(([x, y], index) => (
      <path
        key={index}
        d={sparklePath(x, y, index % 2 ? 3 : 4.2)}
        fill={index % 2 ? C.goldLight : C.white}
        className={styles.twinkle}
        style={delay(index, 0.5)}
      />
    ))}
  </g>
);

const bubbles: Draw = () => (
  <g>
    {[10, 24, 78, 90, 16, 84].map((x, index) => (
      <circle
        key={index}
        cx={x}
        cy={96}
        r={2 + (index % 3)}
        fill={C.white}
        fillOpacity={0.15}
        stroke={C.white}
        strokeWidth={0.8}
        className={styles.rise}
        style={delay(index, 1)}
      />
    ))}
  </g>
);

const floatingStars: Draw = () => (
  <g>
    {EDGE_SPOTS.slice(0, 6).map(([x, y], index) => (
      <g key={index} className={styles.drift} style={delay(index, 0.8)}>
        <path d={starPath(x, y, index % 2 ? 2.6 : 3.6, index % 2 ? 1.1 : 1.5)} fill={C.gold} />
      </g>
    ))}
  </g>
);

const snowfall: Draw = () => (
  <g>
    {[6, 18, 30, 72, 84, 94, 44, 58].map((x, index) => (
      <circle
        key={index}
        cx={x}
        cy={4}
        r={index % 3 === 0 ? 1.8 : 1.2}
        fill={C.white}
        className={styles.fall}
        style={delay(index, 0.9)}
      />
    ))}
  </g>
);

const mathsSymbols: Draw = () => (
  <g fontFamily="system-ui, sans-serif" fontWeight={800} fontSize={9}>
    {(['+', '−', '×', '÷', '=', '%'] as const).map((symbol, index) => {
      const [x, y] = EDGE_SPOTS[index] ?? [0, 0];
      return (
        <g key={symbol} className={styles.drift} style={delay(index, 0.9)}>
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={index % 2 ? C.sky : C.white}
            opacity={0.9}
          >
            {symbol}
          </text>
        </g>
      );
    })}
  </g>
);

const CONFETTI = [C.red, C.gold, C.mint, C.sky, C.violet, C.orange];

const confetti: Draw = () => (
  <g>
    {[8, 20, 34, 66, 80, 92, 50, 14].map((x, index) => (
      <rect
        key={index}
        x={x}
        y={2}
        width={2.6}
        height={1.6}
        rx={0.4}
        fill={CONFETTI[index % CONFETTI.length]}
        className={styles.fall}
        style={delay(index, 0.8)}
      />
    ))}
  </g>
);

const fireflies: Draw = (id) => (
  <g>
    <defs>
      <radialGradient id={id('fly')}>
        <stop offset="0" stopColor="#FFF3A0" />
        <stop offset="1" stopColor="#FFD54A" stopOpacity={0} />
      </radialGradient>
    </defs>
    {EDGE_SPOTS.slice(0, 7).map(([x, y], index) => (
      <g key={index} className={styles.drift} style={delay(index, 1.1)}>
        <circle
          cx={x}
          cy={y}
          r={4}
          fill={`url(#${id('fly')})`}
          className={styles.flicker}
          style={delay(index, 0.6)}
        />
      </g>
    ))}
  </g>
);

const rainbowParticles: Draw = () => (
  <g>
    {EDGE_SPOTS.map(([x, y], index) => (
      <circle
        key={index}
        cx={x}
        cy={y}
        r={1.6}
        fill={CONFETTI[index % CONFETTI.length]}
        className={styles.twinkle}
        style={delay(index, 0.35)}
      />
    ))}
  </g>
);

const softLightning: Draw = (id) => (
  <g>
    <defs>
      <filter id={id('glow')} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={1.2} />
      </filter>
    </defs>
    <g className={styles.flash} style={delay(0)}>
      <path
        d="M14 6L8 20H13L7 34"
        fill="none"
        stroke={C.cyan}
        strokeWidth={2.4}
        filter={`url(#${id('glow')})`}
        strokeLinejoin="round"
      />
      <path
        d="M14 6L8 20H13L7 34"
        fill="none"
        stroke={C.white}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
    </g>
    <g className={styles.flash} style={delay(2.4, 1)}>
      <path
        d="M88 60L94 72H89L95 86"
        fill="none"
        stroke={C.cyan}
        strokeWidth={2.4}
        filter={`url(#${id('glow')})`}
        strokeLinejoin="round"
      />
      <path
        d="M88 60L94 72H89L95 86"
        fill="none"
        stroke={C.white}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
    </g>
  </g>
);

const colourTrail: Draw = (id) => (
  <g>
    <defs>
      <linearGradient id={id('trail')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.sky} />
        <stop offset="0.5" stopColor={C.violet} />
        <stop offset="1" stopColor="#FF7AD9" />
      </linearGradient>
    </defs>
    <path
      d="M8 70C2 40 26 8 54 6C84 4 98 30 94 54C90 80 66 96 40 94"
      fill="none"
      stroke={`url(#${id('trail')})`}
      strokeWidth={2.6}
      strokeLinecap="round"
      className={styles.dash}
      opacity={0.85}
    />
  </g>
);

const auroraGlow: Draw = (id) => (
  <g>
    <defs>
      <linearGradient id={id('aurora')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.mint} stopOpacity={0.7} />
        <stop offset="1" stopColor="#B59CFF" stopOpacity={0} />
      </linearGradient>
    </defs>
    <g className={styles.sway}>
      <path d="M-10 28Q20 0 50 18T110 12V44Q80 30 50 44T-10 40Z" fill={`url(#${id('aurora')})`} />
    </g>
  </g>
);

const goldenAura: Draw = (id) => (
  <g>
    <defs>
      <radialGradient id={id('aura')}>
        <stop offset="0.55" stopColor={C.goldLight} stopOpacity={0.85} />
        <stop offset="1" stopColor={C.goldLight} stopOpacity={0} />
      </radialGradient>
    </defs>
    <g className={styles.spinSlow}>
      {Array.from({ length: 12 }, (_, index) => (
        <path
          key={index}
          d="M50 50L47 2H53Z"
          fill={C.goldLight}
          opacity={0.4}
          transform={`rotate(${index * 30} 50 50)`}
        />
      ))}
    </g>
    <circle cx={50} cy={50} r={50} fill={`url(#${id('aura')})`} className={styles.pulse} />
  </g>
);

function heartPath(x: number, y: number, size: number) {
  const s = size;
  return `M${x} ${y + s * 0.9}C${x - s * 1.6} ${y - s * 0.2} ${x - s * 0.6} ${y - s * 1.3} ${x} ${y - s * 0.4}C${x + s * 0.6} ${y - s * 1.3} ${x + s * 1.6} ${y - s * 0.2} ${x} ${y + s * 0.9}Z`;
}

const hearts: Draw = () => (
  <g>
    {[12, 22, 80, 90, 18, 84].map((x, index) => (
      <path
        key={index}
        d={heartPath(x, 94, index % 2 ? 2.4 : 3.2)}
        fill={index % 2 ? C.pink : C.red}
        opacity={0.9}
        className={styles.rise}
        style={delay(index, 1)}
      />
    ))}
  </g>
);

const fallingLeaves: Draw = () => (
  <g>
    {[8, 22, 36, 66, 80, 92].map((x, index) => (
      <ellipse
        key={index}
        cx={x}
        cy={4}
        rx={2.6}
        ry={1.4}
        fill={[C.orange, C.gold, C.red][index % 3]}
        className={styles.fall}
        style={delay(index, 1.1)}
      />
    ))}
  </g>
);

const numberRain: Draw = () => (
  <g fontFamily="ui-monospace, monospace" fontWeight={700} fontSize={6}>
    {[6, 16, 26, 74, 84, 94].map((x, index) => (
      <text
        key={index}
        x={x}
        y={4}
        textAnchor="middle"
        fill={index % 2 ? C.cyan : C.mint}
        className={styles.fall}
        style={delay(index, 1.2)}
      >
        {(index * 3 + 1) % 10}
      </text>
    ))}
  </g>
);

export const EFFECT_ART: Record<string, EffectArt> = {
  'fx-sparkles': { layer: 'front', draw: sparkles },
  'fx-bubbles': { layer: 'front', draw: bubbles },
  'fx-floating-stars': { layer: 'front', draw: floatingStars },
  'fx-hearts': { layer: 'front', draw: hearts },
  'fx-snowfall': { layer: 'front', draw: snowfall },
  'fx-maths-symbols': { layer: 'front', draw: mathsSymbols },
  'fx-confetti': { layer: 'front', draw: confetti },
  'fx-fireflies': { layer: 'front', draw: fireflies },
  'fx-falling-leaves': { layer: 'front', draw: fallingLeaves },
  'fx-rainbow-particles': { layer: 'front', draw: rainbowParticles },
  'fx-soft-lightning': { layer: 'front', draw: softLightning },
  'fx-number-rain': { layer: 'front', draw: numberRain },
  'fx-colour-trail': { layer: 'front', draw: colourTrail },
  'fx-aurora-glow': { layer: 'behind', draw: auroraGlow },
  'fx-golden-aura': { layer: 'behind', draw: goldenAura },
};
