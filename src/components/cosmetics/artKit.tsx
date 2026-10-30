import type { ReactNode } from 'react';
import { mascotPalette, propPalette } from '@/assets/mascot/palette';

/**
 * Shared colours and shapes for the shop artwork. Everything is flat MathsExpress art drawn in
 * code: the brand blues first, then a few warm and natural colours where an item needs them.
 */
export const C = {
  ...propPalette,
  navy: '#1F2A5C',
  night: '#141B3D',
  primary: '#3D52A0',
  sky: '#7091E6',
  muted: '#8697C4',
  soft: '#ADBBDA',
  pale: '#EDE8F5',
  white: '#FFFFFF',
  ink: '#2B2B2B',
  cyan: '#5FD4F4',
  mint: '#6FD3B5',
  green: '#4FAE6E',
  greenDark: '#2F7D4C',
  leaf: '#7CC47F',
  orange: '#E8843C',
  orangeDark: '#C2652A',
  pink: '#F4A6C0',
  pinkDark: '#E07AA0',
  red: '#E45B5B',
  brown: '#8B5E3C',
  brownDark: '#5E3B22',
  sand: '#F3D9A4',
  silver: '#D7DCEB',
  silverDark: '#9AA3BF',
} as const;

export const capybara = mascotPalette;

/** Builds a unique SVG id for one drawing, so many copies can share a page. */
export type IdMaker = (name: string) => string;

/** Draws one piece of art. `id` makes gradient and clip ids unique to this copy. */
export type Draw = (id: IdMaker) => ReactNode;

/** A star with `points` points, as a path. */
export function starPath(cx: number, cy: number, outer: number, inner: number, points = 5) {
  const step = Math.PI / points;
  let d = '';
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = i * step - Math.PI / 2;
    const x = (cx + radius * Math.cos(angle)).toFixed(2);
    const y = (cy + radius * Math.sin(angle)).toFixed(2);
    d += `${i === 0 ? 'M' : 'L'}${x} ${y}`;
  }
  return `${d}Z`;
}

/** A four-point twinkle. */
export function sparklePath(cx: number, cy: number, r: number) {
  const k = r * 0.28;
  return `M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
}

/** Simple round eyes with a highlight, the face style every avatar shares. */
export function Eyes({
  left,
  right,
  y,
  r = 3.4,
  color = C.ink,
}: {
  left: number;
  right: number;
  y: number;
  r?: number;
  color?: string;
}) {
  return (
    <g>
      <ellipse cx={left} cy={y} rx={r * 0.9} ry={r * 1.1} fill={color} />
      <ellipse cx={right} cy={y} rx={r * 0.9} ry={r * 1.1} fill={color} />
      <circle cx={left + r * 0.3} cy={y - r * 0.45} r={r * 0.32} fill={C.white} />
      <circle cx={right + r * 0.3} cy={y - r * 0.45} r={r * 0.32} fill={C.white} />
    </g>
  );
}

export function Smile({
  x = 50,
  y,
  width = 8,
  color = C.ink,
}: {
  x?: number;
  y: number;
  width?: number;
  color?: string;
}) {
  const half = width / 2;
  return (
    <path
      d={`M${x - half} ${y}Q${x} ${y + width * 0.55} ${x + half} ${y}`}
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  );
}

export function Cheeks({
  left,
  right,
  y,
  color = C.pink,
}: {
  left: number;
  right: number;
  y: number;
  color?: string;
}) {
  return (
    <g opacity={0.55}>
      <ellipse cx={left} cy={y} rx={3.6} ry={2.2} fill={color} />
      <ellipse cx={right} cy={y} rx={3.6} ry={2.2} fill={color} />
    </g>
  );
}

/** Shoulders at the bottom of a portrait. */
export function Shoulders({
  fill,
  y = 92,
  rx = 31,
  ry = 24,
}: {
  fill: string;
  y?: number;
  rx?: number;
  ry?: number;
}) {
  return <ellipse cx={50} cy={y} rx={rx} ry={ry} fill={fill} />;
}
