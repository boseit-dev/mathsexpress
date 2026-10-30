import type { CSSProperties, ReactNode } from 'react';
import { mascotPalette as m, propPalette as p } from '@/assets/mascot/palette';
import type { BodyProp, HeldProp, SceneProp } from './poses';
import styles from './Mascot.module.css';

const FONT = "'Lexend Variable', Lexend, Arial, sans-serif";

/** A four-pointed sparkle centred on (x, y). */
function sparklePath(x: number, y: number, size: number): string {
  const s = size;
  return `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;
}

/** A rounded five-pointed star centred on (x, y). */
function starPath(x: number, y: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.48;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(
      `${(x + radius * Math.cos(angle)).toFixed(2)} ${(y + radius * Math.sin(angle)).toFixed(2)}`,
    );
  }
  return `M${points.join('L')}Z`;
}

/**
 * Props held in a paw. They are drawn in the forearm's own coordinates with the paw at (0, pawY) and
 * `upright` already undoing the arm's turn, so a calculator or medal stays level.
 */
export function HeldPropArt({
  prop,
  armTurn,
  pawY,
}: {
  prop: HeldProp;
  armTurn: number;
  pawY: number;
}) {
  const upright = `translate(0 ${pawY}) rotate(${-armTurn})`;
  switch (prop) {
    case 'calculator':
      return (
        <g transform={upright} data-prop="calculator">
          <g transform="translate(2 -12) rotate(-8)">
            <rect x="-12" y="-17" width="24" height="32" rx="4.5" fill={p.grey} />
            <rect x="-9" y="-14" width="18" height="8" rx="2" fill={p.screen} />
            <g className={styles.calcDigits}>
              <rect x="-6" y="-11.5" width="3" height="3" rx="0.8" fill={p.tealDark} />
              <rect x="-1.5" y="-11.5" width="3" height="3" rx="0.8" fill={p.tealDark} />
              <rect x="3" y="-11.5" width="3" height="3" rx="0.8" fill={p.tealDark} />
            </g>
            {[-7.5, -1.5, 4.5].map((x) =>
              [-2, 3.5, 9].map((y) => (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width="4.5"
                  height="3.6"
                  rx="1.2"
                  fill={p.greyLight}
                />
              )),
            )}
          </g>
        </g>
      );
    case 'pointer':
      return (
        <g data-prop="pointer">
          <path
            d={`M0 ${pawY - 7}L5 ${pawY + 57}`}
            stroke={p.ink}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <circle cx="5" cy={pawY + 57} r="3.8" fill={p.brandSky} />
        </g>
      );
    case 'pencil':
      return (
        <g transform={`${upright} rotate(24)`} data-prop="pencil">
          <path d="M-3 -22H3V4L0 11L-3 4Z" fill={p.gold} />
          <path d="M-3 4L0 11L3 4Z" fill={p.goldLight} />
          <path d="M-1 8.6L0 11L1 8.6Z" fill={p.ink} />
          <rect x="-3" y="-26" width="6" height="5" rx="1.5" fill={p.coral} />
        </g>
      );
    case 'medal':
      return (
        <g transform={upright} data-prop="medal">
          <g className={styles.medalSwing}>
            <path d="M-8 -4L-1 22L4 20L-2 -4Z" fill={p.brandBlue} />
            <path d="M8 -4L1 22L-4 20L2 -4Z" fill={p.brandSky} />
            <circle cx="0" cy="31" r="12" fill={p.gold} />
            <circle cx="0" cy="31" r="8.4" fill="none" stroke={p.goldDark} strokeWidth="1.6" />
            <path d={starPath(0, 31, 5.4)} fill={p.goldLight} />
            <path className={styles.medalShine} d={sparklePath(8, 22, 4)} fill={p.paper} />
          </g>
        </g>
      );
    case 'thumb':
      return (
        <g transform={upright} data-prop="thumb">
          <rect
            x="-3.8"
            y="-18"
            width="7.6"
            height="14"
            rx="3.8"
            fill={m.bodyDark}
            stroke={m.snout}
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
        </g>
      );
  }
}

/** Props held in front of the body with both paws, or worn on the head. */
export function BodyPropArt({ prop }: { prop: BodyProp }) {
  switch (prop) {
    case 'book':
      return (
        <g transform="translate(106 150) rotate(-6)" data-prop="book">
          <path d="M-31 -16L0 -9L31 -16L31 -12L0 -5L-31 -12Z" fill={p.page} />
          <path d="M-33 -13L0 -5L33 -13L31 19L0 27L-31 19Z" fill={p.teal} />
          <path d="M0 -5L33 -13L31 19L0 27Z" fill={p.tealDark} opacity="0.45" />
          <path d="M0 -5V27" stroke={p.tealDark} strokeWidth="2.2" />
          <path
            className={styles.pageFlip}
            d="M0 -6L28 -13L27 16L0 23Z"
            fill={p.page}
            opacity="0"
          />
        </g>
      );
    case 'certificate':
      return (
        <g transform="translate(104 148) rotate(-4)" data-prop="certificate">
          <rect x="-36" y="-25" width="72" height="48" rx="3" fill={p.paper} />
          <rect
            x="-31"
            y="-20"
            width="62"
            height="38"
            rx="2"
            fill="none"
            stroke={p.brandSoft}
            strokeWidth="1.6"
          />
          <path d="M-20 -10H20" stroke={p.brandBlue} strokeWidth="3" strokeLinecap="round" />
          <path d="M-22 -1H14M-22 6H6" stroke={p.brandSoft} strokeWidth="2" strokeLinecap="round" />
          <path d="M18 14L15 25L20 22L24 26L24 14Z" fill={p.brandBlue} />
          <circle cx="21" cy="11" r="7" fill={p.gold} />
          <path d={starPath(21, 11, 3.6)} fill={p.goldLight} />
        </g>
      );
    case 'hat':
      return (
        <g data-prop="hat">
          <path d="M79 22L79 32Q100 41 121 32L121 22Z" fill="#232B4E" />
          <path d="M66 18L100 5L134 18L100 31Z" fill="#2F3A66" />
          <circle cx="100" cy="18" r="2.6" fill={p.gold} />
          <path
            d="M100 18L127 23L127 36"
            fill="none"
            stroke={p.gold}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="124" y="35" width="6" height="8" rx="2" fill={p.gold} />
        </g>
      );
  }
}

const CONFETTI = [
  { x: 22, y: 34, shape: 'rect', color: p.brandBlue, turn: 20 },
  { x: 48, y: 8, shape: 'circle', color: p.gold, turn: 0 },
  { x: 74, y: -14, shape: 'tri', color: p.teal, turn: 10 },
  { x: 128, y: -16, shape: 'rect', color: p.coral, turn: -25 },
  { x: 156, y: 4, shape: 'tri', color: p.violet, turn: 30 },
  { x: 182, y: 30, shape: 'circle', color: p.brandSky, turn: 0 },
  { x: 8, y: 76, shape: 'tri', color: p.gold, turn: -15 },
  { x: 196, y: 72, shape: 'rect', color: p.teal, turn: 40 },
  { x: 36, y: 112, shape: 'circle', color: p.coral, turn: 0 },
  { x: 168, y: 108, shape: 'rect', color: p.gold, turn: -30 },
  { x: 100, y: -22, shape: 'circle', color: p.violet, turn: 0 },
  { x: 204, y: 140, shape: 'tri', color: p.brandBlue, turn: 15 },
] as const;

function ConfettiPiece({ shape, color }: { shape: 'rect' | 'circle' | 'tri'; color: string }) {
  if (shape === 'circle') return <circle r="3.6" fill={color} />;
  if (shape === 'tri') return <path d="M0 -4.6L4.4 3.4H-4.4Z" fill={color} />;
  return <rect x="-2.4" y="-5" width="4.8" height="10" rx="1.6" fill={color} />;
}

function Effect({ name, children }: { name: SceneProp; children: ReactNode }) {
  return (
    <g className={styles[name]} data-scene={name}>
      {children}
    </g>
  );
}

/** Indexes the pieces of an effect so CSS can stagger them. */
function piece(i: number) {
  return { className: styles.piece, style: { '--i': i } as CSSProperties };
}

/** Scenery behind the character. */
export function SceneBackArt({ prop }: { prop: SceneProp }) {
  switch (prop) {
    case 'glow':
      return (
        <Effect name="glow">
          <circle cx="100" cy="122" r="96" fill={p.bulbGlow} opacity="0.75" />
          <circle cx="100" cy="122" r="80" fill={p.goldLight} opacity="0.35" />
          <circle
            className={styles.glowRing}
            cx="100"
            cy="122"
            r="88"
            fill="none"
            stroke={p.gold}
            strokeWidth="3"
            strokeDasharray="4 10"
            strokeLinecap="round"
          />
        </Effect>
      );
    case 'whiteboard':
      return (
        <Effect name="whiteboard">
          <path d="M214 150L206 212M276 150L284 212" stroke={p.deskDark} strokeWidth="5" />
          <rect
            x="196"
            y="40"
            width="98"
            height="112"
            rx="8"
            fill={p.paper}
            stroke={p.brandSoft}
            strokeWidth="5"
          />
          <text
            className={styles.boardText}
            x="245"
            y="104"
            textAnchor="middle"
            fontFamily={FONT}
            fontSize="21"
            fontWeight="700"
            fill={p.brandBlue}
          >
            2 + 3 = 5
          </text>
          <path d="M214 122H276" stroke={p.brandSoft} strokeWidth="2.4" strokeLinecap="round" />
          <rect x="226" y="146" width="38" height="6" rx="3" fill={p.deskDark} />
        </Effect>
      );
    case 'speed':
      return (
        <Effect name="speed">
          {[118, 140, 162].map((y, i) => (
            <path
              key={y}
              {...piece(i)}
              d={`M${4 + i * 6} ${y}H${34 + i * 4}`}
              stroke={p.brandSoft}
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
        </Effect>
      );
    default:
      return null;
  }
}

/** Scenery in front of the character, such as a desk or the wall it peeks around. */
export function SceneFrontArt({ prop }: { prop: SceneProp }) {
  switch (prop) {
    case 'desk':
      return (
        <Effect name="desk">
          <rect x="30" y="158" width="160" height="54" rx="8" fill={p.desk} />
          <rect x="22" y="150" width="176" height="13" rx="6.5" fill={p.deskDark} />
          <path d="M108 151L156 146L162 154L114 159Z" fill={p.paper} />
          <path
            className={styles.writtenLine}
            d="M118 154L146 151"
            stroke={p.brandBlue}
            strokeWidth="1.8"
            strokeLinecap="round"
            pathLength={1}
          />
        </Effect>
      );
    case 'laptop':
      return (
        <Effect name="laptop">
          <path d="M84 208L172 208L178 212L78 212Z" fill={p.deskDark} />
          <path d="M90 164L168 164L172 208L86 208Z" fill={p.grey} />
          <path d="M94 168L164 168L167 204L91 204Z" fill="#6A7389" />
          <circle cx="129" cy="186" r="6" fill={p.brandPale} opacity="0.85" />
        </Effect>
      );
    case 'wall':
      return (
        <Effect name="wall">
          <rect x="104" y="-6" width="124" height="220" rx="12" fill={p.wall} />
          <rect x="104" y="-6" width="10" height="220" rx="5" fill={p.wallDark} />
        </Effect>
      );
    default:
      return null;
  }
}

/** Effects that float around the character: stars, confetti, sleep and thinking. */
export function SceneFxArt({ prop }: { prop: SceneProp }) {
  switch (prop) {
    case 'lightbulb':
      return (
        <Effect name="lightbulb">
          <g transform="translate(152 2)">
            <circle className={styles.bulbGlow} r="24" fill={p.bulbGlow} />
            <g className={styles.bulbRays}>
              {[-150, -110, -70, -30, 10].map((angle) => (
                <path
                  key={angle}
                  d="M0 -20V-28"
                  transform={`rotate(${angle + 90})`}
                  stroke={p.gold}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
            </g>
            <path
              d="M-11 0C-11 -14 11 -14 11 0C11 7 6 10 5 15L-5 15C-6 10 -11 7 -11 0Z"
              fill={p.bulb}
            />
            <path
              d="M-3.5 2L0 7L3.5 2"
              fill="none"
              stroke={p.goldDark}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="-5.5" y="15" width="11" height="8" rx="2.5" fill={p.grey} />
          </g>
        </Effect>
      );
    case 'question':
      return (
        <Effect name="question">
          <text
            x="166"
            y="20"
            textAnchor="middle"
            fontFamily={FONT}
            fontSize="38"
            fontWeight="800"
            fill={p.brandBlue}
          >
            ?
          </text>
        </Effect>
      );
    case 'thought':
      return (
        <Effect name="thought">
          {[
            { cx: 150, cy: 22, r: 4 },
            { cx: 162, cy: 8, r: 6 },
            { cx: 180, cy: -10, r: 10 },
          ].map((dot, i) => (
            <circle
              key={dot.cx}
              {...piece(i)}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill={p.brandPale}
              stroke={p.brandSoft}
              strokeWidth="2"
            />
          ))}
        </Effect>
      );
    case 'stars':
      return (
        <Effect name="stars">
          {[
            { x: 30, y: 30, r: 10 },
            { x: 172, y: 20, r: 12 },
            { x: 190, y: 86, r: 7 },
            { x: 10, y: 100, r: 7 },
          ].map((star, i) => (
            <path key={star.x} {...piece(i)} d={starPath(star.x, star.y, star.r)} fill={p.gold} />
          ))}
        </Effect>
      );
    case 'sparkles':
      return (
        <Effect name="sparkles">
          {[
            { x: 182, y: 60, s: 8, color: p.gold },
            { x: 22, y: 64, s: 6, color: p.brandSky },
            { x: 164, y: 18, s: 5, color: p.brandSky },
          ].map((spark, i) => (
            <path
              key={spark.x}
              {...piece(i)}
              d={sparklePath(spark.x, spark.y, spark.s)}
              fill={spark.color}
            />
          ))}
        </Effect>
      );
    case 'hearts':
      return (
        <Effect name="hearts">
          {[
            { x: 176, y: 74, s: 1 },
            { x: 190, y: 50, s: 0.7 },
          ].map((heart, i) => (
            <path
              key={heart.x}
              {...piece(i)}
              transform={`translate(${heart.x} ${heart.y}) scale(${heart.s})`}
              d="M0 7C-9 1 -10 -5 -6 -8C-3 -10 0 -8 0 -5C0 -8 3 -10 6 -8C10 -5 9 1 0 7Z"
              fill={p.coral}
            />
          ))}
        </Effect>
      );
    case 'confetti':
      return (
        <Effect name="confetti">
          {CONFETTI.map((bit, i) => (
            <g
              key={`${bit.x}-${bit.y}`}
              className={styles.piece}
              style={
                {
                  '--i': i,
                  // Each piece bursts out from just above the capybara's head.
                  '--from-x': `${100 - bit.x}px`,
                  '--from-y': `${40 - bit.y}px`,
                } as CSSProperties
              }
            >
              <g transform={`translate(${bit.x} ${bit.y}) rotate(${bit.turn})`}>
                <ConfettiPiece shape={bit.shape} color={bit.color} />
              </g>
            </g>
          ))}
        </Effect>
      );
    case 'zzz':
      return (
        <Effect name="zzz">
          {[
            { x: 176, y: 112, size: 15 },
            { x: 190, y: 90, size: 19 },
            { x: 204, y: 64, size: 25 },
          ].map((z, i) => (
            <text
              key={z.x}
              {...piece(i)}
              x={z.x}
              y={z.y}
              fontFamily={FONT}
              fontSize={z.size}
              fontWeight="800"
              fill={p.brandSky}
            >
              z
            </text>
          ))}
        </Effect>
      );
    case 'notes':
      return (
        <Effect name="notes">
          {[
            { x: 20, y: 48 },
            { x: 178, y: 34 },
          ].map((note, i) => (
            <g key={note.x} {...piece(i)}>
              <g transform={`translate(${note.x} ${note.y})`}>
                <path d="M4 -16V4" stroke={p.violet} strokeWidth="2.6" strokeLinecap="round" />
                <path d="M4 -16Q10 -14 12 -8" fill="none" stroke={p.violet} strokeWidth="2.6" />
                <ellipse cx="0" cy="4" rx="5" ry="4" transform="rotate(-20 0 4)" fill={p.violet} />
              </g>
            </g>
          ))}
        </Effect>
      );
    default:
      return null;
  }
}
