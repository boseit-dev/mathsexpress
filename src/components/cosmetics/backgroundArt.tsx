import { C, sparklePath, starPath, type Draw, type IdMaker } from './artKit';

/*
 * Backgrounds are drawn 160 × 100 and always shown with "slice", so they fill a wide preview
 * stage and a small round avatar alike. Keep the middle calm: the avatar sits there.
 */
export const BACKGROUND_VIEWBOX = '0 0 160 100';

function sky(id: IdMaker, top: string, bottom: string) {
  return (
    <>
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width={160} height={100} fill={`url(#${id('sky')})`} />
    </>
  );
}

/** Small stars scattered by a fixed pattern, so every copy looks the same. */
function stars(count: number, colour: string = C.white, seed = 7) {
  return Array.from({ length: count }, (_, index) => {
    const x = (index * 37 + seed * 11) % 160;
    const y = (index * 53 + seed * 7) % 70;
    const r = index % 3 === 0 ? 0.9 : 0.55;
    return <circle key={index} cx={x} cy={y} r={r} fill={colour} opacity={index % 2 ? 0.9 : 0.6} />;
  });
}

function cloud(x: number, y: number, scale: number, fill: string = C.white) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M-20 6a7 7 0 0 1 3-12a9 9 0 0 1 16-4a8 8 0 0 1 14 4a7 7 0 0 1 4 12Z"
      fill={fill}
    />
  );
}

const lavenderHills: Draw = (id) => (
  <g>
    {sky(id, C.pale, C.soft)}
    <circle cx={128} cy={24} r={10} fill={C.white} opacity={0.8} />
    {cloud(34, 26, 1, C.white)}
    <path d="M0 70Q40 52 80 66T160 60V100H0Z" fill={C.muted} />
    <path d="M0 82Q50 66 100 80T160 76V100H0Z" fill={C.sky} />
    <path d="M0 92Q60 84 160 92V100H0Z" fill={C.primary} opacity={0.8} />
  </g>
);

const classicBlue: Draw = (id) => (
  <g>
    {sky(id, C.sky, C.primary)}
    <defs>
      <pattern id={id('dots')} width={10} height={10} patternUnits="userSpaceOnUse">
        <circle cx={5} cy={5} r={0.9} fill={C.white} opacity={0.35} />
      </pattern>
    </defs>
    <rect width={160} height={100} fill={`url(#${id('dots')})`} />
    <circle cx={20} cy={86} r={34} fill={C.white} opacity={0.08} />
    <circle cx={146} cy={10} r={26} fill={C.white} opacity={0.08} />
  </g>
);

const dreamyClouds: Draw = (id) => (
  <g>
    {sky(id, '#CFDCFF', C.pale)}
    {cloud(30, 30, 1.2)}
    {cloud(132, 20, 0.9)}
    {cloud(118, 70, 1.4, '#F7F5FC')}
    {cloud(26, 82, 1.5, '#F7F5FC')}
    {cloud(82, 94, 1.2, C.white)}
  </g>
);

const sunsetBeach: Draw = (id) => (
  <g>
    {sky(id, '#F6A57A', '#F7D6E4')}
    <circle cx={80} cy={62} r={20} fill="#FFD27A" />
    <rect y={60} width={160} height={24} fill={C.sky} />
    <path
      d="M30 66H58M96 70H130M60 76H88"
      stroke={C.white}
      strokeWidth={1.4}
      strokeLinecap="round"
      opacity={0.6}
    />
    <path d="M70 64H90" stroke="#FFD27A" strokeWidth={2} strokeLinecap="round" />
    <path d="M0 84Q80 76 160 86V100H0Z" fill={C.sand} />
    <path d="M14 100Q16 80 22 72" stroke={C.brown} strokeWidth={2} fill="none" />
    <path
      d="M22 72q-10 -2 -14 4M22 72q8 -6 14 0M22 72q-4 -8 -12 -8M22 72q6 -8 12 -6"
      stroke={C.greenDark}
      strokeWidth={2.4}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

const rainforest: Draw = (id) => (
  <g>
    {sky(id, '#BFE6C9', '#E6F4E2')}
    <rect x={18} y={10} width={8} height={90} fill="#6B4A2E" />
    <rect x={130} y={0} width={9} height={100} fill="#5A3E26" />
    <path d="M0 0H160V18Q140 30 120 18Q100 30 80 16Q60 30 40 16Q20 28 0 18Z" fill={C.greenDark} />
    <path d="M0 0H160V10Q140 20 120 10Q100 20 80 8Q60 20 40 8Q20 18 0 10Z" fill={C.green} />
    <path d="M-4 70Q20 50 40 68Q22 66 -4 82Z" fill={C.green} />
    <path d="M164 64Q140 44 118 62Q140 60 164 78Z" fill={C.greenDark} />
    <path d="M0 100Q20 78 46 88Q66 76 90 90Q116 74 160 88V100Z" fill={C.leaf} />
    <path d="M150 40q-8 2 -10 10" stroke={C.green} strokeWidth={2} fill="none" />
    <circle cx={108} cy={84} r={2.4} fill={C.red} />
    <circle cx={60} cy={86} r={2} fill={C.gold} />
  </g>
);

const snowyMountains: Draw = (id) => (
  <g>
    {sky(id, '#C9DBF6', C.pale)}
    <path d="M-10 90L40 30L90 90Z" fill={C.muted} />
    <path d="M40 30L28 44L36 42L42 48L48 40L54 46Z" fill={C.white} />
    <path d="M60 90L112 22L170 90Z" fill={C.primary} opacity={0.85} />
    <path d="M112 22L98 40L106 38L114 46L120 36L128 42Z" fill={C.white} />
    <path d="M0 100V84Q80 74 160 84V100Z" fill={C.white} />
    {stars(28, C.white, 3)}
  </g>
);

const deepOcean: Draw = (id) => (
  <g>
    {sky(id, '#3E6FC4', '#14285E')}
    <path d="M40 0L60 100H50L28 0ZM100 0L124 100H116L90 0Z" fill={C.white} opacity={0.07} />
    {[
      [24, 70, 3],
      [30, 54, 2],
      [136, 76, 3.4],
      [128, 58, 2],
      [140, 40, 1.4],
      [20, 34, 1.4],
    ].map(([x = 0, y = 0, r = 1]) => (
      <circle
        key={`${x}-${y}`}
        cx={x}
        cy={y}
        r={r}
        fill="none"
        stroke={C.white}
        strokeWidth={0.9}
        opacity={0.6}
      />
    ))}
    <path d="M0 100Q30 88 60 96T120 92T160 96V100Z" fill={C.night} />
    <path
      d="M14 100Q12 88 16 80Q20 90 18 100M146 100Q150 86 144 76Q140 90 142 100"
      fill="#2F8C7E"
    />
  </g>
);

const footballStadium: Draw = (id) => (
  <g>
    {sky(id, C.night, '#2B3B7C')}
    {[18, 142].map((x) => (
      <g key={x}>
        <rect x={x - 1} y={8} width={2} height={40} fill={C.silverDark} />
        <rect x={x - 8} y={4} width={16} height={7} rx={1.5} fill={C.silver} />
        <path
          d={`M${x - 8} 11L${x - 30} 60H${x + 30}L${x + 8} 11Z`}
          fill={C.goldLight}
          opacity={0.08}
        />
      </g>
    ))}
    <path d="M0 44H160V62H0Z" fill="#3A4A8E" />
    {Array.from({ length: 24 }, (_, index) => (
      <circle
        key={index}
        cx={4 + index * 6.6}
        cy={50 + (index % 3) * 4}
        r={1.6}
        fill={[C.sky, C.gold, C.white, C.red][index % 4]}
        opacity={0.8}
      />
    ))}
    <rect y={62} width={160} height={38} fill="#3E9A5A" />
    <path d="M0 74H160M0 88H160" stroke="#47A964" strokeWidth={7} />
    <path
      d="M80 62V100M60 100A20 10 0 0 1 100 100"
      stroke={C.white}
      strokeWidth={1.2}
      fill="none"
      opacity={0.85}
    />
  </g>
);

const moonSurface: Draw = (id) => (
  <g>
    {sky(id, C.night, '#232C5C')}
    {stars(40)}
    <circle cx={132} cy={20} r={9} fill={C.sky} />
    <path
      d="M126 16q4 -2 6 2q2 4 6 2M128 24q3 1 5 -1"
      stroke={C.green}
      strokeWidth={2.4}
      fill="none"
      strokeLinecap="round"
    />
    <path d="M0 74Q40 64 80 72T160 68V100H0Z" fill="#A9AFC4" />
    <path d="M0 86Q60 78 160 84V100H0Z" fill="#8C93AC" />
    <ellipse cx={34} cy={84} rx={12} ry={3.4} fill="#767D98" />
    <ellipse cx={118} cy={90} rx={16} ry={4} fill="#767D98" />
    <ellipse cx={86} cy={76} rx={7} ry={2} fill="#8C93AC" />
  </g>
);

const neonCity: Draw = (id) => (
  <g>
    {sky(id, '#241A54', '#5A3FA0')}
    {stars(16, C.white, 5)}
    <circle cx={122} cy={22} r={8} fill="#FFD6F2" opacity={0.85} />
    {[
      [0, 44, 18],
      [20, 30, 14],
      [36, 52, 20],
      [58, 38, 12],
      [96, 46, 16],
      [114, 26, 14],
      [130, 50, 12],
      [144, 36, 16],
    ].map(([x = 0, y = 0, w = 10]) => (
      <g key={x}>
        <rect x={x} y={y} width={w} height={100 - y} fill={C.night} />
        {Array.from({ length: Math.floor((100 - y) / 8) }, (_, row) => (
          <rect
            key={row}
            x={x + 3}
            y={y + 4 + row * 8}
            width={w - 6}
            height={2}
            fill={row % 2 ? C.cyan : '#FF7AD9'}
            opacity={0.75}
          />
        ))}
      </g>
    ))}
    <path d="M0 98H160" stroke="#FF7AD9" strokeWidth={2} opacity={0.8} />
  </g>
);

const underwaterKingdom: Draw = (id) => (
  <g>
    {sky(id, '#4FC3D8', '#1F5FA8')}
    <path d="M30 0L46 100H38L22 0ZM112 0L130 100H122L104 0Z" fill={C.white} opacity={0.08} />
    <g fill="#F08FB0">
      <rect x={110} y={40} width={10} height={50} />
      <rect x={124} y={30} width={12} height={60} />
      <rect x={140} y={46} width={10} height={44} />
      <path d="M108 40L115 30L122 40ZM122 30L130 18L138 30ZM138 46L145 36L152 46Z" fill="#E07AA0" />
    </g>
    <rect x={126} y={52} width={6} height={9} rx={3} fill="#1F5FA8" opacity={0.6} />
    <path d="M10 100Q6 80 14 66Q20 80 16 100ZM22 100Q24 84 30 76Q32 88 28 100Z" fill={C.mint} />
    <path d="M0 100Q40 90 80 96T160 94V100Z" fill={C.sand} />
    <circle cx={60} cy={30} r={2} fill="none" stroke={C.white} strokeWidth={0.8} opacity={0.7} />
    <circle cx={66} cy={20} r={1.4} fill="none" stroke={C.white} strokeWidth={0.8} opacity={0.7} />
    <path d="M90 60q6 -5 12 0q-6 5 -12 0l-4 -3v6z" fill={C.gold} />
  </g>
);

const cyberGrid: Draw = (id) => (
  <g>
    {sky(id, '#0F1433', '#2A1F5E')}
    <circle cx={80} cy={56} r={22} fill="#FF7AD9" opacity={0.85} />
    <path d="M58 50H102M58 56H102M60 62H100" stroke="#2A1F5E" strokeWidth={2} />
    <rect y={60} width={160} height={40} fill="#0F1433" />
    <g stroke={C.cyan} strokeWidth={0.8} opacity={0.75}>
      {[62, 66, 72, 80, 90].map((y) => (
        <path key={y} d={`M0 ${y}H160`} />
      ))}
      {[-60, -30, 0, 30, 60, 90, 120, 150, 180, 210].map((x) => (
        <path key={x} d={`M80 60L${x} 100`} />
      ))}
    </g>
  </g>
);

const northernLights: Draw = (id) => (
  <g>
    {sky(id, '#0E1638', '#24345F')}
    {stars(30)}
    <defs>
      <linearGradient id={id('aurora')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.mint} stopOpacity={0} />
        <stop offset="0.5" stopColor={C.mint} stopOpacity={0.6} />
        <stop offset="1" stopColor="#B59CFF" stopOpacity={0} />
      </linearGradient>
    </defs>
    <path
      d="M0 40Q30 10 60 34T120 24T160 30V60Q130 50 100 64T40 58T0 66Z"
      fill={`url(#${id('aurora')})`}
    />
    <path
      d="M10 30Q50 4 90 26T160 14"
      stroke="#B59CFF"
      strokeWidth={3}
      fill="none"
      opacity={0.35}
    />
    <path d="M0 100L24 70L40 84L60 62L84 88L110 66L130 82L160 64V100Z" fill={C.night} />
  </g>
);

const cosmicGalaxy: Draw = (id) => (
  <g>
    {sky(id, '#120C2E', '#3B2380')}
    {stars(50, C.white, 9)}
    <defs>
      <radialGradient id={id('core')}>
        <stop offset="0" stopColor={C.white} />
        <stop offset="0.3" stopColor="#FFD6F2" />
        <stop offset="1" stopColor="#8752E8" stopOpacity={0} />
      </radialGradient>
    </defs>
    <g transform="rotate(-20 80 50)">
      <ellipse cx={80} cy={50} rx={70} ry={18} fill="#8752E8" opacity={0.3} />
      <ellipse cx={80} cy={50} rx={46} ry={11} fill="#B59CFF" opacity={0.35} />
    </g>
    <circle cx={80} cy={50} r={20} fill={`url(#${id('core')})`} />
    <path d={sparklePath(30, 20, 4)} fill={C.white} />
    <path d={sparklePath(136, 78, 3)} fill={C.white} />
  </g>
);

const goldenPalace: Draw = (id) => (
  <g>
    {sky(id, C.primary, C.navy)}
    {stars(20, C.goldLight, 4)}
    <path d="M64 30Q80 6 96 30Z" fill={C.gold} />
    <rect x={78} y={6} width={4} height={8} fill={C.gold} />
    <path d={starPath(80, 5, 3, 1.3)} fill={C.goldLight} />
    <rect x={40} y={30} width={80} height={70} fill="#E7B53C" />
    <rect x={40} y={30} width={80} height={6} fill={C.goldDark} />
    {[48, 66, 84, 102].map((x) => (
      <g key={x}>
        <path d={`M${x} 100V60Q${x + 5} 48 ${x + 10} 60V100Z`} fill={C.navy} />
        <rect x={x - 3} y={40} width={3} height={60} fill={C.goldLight} opacity={0.6} />
      </g>
    ))}
    <rect x={0} y={92} width={160} height={8} fill={C.goldDark} />
    <path d="M14 92V56M146 92V56" stroke={C.gold} strokeWidth={4} />
    <circle cx={14} cy={54} r={4} fill={C.goldLight} />
    <circle cx={146} cy={54} r={4} fill={C.goldLight} />
  </g>
);

const mathsUniverse: Draw = (id) => (
  <g>
    {sky(id, '#0D1230', C.primary)}
    <g stroke={C.sky} strokeWidth={0.4} opacity={0.35}>
      {Array.from({ length: 17 }, (_, index) => (
        <path key={`v${index}`} d={`M${index * 10} 0V100`} />
      ))}
      {Array.from({ length: 11 }, (_, index) => (
        <path key={`h${index}`} d={`M0 ${index * 10}H160`} />
      ))}
    </g>
    <path d="M0 50H160M80 0V100" stroke={C.sky} strokeWidth={0.8} opacity={0.6} />
    <path
      d="M0 90Q40 10 80 50T160 10"
      stroke={C.gold}
      strokeWidth={1.4}
      fill="none"
      opacity={0.8}
    />
    {stars(24, C.white, 2)}
    <circle cx={132} cy={78} r={10} fill="#8752E8" />
    <ellipse cx={132} cy={78} rx={16} ry={4} fill="none" stroke={C.gold} strokeWidth={1.4} />
    <circle cx={22} cy={24} r={6} fill={C.mint} />
    <g fontFamily="Georgia, serif" fontWeight={700} fill={C.white} opacity={0.85}>
      <text x={26} y={70} fontSize={14}>
        π
      </text>
      <text x={118} y={30} fontSize={12}>
        ∑
      </text>
      <text x={46} y={22} fontSize={10}>
        √
      </text>
      <text x={100} y={92} fontSize={12}>
        ∞
      </text>
      <text x={8} y={94} fontSize={8}>
        x²
      </text>
    </g>
  </g>
);

const chalkboard: Draw = (id) => (
  <g>
    {sky(id, '#2F5D4F', '#244A3F')}
    <rect x={0} y={90} width={160} height={10} fill="#8B6A4E" />
    <rect x={0} y={88} width={160} height={3} fill="#A9835F" />
    <g fill="none" stroke={C.white} strokeWidth={1.2} strokeLinecap="round" opacity={0.85}>
      <path d="M14 26L34 26M24 16L24 36" />
      <path d="M118 20Q130 8 142 20T166 20" />
      <path d="M18 72L40 52L40 72Z" />
      <circle cx={132} cy={66} r={10} />
      <path d="M122 66H142" />
    </g>
    <g fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive" fill={C.white} opacity={0.85}>
      <text x={48} y={30} fontSize={9}>
        2x + 3 = 11
      </text>
      <text x={98} y={44} fontSize={8}>
        a² + b² = c²
      </text>
      <text x={54} y={80} fontSize={8}>
        x = 4 ✓
      </text>
    </g>
    <rect x={128} y={86} width={10} height={3} rx={1} fill={C.white} />
  </g>
);

const autumnForest: Draw = (id) => (
  <g>
    {sky(id, '#FBD9B0', '#F6EBDD')}
    {[
      [16, 0.9, '#C2652A'],
      [42, 1.1, '#E8843C'],
      [118, 1.2, '#D9A520'],
      [146, 0.95, '#B03A2E'],
    ].map(([x = 0, scale = 1, colour = C.orange]) => (
      <g key={String(x)} transform={`translate(${Number(x)} 64) scale(${Number(scale)})`}>
        <rect x={-2.5} y={0} width={5} height={36} fill="#6B4A2E" />
        <circle cx={0} cy={-8} r={18} fill={String(colour)} />
        <circle cx={-10} cy={2} r={11} fill={String(colour)} opacity={0.85} />
        <circle cx={10} cy={2} r={11} fill={String(colour)} opacity={0.85} />
      </g>
    ))}
    <path d="M0 100V86Q80 78 160 86V100Z" fill="#C98B52" />
    {[30, 64, 90, 104, 130].map((x, index) => (
      <ellipse
        key={x}
        cx={x}
        cy={90 + (index % 2) * 4}
        rx={3}
        ry={1.6}
        fill={index % 2 ? C.orange : C.red}
        transform={`rotate(${index * 30} ${x} 90)`}
      />
    ))}
  </g>
);

const desertDunes: Draw = (id) => (
  <g>
    {sky(id, '#7FB6E8', '#F8E1B4')}
    <circle cx={124} cy={26} r={14} fill="#FFE08A" />
    <circle cx={124} cy={26} r={20} fill="#FFE08A" opacity={0.3} />
    <path d="M0 70Q40 54 80 68T160 62V100H0Z" fill="#E9B970" />
    <path d="M0 84Q60 70 120 82T160 80V100H0Z" fill="#D9A04F" />
    <path
      d="M24 82V66M24 72Q18 72 18 66M24 76Q30 76 30 70"
      stroke={C.greenDark}
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
    />
    <path d="M60 40l6 -2l6 2" stroke={C.navy} strokeWidth={1} fill="none" opacity={0.5} />
  </g>
);

const volcanoIsland: Draw = (id) => (
  <g>
    {sky(id, '#4A3A7A', '#F29A6B')}
    <path
      d="M62 8Q70 0 78 8Q86 2 92 10Q88 18 80 16Q74 24 66 18Q58 18 62 8Z"
      fill="#7A6F8E"
      opacity={0.75}
    />
    <path d="M40 74L70 28H90L120 74Z" fill="#5A3E3A" />
    <path d="M70 28H90L84 38L80 34L76 40Z" fill={C.orange} />
    <path d="M78 34Q76 50 82 62" stroke={C.orange} strokeWidth={3} fill="none" opacity={0.85} />
    <rect y={72} width={160} height={28} fill="#2E5B9A" />
    <path d="M10 82H40M100 88H140M50 94H80" stroke={C.white} strokeWidth={1} opacity={0.4} />
    <path d="M34 74Q80 66 126 74Z" fill="#3F7A4E" />
  </g>
);

export const BACKGROUND_ART: Record<string, Draw> = {
  'bg-lavender-hills': lavenderHills,
  'bg-classic-blue': classicBlue,
  'bg-chalkboard': chalkboard,
  'bg-dreamy-clouds': dreamyClouds,
  'bg-sunset-beach': sunsetBeach,
  'bg-autumn-forest': autumnForest,
  'bg-rainforest': rainforest,
  'bg-snowy-mountains': snowyMountains,
  'bg-deep-ocean': deepOcean,
  'bg-football-stadium': footballStadium,
  'bg-desert-dunes': desertDunes,
  'bg-moon-surface': moonSurface,
  'bg-neon-city': neonCity,
  'bg-underwater-kingdom': underwaterKingdom,
  'bg-volcano-island': volcanoIsland,
  'bg-cyber-grid': cyberGrid,
  'bg-northern-lights': northernLights,
  'bg-cosmic-galaxy': cosmicGalaxy,
  'bg-golden-palace': goldenPalace,
  'bg-maths-universe': mathsUniverse,
};
