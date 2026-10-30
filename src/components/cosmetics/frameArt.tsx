import { C, sparklePath, starPath, type Draw } from './artKit';
import styles from './Cosmetics.module.css';

/*
 * Frames ring the round portrait: centre (50, 50), portrait radius 42. They are drawn on top
 * of the portrait and may reach out to radius 49.
 */

function ring(colour: string, width: number, r = 44.5) {
  return <circle cx={50} cy={50} r={r} fill="none" stroke={colour} strokeWidth={width} />;
}

/** Points evenly round the ring, for beads, stars and gems. */
function around(count: number, radius: number, offset = 0) {
  return Array.from({ length: count }, (_, index) => {
    const angle = ((index / count) * 360 + offset) * (Math.PI / 180);
    return {
      key: index,
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
      angle: (index / count) * 360 + offset,
    };
  });
}

const classic: Draw = () => ring(C.primary, 4);

const starlight: Draw = () => (
  <g>
    {ring(C.sky, 3.4)}
    {around(6, 44.5, -90).map(({ key, x, y }) => (
      <path
        key={key}
        d={sparklePath(x, y, key % 2 ? 3.4 : 4.6)}
        fill={key % 2 ? C.white : C.goldLight}
        stroke={C.primary}
        strokeWidth={0.6}
      />
    ))}
  </g>
);

const skyFrame: Draw = () => (
  <g>
    {ring(C.sky, 5)}
    {ring(C.white, 1.2, 42.6)}
  </g>
);

const royal: Draw = () => (
  <g>
    {ring(C.soft, 7.5, 45)}
    {ring(C.violet, 4, 44)}
  </g>
);

const sunrise: Draw = (id) => (
  <g>
    <defs>
      <linearGradient id={id('sun')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.goldLight} />
        <stop offset="0.5" stopColor={C.gold} />
        <stop offset="1" stopColor={C.orange} />
      </linearGradient>
    </defs>
    <circle cx={50} cy={50} r={44.5} fill="none" stroke={`url(#${id('sun')})`} strokeWidth={5} />
  </g>
);

const lavenderGlow: Draw = (id) => (
  <g>
    <defs>
      <filter id={id('glow')} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation={2.2} />
      </filter>
    </defs>
    <circle
      cx={50}
      cy={50}
      r={45}
      fill="none"
      stroke="#B59CFF"
      strokeWidth={6}
      filter={`url(#${id('glow')})`}
      className={styles.pulse}
    />
    {ring(C.pale, 2.6)}
  </g>
);

const RAINBOW = [C.red, C.orange, C.gold, C.mint, C.sky, C.violet];

const rainbow: Draw = () => {
  const length = 2 * Math.PI * 44.5;
  const part = length / RAINBOW.length;
  return (
    <g transform="rotate(-90 50 50)">
      {RAINBOW.map((colour, index) => (
        <circle
          key={colour}
          cx={50}
          cy={50}
          r={44.5}
          fill="none"
          stroke={colour}
          strokeWidth={5}
          strokeDasharray={`${part + 0.5} ${length}`}
          strokeDashoffset={-index * part}
        />
      ))}
    </g>
  );
};

const electric: Draw = (id) => {
  const points = around(36, 0).map(({ key, angle }) => {
    const radius = key % 2 ? 42.5 : 47;
    const rad = (angle * Math.PI) / 180;
    return `${(50 + radius * Math.cos(rad)).toFixed(2)} ${(50 + radius * Math.sin(rad)).toFixed(2)}`;
  });
  return (
    <g>
      <defs>
        <filter id={id('glow')} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={1.4} />
        </filter>
      </defs>
      {ring(C.primary, 3)}
      <path
        d={`M${points.join('L')}Z`}
        fill="none"
        stroke={C.cyan}
        strokeWidth={2.6}
        filter={`url(#${id('glow')})`}
        className={styles.flicker}
      />
      <path
        d={`M${points.join('L')}Z`}
        fill="none"
        stroke={C.white}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </g>
  );
};

const crystal: Draw = () => {
  const outer = around(12, 48, -90);
  const inner = around(12, 41.5, -75);
  return (
    <g>
      {outer.map(({ key, x, y }) => {
        const next = outer[(key + 1) % outer.length];
        const facet = inner[key];
        if (!next || !facet) return null;
        return (
          <path
            key={key}
            d={`M${x} ${y}L${next.x} ${next.y}L${facet.x} ${facet.y}Z`}
            fill={key % 2 ? '#CDE6FF' : '#9FC8F2'}
            stroke={C.white}
            strokeWidth={0.6}
            opacity={0.95}
          />
        );
      })}
      {ring(C.white, 1, 41.5)}
    </g>
  );
};

const golden: Draw = (id) => (
  <g>
    <defs>
      <linearGradient id={id('gold')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.goldLight} />
        <stop offset="0.45" stopColor={C.gold} />
        <stop offset="0.55" stopColor={C.goldDark} />
        <stop offset="1" stopColor={C.gold} />
      </linearGradient>
    </defs>
    <circle cx={50} cy={50} r={45} fill="none" stroke={`url(#${id('gold')})`} strokeWidth={7} />
    {ring(C.goldDark, 0.8, 41.6)}
    {around(16, 45).map(({ key, x, y }) => (
      <circle key={key} cx={x} cy={y} r={1} fill={C.white} opacity={0.75} />
    ))}
  </g>
);

const cosmic: Draw = (id) => (
  <g>
    <defs>
      <linearGradient id={id('space')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.night} />
        <stop offset="0.5" stopColor={C.violet} />
        <stop offset="1" stopColor={C.primary} />
      </linearGradient>
    </defs>
    <circle cx={50} cy={50} r={45} fill="none" stroke={`url(#${id('space')})`} strokeWidth={7} />
    <g className={styles.spinSlow}>
      {around(14, 45, 10).map(({ key, x, y }) => (
        <circle key={key} cx={x} cy={y} r={key % 3 === 0 ? 1.2 : 0.7} fill={C.white} />
      ))}
    </g>
  </g>
);

const diamond: Draw = () => (
  <g>
    {ring(C.silver, 6, 45)}
    {ring(C.silverDark, 0.8, 41.8)}
    {around(8, 45, -90).map(({ key, x, y, angle }) => (
      <g key={key} transform={`rotate(${angle + 90} ${x} ${y})`}>
        <path
          d={`M${x} ${y - 5}L${x + 4} ${y}L${x} ${y + 5}L${x - 4} ${y}Z`}
          fill="#DDF3FF"
          stroke={C.sky}
          strokeWidth={0.8}
        />
        <path d={`M${x} ${y - 5}L${x + 4} ${y}L${x} ${y}Z`} fill={C.white} opacity={0.8} />
      </g>
    ))}
  </g>
);

const starOrbit: Draw = () => (
  <g>
    {ring(C.primary, 3)}
    {ring(C.goldLight, 1, 47.4)}
    <g className={styles.spin}>
      {around(5, 45.5, -90).map(({ key, x, y }) => (
        <path
          key={key}
          d={starPath(x, y, key === 0 ? 5.4 : 3.8, key === 0 ? 2.4 : 1.7)}
          fill={C.gold}
          stroke={C.goldDark}
          strokeWidth={0.6}
        />
      ))}
    </g>
  </g>
);

export const FRAME_ART: Record<string, Draw> = {
  'frame-classic': classic,
  'frame-starlight': starlight,
  'frame-sky': skyFrame,
  'frame-royal': royal,
  'frame-sunrise': sunrise,
  'frame-lavender-glow': lavenderGlow,
  'frame-rainbow': rainbow,
  'frame-electric': electric,
  'frame-crystal': crystal,
  'frame-golden': golden,
  'frame-cosmic': cosmic,
  'frame-diamond': diamond,
  'frame-star-orbit': starOrbit,
};
