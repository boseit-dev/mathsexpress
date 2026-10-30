import { C, sparklePath, starPath, type Draw } from './artKit';

/*
 * Accessories are drawn around (0, 0) and placed on the portrait by their slot, so one drawing
 * works on every avatar: hats on the top of the head, glasses on the eye line, held items as a
 * sticker at the bottom right and pets on the left shoulder.
 */
export type AccessorySlot =
  'hat' | 'face' | 'ears' | 'neck' | 'helmet' | 'halo' | 'held' | 'shoulder';

export const SLOT_PLACEMENT: Record<AccessorySlot, string> = {
  hat: 'translate(50 22) scale(0.85)',
  face: 'translate(50 40)',
  ears: 'translate(50 41)',
  neck: 'translate(50 70)',
  helmet: 'translate(50 42)',
  halo: 'translate(50 9)',
  held: 'translate(80 80) scale(0.62)',
  shoulder: 'translate(20 78) scale(0.6)',
};

/** The part of the drawing to show on its own, for shop cards. */
export const SLOT_VIEWBOX: Record<AccessorySlot, string> = {
  hat: '-24 -32 48 48',
  face: '-26 -26 52 52',
  ears: '-32 -34 64 64',
  neck: '-22 -22 44 44',
  helmet: '-36 -36 72 72',
  halo: '-22 -22 44 44',
  held: '-22 -22 44 44',
  shoulder: '-22 -22 44 44',
};

export interface AccessoryArt {
  slot: AccessorySlot;
  draw: Draw;
}

function ball(fill: string, line: string, patch: string): Draw {
  return () => (
    <g>
      <circle r={17} fill={fill} stroke={line} strokeWidth={1.6} />
      <path d={starPath(0, 0, 6.4, 5.2)} fill={patch} />
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d="M0 -6.4L0 -11" stroke={line} strokeWidth={1.2} />
          <path d="M-4 -15.6L0 -11L4 -15.6Q0 -17.5 -4 -15.6Z" fill={patch} />
        </g>
      ))}
      <path
        d="M-11 -9a14 14 0 0 1 8 -5"
        stroke={C.white}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.7}
        fill="none"
      />
    </g>
  );
}

const pencil: Draw = () => (
  <g transform="rotate(-40)">
    <rect x={-5} y={-18} width={10} height={26} fill={C.gold} />
    <rect x={-5} y={-18} width={3.3} height={26} fill={C.goldDark} opacity={0.35} />
    <path d="M-5 8L0 19L5 8Z" fill={C.sand} />
    <path d="M-1.8 15L0 19L1.8 15Z" fill={C.ink} />
    <rect x={-5} y={-22} width={10} height={4} fill={C.silver} />
    <rect x={-5} y={-27} width={10} height={5} rx={2} fill={C.pink} />
  </g>
);

const books: Draw = () => (
  <g>
    <rect x={-17} y={6} width={34} height={9} rx={1.5} fill={C.primary} />
    <rect x={-14} y={8} width={28} height={2} fill={C.pale} opacity={0.6} />
    <rect x={-14} y={-4} width={30} height={10} rx={1.5} fill={C.orange} transform="rotate(-4)" />
    <rect
      x={-12}
      y={-1.5}
      width={24}
      height={2}
      fill={C.white}
      opacity={0.6}
      transform="rotate(-4)"
    />
    <rect x={-15} y={-14} width={28} height={10} rx={1.5} fill={C.sky} transform="rotate(3)" />
    <rect
      x={-12}
      y={-11}
      width={22}
      height={2}
      fill={C.white}
      opacity={0.6}
      transform="rotate(3)"
    />
  </g>
);

const snowflake: Draw = () => (
  <g stroke={C.sky} strokeWidth={2.4} strokeLinecap="round" fill="none">
    {[0, 60, 120].map((angle) => (
      <path key={angle} d="M0 -17V17" transform={`rotate(${angle})`} />
    ))}
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <path
        key={angle}
        d="M-5 -14L0 -9L5 -14M-4 -6L0 -3L4 -6"
        transform={`rotate(${angle})`}
        strokeWidth={1.8}
      />
    ))}
    <circle r={3} fill={C.pale} stroke={C.primary} />
  </g>
);

const basketball: Draw = () => (
  <g>
    <circle r={17} fill={C.orange} />
    <g fill="none" stroke={C.brownDark} strokeWidth={1.5}>
      <path d="M-17 0H17M0 -17V17" />
      <path d="M-12 -12Q-4 0 -12 12M12 -12Q4 0 12 12" />
    </g>
    <path
      d="M-11 -9a14 14 0 0 1 8 -5"
      stroke={C.white}
      strokeWidth={2}
      strokeLinecap="round"
      opacity={0.5}
      fill="none"
    />
  </g>
);

const sunglasses: Draw = () => (
  <g>
    <path d="M-25 -3L-21 -2M25 -3L21 -2" stroke={C.navy} strokeWidth={2.4} strokeLinecap="round" />
    <rect
      x={-21}
      y={-7}
      width={17}
      height={13}
      rx={5.5}
      fill={C.primary}
      stroke={C.navy}
      strokeWidth={1.8}
    />
    <rect
      x={4}
      y={-7}
      width={17}
      height={13}
      rx={5.5}
      fill={C.primary}
      stroke={C.navy}
      strokeWidth={1.8}
    />
    <path d="M-4 -3Q0 -6 4 -3" stroke={C.navy} strokeWidth={2} fill="none" />
    <path d="M-17 -3L-12 -5M8 -3L13 -5" stroke={C.cyan} strokeWidth={2} strokeLinecap="round" />
  </g>
);

const calculator: Draw = () => (
  <g>
    <rect x={-13} y={-18} width={26} height={36} rx={4} fill={C.primary} />
    <rect x={-9} y={-14} width={18} height={9} rx={1.5} fill="#CFEFE2" />
    <text
      x={7}
      y={-7.2}
      textAnchor="end"
      fontSize={6.4}
      fontWeight={700}
      fill={C.navy}
      fontFamily="system-ui, sans-serif"
    >
      3.14
    </text>
    {[-1, 0, 1].map((col) =>
      [0, 1, 2].map((row) => (
        <rect
          key={`${col}-${row}`}
          x={col * 6.5 - 2.6}
          y={row * 6.5 - 1}
          width={5.2}
          height={4.6}
          rx={1.2}
          fill={row === 2 && col === 1 ? C.gold : C.soft}
        />
      )),
    )}
  </g>
);

const lightning: Draw = () => (
  <g>
    <path
      d="M4 -20L-11 3H-1L-6 20L11 -4H1Z"
      fill={C.gold}
      stroke={C.goldDark}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <path d="M2 -12L-5 0H1" stroke={C.goldLight} strokeWidth={1.6} fill="none" />
  </g>
);

const headphones: Draw = () => (
  <g>
    <path
      d="M-27 4C-27 -22 27 -22 27 4"
      fill="none"
      stroke={C.primary}
      strokeWidth={4.4}
      strokeLinecap="round"
    />
    <rect x={-32} y={-4} width={10} height={17} rx={4.5} fill={C.primary} />
    <rect x={22} y={-4} width={10} height={17} rx={4.5} fill={C.primary} />
    <rect x={-29} y={-1} width={5} height={11} rx={2.5} fill={C.sky} />
    <rect x={24} y={-1} width={5} height={11} rx={2.5} fill={C.sky} />
  </g>
);

const gradCap: Draw = () => (
  <g>
    <path d="M-15 -4V5Q0 10 15 5V-4Z" fill={C.navy} />
    <path d="M0 -16L-26 -6L0 4L26 -6Z" fill={C.night} />
    <path d="M0 -16L-26 -6L0 -2L26 -6Z" fill={C.navy} opacity={0.5} />
    <path d="M0 -6L18 -2V10" fill="none" stroke={C.gold} strokeWidth={1.6} />
    <path d="M16 10H20L19 16H17Z" fill={C.gold} />
    <circle cx={0} cy={-6} r={2} fill={C.gold} />
  </g>
);

const rainbowCloud: Draw = () => (
  <g>
    {[C.red, C.orange, C.gold, C.mint, C.sky, '#8752E8'].map((colour, index) => (
      <path
        key={colour}
        d={`M${-15 + index * 2} 4A${15 - index * 2} ${15 - index * 2} 0 0 1 ${15 - index * 2} 4`}
        fill="none"
        stroke={colour}
        strokeWidth={2}
      />
    ))}
    <g fill={C.white} stroke={C.soft} strokeWidth={1}>
      <path d="M-20 14a6 6 0 0 1 3-11a7 7 0 0 1 12-3a6 6 0 0 1 10 5a5 5 0 0 1 2 9Z" />
    </g>
  </g>
);

const miniRocket: Draw = () => (
  <g transform="rotate(30)">
    <path d="M-5 12Q0 24 5 12Z" fill={C.orange} />
    <path d="M-3 12Q0 19 3 12Z" fill={C.gold} />
    <path d="M-7 4L-13 13L-6 11ZM7 4L13 13L6 11Z" fill={C.primary} />
    <path d="M0 -20C8 -12 8 2 6 12H-6C-8 2 -8 -12 0 -20Z" fill={C.pale} />
    <path d="M0 -20C4 -16 6 -12 6.4 -9H-6.4C-6 -12 -4 -16 0 -20Z" fill={C.red} />
    <circle cy={-1} r={3.6} fill={C.sky} stroke={C.primary} strokeWidth={1.4} />
  </g>
);

const planet: Draw = () => (
  <g>
    <path
      d="M-20 4A22 7 -18 0 1 19 -9"
      fill="none"
      stroke={C.goldDark}
      strokeWidth={3}
      transform="rotate(-6)"
    />
    <circle r={12} fill="#8752E8" />
    <path d="M-10 -3Q0 1 11 -4M-11 5Q0 9 10 4" stroke="#B59CFF" strokeWidth={2} fill="none" />
    <path
      d="M-21 6A22 7 -18 0 0 21 -7"
      fill="none"
      stroke={C.gold}
      strokeWidth={3}
      transform="rotate(-6)"
    />
    <circle cx={-4} cy={-5} r={2.4} fill={C.white} opacity={0.4} />
  </g>
);

const wizardHat: Draw = () => (
  <g>
    <path d="M-17 2L2 -30Q6 -24 14 -22L18 2Z" fill="#5B3FA0" />
    <path d="M-8 -10L13 -10" stroke={C.gold} strokeWidth={3} />
    <ellipse cx={0} cy={2} rx={26} ry={5} fill="#4A3285" />
    <path d={starPath(4, -18, 3.4, 1.4)} fill={C.goldLight} />
    <path d={starPath(-6, -3, 2.6, 1.1)} fill={C.goldLight} />
    <path d={sparklePath(10, -4, 2.4)} fill={C.white} />
  </g>
);

const crystalOrb: Draw = (id) => (
  <g>
    <defs>
      <radialGradient id={id('orb')} cx="35%" cy="30%">
        <stop offset="0" stopColor={C.white} />
        <stop offset="0.35" stopColor="#B59CFF" />
        <stop offset="1" stopColor={C.primary} />
      </radialGradient>
    </defs>
    <path d="M-10 12H10L13 19H-13Z" fill={C.goldDark} />
    <rect x={-12} y={9} width={24} height={4} rx={2} fill={C.gold} />
    <circle cy={-3} r={14} fill={`url(#${id('orb')})`} />
    <path d={sparklePath(4, -4, 4)} fill={C.white} opacity={0.9} />
    <path d={sparklePath(-5, 2, 2.2)} fill={C.white} opacity={0.8} />
  </g>
);

const miniRobot: Draw = () => (
  <g>
    <rect x={-10} y={2} width={20} height={16} rx={4} fill={C.muted} />
    <circle cy={10} r={3} fill={C.cyan} />
    <path d="M0 -18V-12" stroke={C.muted} strokeWidth={2} />
    <circle cy={-19} r={2.6} fill={C.gold} />
    <rect x={-13} y={-13} width={26} height={17} rx={5} fill={C.soft} />
    <rect x={-9} y={-9} width={18} height={9} rx={3} fill={C.primary} />
    <circle cx={-4} cy={-4.5} r={2} fill={C.cyan} />
    <circle cx={4} cy={-4.5} r={2} fill={C.cyan} />
  </g>
);

const treasureChest: Draw = () => (
  <g>
    <circle cx={-6} cy={-8} r={4.4} fill={C.gold} stroke={C.goldDark} />
    <circle cx={3} cy={-10} r={4.4} fill={C.gold} stroke={C.goldDark} />
    <circle cx={10} cy={-7} r={4} fill={C.gold} stroke={C.goldDark} />
    <path
      d="M-18 -16Q0 -26 18 -16V-6H-18Z"
      fill={C.brown}
      transform="translate(0 -4) rotate(-12 -18 -6)"
    />
    <rect x={-18} y={-6} width={36} height={24} rx={2.5} fill={C.brown} />
    <rect x={-18} y={-6} width={36} height={5} fill={C.brownDark} />
    <path d="M-12 -6V18M12 -6V18" stroke={C.gold} strokeWidth={3} />
    <rect x={-4} y={-2} width={8} height={9} rx={1.5} fill={C.gold} />
    <circle cy={2.4} r={1.4} fill={C.brownDark} />
  </g>
);

const spaceHelmet: Draw = (id) => (
  <g>
    <defs>
      <radialGradient id={id('glass')} cx="35%" cy="28%" r="75%">
        <stop offset="0" stopColor={C.white} stopOpacity={0.32} />
        <stop offset="0.6" stopColor={C.white} stopOpacity={0.04} />
        <stop offset="1" stopColor={C.sky} stopOpacity={0.18} />
      </radialGradient>
    </defs>
    <circle r={31} fill={`url(#${id('glass')})`} stroke={C.silver} strokeWidth={3} />
    <path
      d="M-20 -14a24 24 0 0 1 14 -12"
      stroke={C.white}
      strokeWidth={3}
      strokeLinecap="round"
      fill="none"
      opacity={0.85}
    />
    <rect x={-22} y={25} width={44} height={8} rx={4} fill={C.silver} />
    <rect x={-22} y={28} width={44} height={2} fill={C.primary} />
    <circle cx={27} cy={-14} r={3} fill={C.red} />
  </g>
);

const crown: Draw = () => (
  <g>
    <path
      d="M-20 4L-22 -16L-11 -6L0 -20L11 -6L22 -16L20 4Z"
      fill={C.gold}
      stroke={C.goldDark}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <rect x={-20} y={0} width={40} height={6} rx={2} fill={C.goldDark} />
    <circle cx={0} cy={-6} r={3} fill={C.sky} stroke={C.primary} />
    <circle cx={-12} cy={-1} r={2.2} fill={C.red} />
    <circle cx={12} cy={-1} r={2.2} fill={C.red} />
    <circle cx={-22} cy={-17} r={2} fill={C.goldLight} />
    <circle cx={0} cy={-21} r={2} fill={C.goldLight} />
    <circle cx={22} cy={-17} r={2} fill={C.goldLight} />
  </g>
);

const trophy: Draw = () => (
  <g>
    <path
      d="M-11 -14H-18Q-19 -2 -8 0M11 -14H18Q19 -2 8 0"
      fill="none"
      stroke={C.goldDark}
      strokeWidth={2.6}
    />
    <path d="M-12 -18H12V-8Q12 4 0 6Q-12 4 -12 -8Z" fill={C.gold} />
    <path
      d="M-7 -15V-8Q-7 -2 -2 1"
      stroke={C.goldLight}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <rect x={-2.5} y={5} width={5} height={6} fill={C.goldDark} />
    <rect x={-10} y={11} width={20} height={7} rx={1.6} fill={C.navy} />
    <rect x={-6} y={13.5} width={12} height={2} rx={1} fill={C.gold} />
    <path d={starPath(0, -9, 3.6, 1.6)} fill={C.white} opacity={0.85} />
  </g>
);

const miniDragon: Draw = () => (
  <g>
    <path d="M-4 -6L-18 -18L-14 -8L-22 -6L-10 0Z" fill={C.greenDark} />
    <path d="M8 6Q20 10 18 18Q14 12 6 12Z" fill={C.green} />
    <ellipse cx={0} cy={6} rx={10} ry={11} fill={C.green} />
    <ellipse cx={0} cy={9} rx={6} ry={7} fill={C.sand} opacity={0.85} />
    <circle cx={2} cy={-9} r={9} fill={C.green} />
    <path d="M-4 -16L-6 -22L-1 -17ZM6 -17L9 -22L9 -15Z" fill={C.goldLight} />
    <ellipse cx={7} cy={-6} rx={5} ry={3.6} fill={C.leaf} />
    <circle cx={-1} cy={-10} r={2.2} fill={C.ink} />
    <circle cx={-0.4} cy={-10.8} r={0.7} fill={C.white} />
    <path
      d="M14 -6Q19 -8 18 -12"
      stroke={C.orange}
      strokeWidth={1.6}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

const infinityHalo: Draw = (id) => (
  <g>
    <defs>
      <filter id={id('glow')} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={1.6} />
      </filter>
    </defs>
    <path
      d="M0 0C-6 -8 -18 -8 -18 0C-18 8 -6 8 0 0C6 -8 18 -8 18 0C18 8 6 8 0 0Z"
      fill="none"
      stroke={C.goldLight}
      strokeWidth={5}
      filter={`url(#${id('glow')})`}
    />
    <path
      d="M0 0C-6 -8 -18 -8 -18 0C-18 8 -6 8 0 0C6 -8 18 -8 18 0C18 8 6 8 0 0Z"
      fill="none"
      stroke={C.gold}
      strokeWidth={2.6}
    />
    <path d={sparklePath(17, -8, 3)} fill={C.white} />
  </g>
);

const bowTie: Draw = () => (
  <g>
    <path d="M-2 0L-16 -9Q-19 0 -16 9Z" fill={C.red} />
    <path d="M2 0L16 -9Q19 0 16 9Z" fill={C.red} />
    <path d="M-12 -4L-12 4M12 -4L12 4" stroke="#B83E3E" strokeWidth={1.4} />
    <rect x={-4} y={-4.5} width={8} height={9} rx={2.5} fill="#C94848" />
  </g>
);

const partyHat: Draw = () => (
  <g>
    <path d="M-14 4L0 -28L14 4Z" fill={C.sky} />
    <path d="M-9.6 -6L-6 -14L8 -10L10.4 -6ZM-3 -21L0 -28L3 -21Z" fill={C.gold} />
    <path d="M-14 4L-11.2 -2.4L11.2 -2.4L14 4Z" fill={C.pink} />
    <circle cy={-29} r={3.6} fill={C.red} />
    <circle cx={-5} cy={-4} r={1.4} fill={C.white} />
    <circle cx={4} cy={-16} r={1.4} fill={C.white} />
  </g>
);

const protractor: Draw = () => (
  <g>
    <path
      d="M-20 8A20 20 0 0 1 20 8Z"
      fill={C.cyan}
      fillOpacity={0.35}
      stroke={C.primary}
      strokeWidth={1.6}
    />
    <path d="M-12 8A12 12 0 0 1 12 8" fill="none" stroke={C.primary} strokeWidth={1.2} />
    {Array.from({ length: 13 }, (_, index) => {
      const angle = Math.PI - (index * Math.PI) / 12;
      const inner = index % 3 === 0 ? 14 : 16.5;
      return (
        <path
          key={index}
          d={`M${(Math.cos(angle) * inner).toFixed(2)} ${(8 - Math.sin(angle) * inner).toFixed(2)}L${(Math.cos(angle) * 19).toFixed(2)} ${(8 - Math.sin(angle) * 19).toFixed(2)}`}
          stroke={C.primary}
          strokeWidth={0.9}
        />
      );
    })}
    <circle cy={8} r={1.6} fill={C.primary} />
  </g>
);

const scarf: Draw = () => (
  <g>
    <path d="M-22 -4Q0 8 22 -4L22 4Q0 16 -22 4Z" fill={C.red} />
    <path
      d="M-14 -0.6Q-12 6 -11 9M-2 2.6V10.6M10 0.2Q11 6 12 9"
      stroke={C.white}
      strokeWidth={2.4}
      opacity={0.85}
    />
    <path d="M8 6L14 24L22 21L16 4Z" fill={C.red} />
    <path d="M10.4 12L18 9.6M12.4 18L20 15.4" stroke={C.white} strokeWidth={2.4} opacity={0.85} />
  </g>
);

const starWand: Draw = () => (
  <g transform="rotate(-30)">
    <rect x={-1.6} y={-6} width={3.2} height={26} rx={1.6} fill={C.navy} />
    <rect x={-1.6} y={14} width={3.2} height={6} rx={1.6} fill={C.gold} />
    <path
      d={starPath(0, -12, 11, 4.8)}
      fill={C.gold}
      stroke={C.goldDark}
      strokeWidth={1.2}
      strokeLinejoin="round"
    />
    <path d={sparklePath(10, -22, 3)} fill={C.white} />
    <path d={sparklePath(-11, -4, 2.2)} fill={C.goldLight} />
  </g>
);

export const ACCESSORY_ART: Record<string, AccessoryArt> = {
  'acc-pencil': { slot: 'held', draw: pencil },
  'acc-books': { slot: 'held', draw: books },
  'acc-snowflake': { slot: 'held', draw: snowflake },
  'acc-bow-tie': { slot: 'neck', draw: bowTie },
  'acc-football': { slot: 'held', draw: ball(C.white, C.ink, C.ink) },
  'acc-basketball': { slot: 'held', draw: basketball },
  'acc-party-hat': { slot: 'hat', draw: partyHat },
  'acc-sunglasses': { slot: 'face', draw: sunglasses },
  'acc-calculator': { slot: 'held', draw: calculator },
  'acc-lightning': { slot: 'held', draw: lightning },
  'acc-protractor': { slot: 'held', draw: protractor },
  'acc-headphones': { slot: 'ears', draw: headphones },
  'acc-scarf': { slot: 'neck', draw: scarf },
  'acc-grad-cap': { slot: 'hat', draw: gradCap },
  'acc-rainbow-cloud': { slot: 'held', draw: rainbowCloud },
  'acc-mini-rocket': { slot: 'held', draw: miniRocket },
  'acc-floating-planet': { slot: 'held', draw: planet },
  'acc-wizard-hat': { slot: 'hat', draw: wizardHat },
  'acc-crystal-orb': { slot: 'held', draw: crystalOrb },
  'acc-mini-robot': { slot: 'shoulder', draw: miniRobot },
  'acc-treasure-chest': { slot: 'held', draw: treasureChest },
  'acc-star-wand': { slot: 'held', draw: starWand },
  'acc-space-helmet': { slot: 'helmet', draw: spaceHelmet },
  'acc-golden-football': { slot: 'held', draw: ball(C.gold, C.goldDark, C.goldDark) },
  'acc-crown': { slot: 'hat', draw: crown },
  'acc-trophy': { slot: 'held', draw: trophy },
  'acc-mini-dragon': { slot: 'shoulder', draw: miniDragon },
  'acc-infinity-halo': { slot: 'halo', draw: infinityHalo },
};
