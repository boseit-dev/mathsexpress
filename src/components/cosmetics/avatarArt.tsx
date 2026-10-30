import type { ReactNode } from 'react';
import { viewRigs } from '@/assets/mascot/rig';
import {
  C,
  Cheeks,
  Eyes,
  Shoulders,
  Smile,
  capybara,
  sparklePath,
  starPath,
  type Draw,
} from './artKit';

/*
 * Avatar portraits, drawn in a 100 × 100 box that is shown inside a circle. Every character
 * shares one head position (top near y = 20, eyes near y = 40, centred on x = 50) so hats,
 * glasses and helmets from the Accessories range fit them all.
 */

interface CapybaraColours {
  body: string;
  bodyDark: string;
  belly: string;
  snout: string;
  nostril: string;
  ear: string;
}

const CLASSIC: CapybaraColours = {
  body: capybara.body,
  bodyDark: capybara.bodyDark,
  belly: capybara.belly,
  snout: capybara.snout,
  nostril: capybara.nostril,
  ear: capybara.earInner,
};

const GOLDEN: CapybaraColours = {
  body: '#F5C84C',
  bodyDark: '#D9A021',
  belly: '#FFE9A8',
  snout: '#B9801B',
  nostril: '#7A4E0C',
  ear: '#B9801B',
};

const front = viewRigs.front;

/**
 * The MathsExpress capybara from the front, built from the mascot's own rig so it always matches
 * the official character: same head, snout, ears and tuft, and no mouth.
 */
function CapybaraBust({
  colours = CLASSIC,
  outfit,
}: {
  colours?: CapybaraColours;
  outfit?: ReactNode;
}) {
  const [leftEye, rightEye] = front.eyes;
  return (
    <g>
      <g transform="translate(2 9.4) scale(0.48)">
        <path d={front.body} fill={colours.body} />
        <ellipse {...front.belly} fill={colours.belly} />
      </g>
      {outfit}
      <g transform="translate(2 9.4) scale(0.48)">
        {front.ears.map((ear) => (
          <g key={ear.cx}>
            <circle cx={ear.cx} cy={ear.cy} r={ear.r} fill={colours.bodyDark} />
            <circle cx={ear.cx} cy={ear.cy + 2} r={ear.r * 0.5} fill={colours.ear} />
          </g>
        ))}
        <path d={front.head} fill={colours.body} />
        <path d={front.tuft} fill={colours.bodyDark} />
        <ellipse cx={86} cy={44} rx={16} ry={9} fill={C.white} opacity={0.18} />
        {front.snout && <path d={front.snout.path} fill={colours.snout} />}
        {front.nostrils.map((nostril) => (
          <ellipse
            key={nostril.cx}
            cx={nostril.cx}
            cy={nostril.cy}
            rx={nostril.rx}
            ry={nostril.ry}
            transform={`rotate(${nostril.rotate} ${nostril.cx} ${nostril.cy})`}
            fill={colours.nostril}
          />
        ))}
        {leftEye && rightEye && (
          <>
            <ellipse cx={leftEye.x} cy={leftEye.y} rx={6} ry={7.6} fill={capybara.eye} />
            <ellipse cx={rightEye.x} cy={rightEye.y} rx={6} ry={7.6} fill={capybara.eye} />
            <circle cx={leftEye.x + 2} cy={leftEye.y - 3} r={2} fill={C.white} />
            <circle cx={rightEye.x + 2} cy={rightEye.y - 3} r={2} fill={C.white} />
          </>
        )}
      </g>
    </g>
  );
}

const capybaraClassic: Draw = () => <CapybaraBust />;

const capybaraScientist: Draw = () => (
  <g>
    <CapybaraBust
      outfit={
        <g>
          <path d="M22 100C22 76 32 64 50 64C68 64 78 76 78 100Z" fill={C.white} />
          <path d="M50 64L42 80L50 100L58 80Z" fill={C.pale} />
          <path d="M43 66L50 84L57 66" fill="none" stroke={C.soft} strokeWidth={1.6} />
          <rect x={60} y={80} width={9} height={7} rx={1.5} fill={C.pale} stroke={C.soft} />
          <rect x={62} y={77} width={1.6} height={6} rx={0.8} fill={C.primary} />
          <rect x={65} y={78} width={1.6} height={5} rx={0.8} fill={C.orange} />
        </g>
      }
    />
    <rect x={27} y={26} width={46} height={5} rx={2.5} fill={C.navy} />
    <circle cx={39} cy={28.5} r={7} fill={C.cyan} stroke={C.navy} strokeWidth={2.4} />
    <circle cx={61} cy={28.5} r={7} fill={C.cyan} stroke={C.navy} strokeWidth={2.4} />
    <path
      d="M35 26.5a4 4 0 0 1 4-2.5M57 26.5a4 4 0 0 1 4-2.5"
      stroke={C.white}
      strokeWidth={1.4}
      fill="none"
    />
  </g>
);

const capybaraExplorer: Draw = () => (
  <g>
    <CapybaraBust
      outfit={
        <g>
          <path d="M22 100C22 77 32 65 50 65C68 65 78 77 78 100Z" fill="#B99560" />
          <path d="M40 66L50 76L60 66L56 64L50 70L44 64Z" fill={C.red} />
          <rect x={30} y={82} width={10} height={8} rx={1.5} fill="#9C7A47" />
          <rect x={60} y={82} width={10} height={8} rx={1.5} fill="#9C7A47" />
        </g>
      }
    />
    <ellipse cx={50} cy={25} rx={31} ry={6} fill="#C9A86B" />
    <path d="M30 25C30 12 39 6 50 6C61 6 70 12 70 25Z" fill="#DCC08A" />
    <rect x={30} y={20} width={40} height={4.5} fill="#8B6A3A" />
  </g>
);

const capybaraAstronaut: Draw = (id) => (
  <g>
    <defs>
      <radialGradient id={id('glass')} cx="40%" cy="30%" r="70%">
        <stop offset="0" stopColor={C.white} stopOpacity={0.3} />
        <stop offset="0.6" stopColor={C.white} stopOpacity={0.04} />
        <stop offset="1" stopColor={C.sky} stopOpacity={0.18} />
      </radialGradient>
    </defs>
    <circle cx={50} cy={42} r={33} fill={C.navy} opacity={0.18} />
    <CapybaraBust
      outfit={
        <g>
          <path d="M18 100C18 76 30 64 50 64C70 64 82 76 82 100Z" fill={C.white} />
          <rect x={41} y={78} width={18} height={12} rx={2.5} fill={C.pale} stroke={C.soft} />
          <circle cx={46} cy={84} r={2} fill={C.red} />
          <circle cx={54} cy={84} r={2} fill={C.primary} />
          <path d="M18 92H32M68 92H82" stroke={C.primary} strokeWidth={3} />
        </g>
      }
    />
    <circle
      cx={50}
      cy={42}
      r={31}
      fill={`url(#${id('glass')})`}
      stroke={C.silver}
      strokeWidth={3}
    />
    <path
      d="M30 30a24 24 0 0 1 14-12"
      stroke={C.white}
      strokeWidth={3}
      strokeLinecap="round"
      fill="none"
      opacity={0.8}
    />
    <rect x={30} y={68} width={40} height={6} rx={3} fill={C.silver} />
  </g>
);

const capybaraWizard: Draw = () => (
  <g>
    <CapybaraBust
      outfit={
        <g>
          <path d="M20 100C20 76 31 64 50 64C69 64 80 76 80 100Z" fill="#5B3FA0" />
          <path d="M37 66L50 82L63 66" fill="none" stroke={C.gold} strokeWidth={2.4} />
          <path d={starPath(33, 86, 3.6, 1.6)} fill={C.goldLight} />
          <path d={starPath(66, 90, 3, 1.3)} fill={C.goldLight} />
          <path d={sparklePath(56, 94, 2.6)} fill={C.white} />
        </g>
      }
    />
    <path d="M30 23L52 -2C55 4 60 6 66 8L70 23Z" fill="#5B3FA0" />
    <ellipse cx={50} cy={23} rx={25} ry={4.5} fill="#4A3285" />
    <path d={starPath(53, 13, 3.6, 1.5)} fill={C.goldLight} />
  </g>
);

const capybaraGolden: Draw = (id) => (
  <g>
    <defs>
      <linearGradient id={id('sheen')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0.35" stopColor={C.white} stopOpacity={0} />
        <stop offset="0.5" stopColor={C.white} stopOpacity={0.45} />
        <stop offset="0.65" stopColor={C.white} stopOpacity={0} />
      </linearGradient>
    </defs>
    <CapybaraBust colours={GOLDEN} />
    <rect x={0} y={0} width={100} height={100} fill={`url(#${id('sheen')})`} />
    <path d={sparklePath(77, 22, 5)} fill={C.white} />
    <path d={sparklePath(22, 52, 3.5)} fill={C.goldLight} />
    <path d={sparklePath(80, 60, 3)} fill={C.goldLight} />
  </g>
);

const fox: Draw = () => (
  <g>
    <Shoulders fill={C.orange} />
    <ellipse cx={50} cy={90} rx={13} ry={18} fill="#FFF4E8" />
    <path d="M26 34L30 9L46 24Z" fill={C.orange} />
    <path d="M74 34L70 9L54 24Z" fill={C.orange} />
    <path d="M30 28L32 15L40 23Z" fill={C.orangeDark} />
    <path d="M70 28L68 15L60 23Z" fill={C.orangeDark} />
    <ellipse cx={50} cy={42} rx={26} ry={23} fill={C.orange} />
    <path d="M25 44Q50 74 75 44Q64 53 50 53Q36 53 25 44Z" fill="#FFF4E8" />
    <ellipse cx={50} cy={53} rx={3.4} ry={2.6} fill={C.ink} />
    <Eyes left={40} right={60} y={40} />
    <path
      d="M47 58Q50 60.5 53 58"
      fill="none"
      stroke={C.ink}
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  </g>
);

const owl: Draw = () => (
  <g>
    <Shoulders fill={C.muted} rx={33} />
    <path d="M36 74Q50 84 64 74Q60 96 50 98Q40 96 36 74Z" fill={C.pale} opacity={0.8} />
    <path d="M27 24L31 10L40 20Z" fill={C.primary} />
    <path d="M73 24L69 10L60 20Z" fill={C.primary} />
    <ellipse cx={50} cy={42} rx={27} ry={24} fill={C.muted} />
    <circle cx={39} cy={40} r={11} fill={C.pale} />
    <circle cx={61} cy={40} r={11} fill={C.pale} />
    <circle cx={39} cy={40} r={5.6} fill={C.ink} />
    <circle cx={61} cy={40} r={5.6} fill={C.ink} />
    <circle cx={41} cy={37.6} r={1.8} fill={C.white} />
    <circle cx={63} cy={37.6} r={1.8} fill={C.white} />
    <path d="M46 49L54 49L50 56Z" fill={C.gold} />
    <path d="M30 60Q50 68 70 60" fill="none" stroke={C.primary} strokeWidth={1.6} opacity={0.5} />
  </g>
);

const cat: Draw = () => (
  <g>
    <Shoulders fill="#9AA0B5" />
    <path d="M27 30L29 8L46 22Z" fill="#9AA0B5" />
    <path d="M73 30L71 8L54 22Z" fill="#9AA0B5" />
    <path d="M31 25L32 14L41 21Z" fill={C.pink} />
    <path d="M69 25L68 14L59 21Z" fill={C.pink} />
    <ellipse cx={50} cy={43} rx={26} ry={22} fill="#9AA0B5" />
    <path
      d="M44 22L46 30M50 21V30M56 22L54 30"
      stroke="#7D849C"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <ellipse cx={50} cy={53} rx={10} ry={7} fill="#C7CBDA" />
    <Eyes left={40} right={60} y={42} r={3.6} color="#2F4B2E" />
    <path d="M48 50L52 50L50 52.6Z" fill={C.pinkDark} />
    <path
      d="M50 52.6Q48 56 45.5 55M50 52.6Q52 56 54.5 55"
      fill="none"
      stroke={C.ink}
      strokeWidth={1.2}
      strokeLinecap="round"
    />
    <path
      d="M22 50L36 52M22 56L36 55M78 50L64 52M78 56L64 55"
      stroke={C.white}
      strokeWidth={1}
      opacity={0.8}
    />
  </g>
);

const panda: Draw = () => (
  <g>
    <Shoulders fill={C.ink} />
    <ellipse cx={50} cy={92} rx={14} ry={14} fill={C.white} />
    <circle cx={29} cy={24} r={8.5} fill={C.ink} />
    <circle cx={71} cy={24} r={8.5} fill={C.ink} />
    <ellipse cx={50} cy={43} rx={27} ry={23} fill={C.white} />
    <ellipse cx={39} cy={42} rx={6.6} ry={8.2} transform="rotate(25 39 42)" fill={C.ink} />
    <ellipse cx={61} cy={42} rx={6.6} ry={8.2} transform="rotate(-25 61 42)" fill={C.ink} />
    <circle cx={40} cy={41} r={2.4} fill={C.white} />
    <circle cx={60} cy={41} r={2.4} fill={C.white} />
    <ellipse cx={50} cy={52} rx={4} ry={2.8} fill={C.ink} />
    <Smile y={56} width={6} />
    <Cheeks left={33} right={67} y={52} />
  </g>
);

const koala: Draw = () => (
  <g>
    <Shoulders fill="#A3A8B8" />
    <ellipse cx={50} cy={92} rx={14} ry={16} fill="#D5D8E2" />
    <circle cx={26} cy={30} r={13} fill="#A3A8B8" />
    <circle cx={74} cy={30} r={13} fill="#A3A8B8" />
    <circle cx={26} cy={31} r={8} fill="#E3E0EA" />
    <circle cx={74} cy={31} r={8} fill="#E3E0EA" />
    <ellipse cx={50} cy={44} rx={24} ry={22} fill="#A3A8B8" />
    <ellipse cx={50} cy={49} rx={6.4} ry={8.6} fill="#3B3F4E" />
    <ellipse cx={48} cy={45.5} rx={1.8} ry={2.4} fill={C.white} opacity={0.5} />
    <Eyes left={39} right={61} y={41} r={3} />
    <Cheeks left={34} right={66} y={52} />
  </g>
);

const axolotl: Draw = () => (
  <g>
    <Shoulders fill={C.pink} />
    <ellipse cx={50} cy={90} rx={12} ry={14} fill="#FBD3E1" />
    {[-1, 1].map((side) => (
      <g key={side} fill={C.pinkDark}>
        <ellipse
          cx={50 + side * 29}
          cy={30}
          rx={9}
          ry={3.4}
          transform={`rotate(${side * -30} ${50 + side * 29} 30)`}
        />
        <ellipse cx={50 + side * 32} cy={40} rx={9} ry={3.4} />
        <ellipse
          cx={50 + side * 29}
          cy={50}
          rx={9}
          ry={3.4}
          transform={`rotate(${side * 30} ${50 + side * 29} 50)`}
        />
      </g>
    ))}
    <ellipse cx={50} cy={42} rx={27} ry={21} fill={C.pink} />
    <Eyes left={37} right={63} y={40} r={3.2} />
    <path
      d="M40 50Q50 57 60 50"
      fill="none"
      stroke={C.ink}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Cheeks left={31} right={69} y={48} color={C.pinkDark} />
  </g>
);

const robotBolt: Draw = () => (
  <g>
    <path d="M20 100C20 82 30 72 50 72C70 72 80 82 80 100Z" fill={C.muted} />
    <rect x={38} y={82} width={24} height={10} rx={3} fill={C.primary} />
    <circle cx={44} cy={87} r={2} fill={C.cyan} />
    <circle cx={50} cy={87} r={2} fill={C.gold} />
    <circle cx={56} cy={87} r={2} fill={C.mint} />
    <rect x={44} y={62} width={12} height={12} fill={C.muted} />
    <path d="M50 20V10" stroke={C.muted} strokeWidth={2.4} />
    <path d="M47 4L53 4L49 9L54 9L46 16L48 10L44 10Z" fill={C.gold} />
    <rect x={24} y={20} width={52} height={46} rx={10} fill={C.soft} />
    <rect x={20} y={36} width={6} height={14} rx={2} fill={C.muted} />
    <rect x={74} y={36} width={6} height={14} rx={2} fill={C.muted} />
    <rect x={31} y={28} width={38} height={28} rx={7} fill={C.primary} />
    <rect x={37} y={36} width={8} height={9} rx={2} fill={C.cyan} />
    <rect x={55} y={36} width={8} height={9} rx={2} fill={C.cyan} />
    <path
      d="M43 50Q50 54 57 50"
      fill="none"
      stroke={C.cyan}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </g>
);

const cube: Draw = () => (
  <g>
    <ellipse cx={50} cy={86} rx={22} ry={5} fill={C.navy} opacity={0.2} />
    <path d="M28 28L42 16H76L62 28Z" fill={C.soft} />
    <path d="M62 28L76 16V60L62 72Z" fill={C.primary} />
    <rect x={28} y={28} width={34} height={44} rx={3} fill={C.sky} />
    <Eyes left={39} right={52} y={44} r={3.2} />
    <path
      d="M38 55Q45.5 61 53 55"
      fill="none"
      stroke={C.ink}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Cheeks left={34} right={57} y={52} />
    <circle cx={69} cy={30} r={1.8} fill={C.white} opacity={0.8} />
    <circle cx={69} cy={44} r={1.8} fill={C.white} opacity={0.8} />
    <circle cx={69} cy={58} r={1.8} fill={C.white} opacity={0.8} />
  </g>
);

const piPal: Draw = () => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx={50} cy={84} rx={24} ry={5} fill={C.navy} opacity={0.18} />
    <path d="M22 32Q26 22 38 24H80" stroke={C.primary} strokeWidth={11} />
    <path d="M40 27Q41 56 30 76" stroke={C.primary} strokeWidth={11} />
    <path d="M64 27V66Q64 77 75 74" stroke={C.primary} strokeWidth={11} />
    <circle cx={46} cy={24} r={5} fill={C.white} />
    <circle cx={60} cy={24} r={5} fill={C.white} />
    <circle cx={47} cy={25} r={2.6} fill={C.ink} />
    <circle cx={61} cy={25} r={2.6} fill={C.ink} />
    <path d="M27 82H37M58 82H68" stroke={C.sky} strokeWidth={3} />
  </g>
);

const robotOrbit: Draw = () => (
  <g>
    <ellipse cx={50} cy={96} rx={30} ry={22} fill={C.muted} />
    <rect x={44} y={62} width={12} height={10} fill={C.soft} />
    <path d="M50 18V8" stroke={C.muted} strokeWidth={2.4} />
    <circle cx={50} cy={7} r={3.6} fill={C.gold} />
    <ellipse cx={50} cy={7} rx={9} ry={3} fill="none" stroke={C.sky} strokeWidth={1.4} />
    <circle cx={50} cy={42} r={25} fill={C.pale} />
    <path d="M27 36a25 25 0 0 1 46 0" fill={C.white} opacity={0.6} />
    <rect x={28} y={34} width={44} height={16} rx={8} fill={C.primary} />
    <circle cx={40} cy={42} r={4.4} fill={C.cyan} />
    <circle cx={60} cy={42} r={4.4} fill={C.cyan} />
    <circle cx={41} cy={40.6} r={1.4} fill={C.white} />
    <circle cx={61} cy={40.6} r={1.4} fill={C.white} />
    <path
      d="M44 56Q50 59 56 56"
      fill="none"
      stroke={C.muted}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <circle cx={50} cy={86} r={5} fill={C.cyan} opacity={0.8} />
  </g>
);

const alien: Draw = () => (
  <g>
    <Shoulders fill={C.primary} />
    <path d="M36 70L50 82L64 70" fill="none" stroke={C.cyan} strokeWidth={2.4} />
    <path d="M38 22L30 8M62 22L70 8" stroke="#68C08A" strokeWidth={2.4} strokeLinecap="round" />
    <circle cx={30} cy={8} r={3.6} fill={C.goldLight} />
    <circle cx={70} cy={8} r={3.6} fill={C.goldLight} />
    <path
      d="M50 18C70 18 78 30 76 44C74 58 62 66 50 66C38 66 26 58 24 44C22 30 30 18 50 18Z"
      fill="#8ED39A"
    />
    <ellipse cx={39} cy={40} rx={7} ry={9} transform="rotate(-20 39 40)" fill={C.ink} />
    <ellipse cx={61} cy={40} rx={7} ry={9} transform="rotate(20 61 40)" fill={C.ink} />
    <circle cx={41} cy={36} r={2.2} fill={C.white} />
    <circle cx={63} cy={36} r={2.2} fill={C.white} />
    <Smile y={55} width={8} />
  </g>
);

const starSprite: Draw = (id) => (
  <g>
    <defs>
      <radialGradient id={id('glow')}>
        <stop offset="0" stopColor={C.goldLight} stopOpacity={0.9} />
        <stop offset="1" stopColor={C.goldLight} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={50} cy={46} r={42} fill={`url(#${id('glow')})`} />
    <path
      d={starPath(50, 48, 34, 16)}
      fill={C.gold}
      stroke={C.goldDark}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <path d={starPath(50, 48, 26, 12)} fill={C.goldLight} opacity={0.55} />
    <Eyes left={43} right={57} y={47} r={2.8} />
    <Smile y={54} width={6} />
    <Cheeks left={38} right={62} y={53} color={C.orange} />
    <path d={sparklePath(20, 24, 4)} fill={C.white} />
    <path d={sparklePath(82, 70, 3)} fill={C.white} />
  </g>
);

const cyberKnight: Draw = () => (
  <g>
    <path d="M14 100C14 80 26 70 50 70C74 70 86 80 86 100Z" fill={C.primary} />
    <path d="M14 86Q14 72 32 70L36 82Q24 84 20 96Z" fill={C.soft} />
    <path d="M86 86Q86 72 68 70L64 82Q76 84 80 96Z" fill={C.soft} />
    <path d="M44 76H56L54 90H46Z" fill={C.cyan} opacity={0.8} />
    <path d="M50 4Q62 8 60 20" fill="none" stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
    <path
      d="M26 44C26 26 36 16 50 16C64 16 74 26 74 44V58Q74 68 50 70Q26 68 26 58Z"
      fill={C.silver}
    />
    <path d="M50 16V70" stroke={C.silverDark} strokeWidth={1.4} />
    <path d="M30 40H70V48Q50 54 30 48Z" fill={C.night} />
    <path d="M34 43H66" stroke={C.cyan} strokeWidth={2.4} strokeLinecap="round" />
    <path
      d="M36 58H44M56 58H64M38 63H44M56 63H62"
      stroke={C.silverDark}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </g>
);

const dragon: Draw = () => (
  <g>
    <path d="M18 62L6 44L14 46L10 34L22 48Z" fill={C.greenDark} />
    <path d="M82 62L94 44L86 46L90 34L78 48Z" fill={C.greenDark} />
    <Shoulders fill={C.green} />
    <path d="M42 72H58V100H42Z" fill={C.sand} opacity={0.85} />
    <path d="M44 78H56M44 85H56M44 92H56" stroke={C.green} strokeWidth={1.2} opacity={0.6} />
    <path d="M34 24L30 8L42 20Z" fill={C.goldLight} />
    <path d="M66 24L70 8L58 20Z" fill={C.goldLight} />
    <ellipse cx={50} cy={40} rx={24} ry={21} fill={C.green} />
    <ellipse cx={50} cy={53} rx={16} ry={11} fill={C.leaf} />
    <circle cx={44} cy={52} r={1.6} fill={C.greenDark} />
    <circle cx={56} cy={52} r={1.6} fill={C.greenDark} />
    <Eyes left={40} right={60} y={37} r={3.4} />
    <path
      d="M44 58Q50 61 56 58"
      fill="none"
      stroke={C.greenDark}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <path d="M44 20L47 15L50 20L53 15L56 20" fill={C.leaf} />
  </g>
);

const robotMega: Draw = () => (
  <g>
    <path d="M10 100L16 78L36 70H64L84 78L90 100Z" fill={C.navy} />
    <path d="M16 78L36 70L40 86L22 92Z" fill={C.primary} />
    <path d="M84 78L64 70L60 86L78 92Z" fill={C.primary} />
    <path d="M42 74H58L56 92H44Z" fill={C.gold} />
    <circle cx={50} cy={82} r={4} fill={C.cyan} />
    <path d="M28 22L40 14H60L72 22L74 56L62 68H38L26 56Z" fill={C.primary} />
    <path d="M40 14L44 4H56L60 14Z" fill={C.gold} />
    <path d="M28 22L22 18L24 36L27 40Z" fill={C.gold} />
    <path d="M72 22L78 18L76 36L73 40Z" fill={C.gold} />
    <path d="M31 34H69L65 46H35Z" fill={C.night} />
    <path d="M37 40L46 38M54 38L63 40" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" />
    <path d="M40 56H60M42 61H58" stroke={C.soft} strokeWidth={2} strokeLinecap="round" />
  </g>
);

const nebula: Draw = (id) => (
  <g>
    <defs>
      <linearGradient id={id('body')} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#B59CFF" />
        <stop offset="0.55" stopColor={C.sky} />
        <stop offset="1" stopColor={C.primary} />
      </linearGradient>
      <radialGradient id={id('halo')}>
        <stop offset="0.5" stopColor="#B59CFF" stopOpacity={0.55} />
        <stop offset="1" stopColor="#B59CFF" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={50} cy={46} r={46} fill={`url(#${id('halo')})`} />
    <path
      d="M50 12C70 12 78 28 78 46C78 62 84 74 90 88C80 84 74 92 66 86C60 94 54 88 50 96C46 88 40 94 34 86C26 92 20 84 10 88C16 74 22 62 22 46C22 28 30 12 50 12Z"
      fill={`url(#${id('body')})`}
    />
    {[
      [34, 30, 1.6],
      [64, 26, 1.2],
      [70, 60, 1.6],
      [30, 64, 1.2],
      [56, 74, 1.4],
      [42, 80, 1],
    ].map(([x = 0, y = 0, r = 1]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={C.white} />
    ))}
    <path d={sparklePath(62, 70, 3)} fill={C.white} />
    <ellipse cx={41} cy={44} rx={4.4} ry={6} fill={C.white} />
    <ellipse cx={59} cy={44} rx={4.4} ry={6} fill={C.white} />
    <ellipse cx={41} cy={45} rx={2.2} ry={3} fill={C.night} />
    <ellipse cx={59} cy={45} rx={2.2} ry={3} fill={C.night} />
  </g>
);

const bunny: Draw = () => (
  <g>
    <Shoulders fill="#F1EEF6" />
    <ellipse cx={50} cy={92} rx={13} ry={15} fill={C.white} />
    <ellipse cx={38} cy={14} rx={7} ry={17} transform="rotate(-10 38 14)" fill="#F1EEF6" />
    <ellipse cx={62} cy={14} rx={7} ry={17} transform="rotate(10 62 14)" fill="#F1EEF6" />
    <ellipse cx={38} cy={15} rx={3.4} ry={12} transform="rotate(-10 38 15)" fill={C.pink} />
    <ellipse cx={62} cy={15} rx={3.4} ry={12} transform="rotate(10 62 15)" fill={C.pink} />
    <ellipse cx={50} cy={44} rx={25} ry={22} fill="#F1EEF6" />
    <Eyes left={40} right={60} y={42} r={3.4} />
    <path d="M47.5 50L52.5 50L50 53Z" fill={C.pinkDark} />
    <path
      d="M50 53Q48 57 45 56M50 53Q52 57 55 56"
      fill="none"
      stroke={C.ink}
      strokeWidth={1.3}
      strokeLinecap="round"
    />
    <Cheeks left={34} right={66} y={52} />
  </g>
);

const hedgehog: Draw = () => (
  <g>
    <path
      d="M14 70L10 52L20 50L14 34L26 36L24 20L36 26L40 12L50 22L60 12L64 26L76 20L74 36L86 34L80 50L90 52L86 70Z"
      fill="#8B6A4E"
    />
    <Shoulders fill="#8B6A4E" />
    <ellipse cx={50} cy={92} rx={15} ry={14} fill={C.sand} />
    <ellipse cx={50} cy={48} rx={22} ry={19} fill={C.sand} />
    <ellipse cx={50} cy={56} rx={11} ry={8} fill="#F7E6C4" />
    <circle cx={50} cy={53} r={3.2} fill={C.ink} />
    <Eyes left={41} right={59} y={45} r={3} />
    <Smile y={59} width={6} />
    <Cheeks left={36} right={64} y={53} />
  </g>
);

const unicorn: Draw = (id) => (
  <g>
    <defs>
      <linearGradient id={id('horn')} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor={C.goldDark} />
        <stop offset="1" stopColor={C.goldLight} />
      </linearGradient>
    </defs>
    <Shoulders fill={C.white} />
    {[C.pink, '#B59CFF', C.sky, C.mint].map((colour, index) => (
      <path
        key={colour}
        d={`M${62 + index * 3} ${20 + index * 4}Q${84 + index * 2} ${40 + index * 6} ${70 + index * 2} ${74 + index * 3}`}
        fill="none"
        stroke={colour}
        strokeWidth={6}
        strokeLinecap="round"
      />
    ))}
    <path d="M30 26L28 12L40 22Z" fill={C.white} />
    <path d="M70 26L72 12L60 22Z" fill={C.white} />
    <ellipse cx={50} cy={44} rx={24} ry={22} fill={C.white} />
    <path d="M46 24L50 2L54 24Z" fill={`url(#${id('horn')})`} />
    <path d="M47 18L53 16M47.5 12L52.5 10.5" stroke={C.goldDark} strokeWidth={1} />
    <ellipse cx={50} cy={56} rx={14} ry={9} fill="#F6EEF9" />
    <ellipse cx={45} cy={56} rx={1.6} ry={1.2} fill={C.pinkDark} />
    <ellipse cx={55} cy={56} rx={1.6} ry={1.2} fill={C.pinkDark} />
    <Eyes left={40} right={60} y={42} r={3.2} />
    <Cheeks left={33} right={67} y={50} />
  </g>
);

export const AVATAR_ART: Record<string, Draw> = {
  'av-capybara': capybaraClassic,
  'av-fox': fox,
  'av-owl': owl,
  'av-cat': cat,
  'av-panda': panda,
  'av-bunny': bunny,
  'av-koala': koala,
  'av-axolotl': axolotl,
  'av-robot-bolt': robotBolt,
  'av-cube': cube,
  'av-hedgehog': hedgehog,
  'av-pi': piPal,
  'av-capy-scientist': capybaraScientist,
  'av-robot-orbit': robotOrbit,
  'av-alien': alien,
  'av-capy-explorer': capybaraExplorer,
  'av-capy-astronaut': capybaraAstronaut,
  'av-capy-wizard': capybaraWizard,
  'av-unicorn': unicorn,
  'av-star-sprite': starSprite,
  'av-cyber-knight': cyberKnight,
  'av-dragon': dragon,
  'av-robot-mega': robotMega,
  'av-capy-golden': capybaraGolden,
  'av-nebula': nebula,
};
