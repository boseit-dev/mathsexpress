/**
 * Where the background decoration goes on each kind of page. All share one style (squiggles,
 * drifting dots, soft shapes in the brand colours) but each page gets its own arrangement.
 * Positions are percentages of the window and stay near the left and right edges.
 */
export type DecorVariant =
  | 'student'
  | 'learn'
  | 'textbook'
  | 'class'
  | 'tasks'
  | 'shop'
  | 'teacher'
  | 'reports'
  | 'auth'
  /** Lessons and reading: almost nothing, so students can concentrate. */
  | 'calm';

export type DecorColour = 'primary' | 'secondary' | 'muted' | 'soft' | 'lavender';

export interface Squiggle {
  side: 'left' | 'right';
  /** Distance from the top of the window, in %. */
  top: number;
  colour: DecorColour;
  /** Seconds for one sway. */
  speed: number;
}

export interface Dot {
  /** Position in % of the window. */
  x: number;
  y: number;
  size: number;
  colour: DecorColour;
  /** Drift direction: straight down or diagonal. */
  drift: 'down' | 'left' | 'right';
  duration: number;
  delay: number;
}

export interface Shape {
  kind: 'ring' | 'blob' | 'arc' | 'plus';
  x: number;
  y: number;
  size: number;
  colour: DecorColour;
  duration: number;
}

export interface Arrangement {
  squiggles: Squiggle[];
  dots: Dot[];
  shapes: Shape[];
}

/** A small deterministic generator, so each page always looks the same between visits. */
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const COLOURS: DecorColour[] = ['primary', 'secondary', 'muted', 'soft', 'lavender'];
const DRIFTS: Dot['drift'][] = ['down', 'left', 'right'];

/** Dots near the edges, a few gathered into little groups of three. */
function makeDots(seed: number, count: number): Dot[] {
  const random = seeded(seed);
  const dots: Dot[] = [];
  for (let i = 0; i < count; i += 1) {
    const left = random() < 0.5;
    const x = left ? 1 + random() * 9 : 90 + random() * 9;
    const y = random() * 92;
    const base: Dot = {
      x,
      y,
      size: 4 + Math.round(random() * 8),
      colour: COLOURS[Math.floor(random() * COLOURS.length)] ?? 'soft',
      drift: DRIFTS[Math.floor(random() * DRIFTS.length)] ?? 'down',
      duration: 9 + random() * 10,
      delay: -random() * 18,
    };
    dots.push(base);
    // Every fourth dot brings two companions, forming a loose cluster.
    if (i % 4 === 0) {
      dots.push({
        ...base,
        x: x + 1.4,
        y: y + 2,
        size: Math.max(3, base.size - 3),
        delay: base.delay - 0.6,
      });
      dots.push({
        ...base,
        x: x - 0.8,
        y: y + 3.2,
        size: Math.max(3, base.size - 4),
        delay: base.delay - 1.2,
      });
    }
  }
  return dots;
}

const ARRANGEMENTS: Record<DecorVariant, Arrangement> = {
  student: {
    squiggles: [
      { side: 'left', top: 14, colour: 'secondary', speed: 16 },
      { side: 'right', top: 52, colour: 'soft', speed: 19 },
    ],
    dots: makeDots(11, 9),
    shapes: [
      { kind: 'ring', x: 96, y: 84, size: 54, colour: 'soft', duration: 22 },
      { kind: 'plus', x: 4, y: 70, size: 22, colour: 'muted', duration: 18 },
    ],
  },
  learn: {
    squiggles: [{ side: 'right', top: 22, colour: 'secondary', speed: 18 }],
    dots: makeDots(23, 8),
    shapes: [{ kind: 'arc', x: 3, y: 40, size: 70, colour: 'soft', duration: 24 }],
  },
  textbook: {
    squiggles: [{ side: 'left', top: 30, colour: 'soft', speed: 21 }],
    dots: makeDots(31, 6),
    shapes: [{ kind: 'ring', x: 95, y: 64, size: 46, colour: 'lavender', duration: 26 }],
  },
  class: {
    squiggles: [
      { side: 'right', top: 12, colour: 'muted', speed: 17 },
      { side: 'left', top: 60, colour: 'secondary', speed: 20 },
    ],
    dots: makeDots(47, 7),
    shapes: [{ kind: 'blob', x: 95, y: 72, size: 60, colour: 'lavender', duration: 20 }],
  },
  tasks: {
    squiggles: [{ side: 'left', top: 18, colour: 'secondary', speed: 18 }],
    dots: makeDots(53, 8),
    shapes: [{ kind: 'plus', x: 95, y: 30, size: 20, colour: 'secondary', duration: 16 }],
  },
  shop: {
    squiggles: [
      { side: 'left', top: 20, colour: 'secondary', speed: 15 },
      { side: 'right', top: 40, colour: 'primary', speed: 18 },
    ],
    dots: makeDots(61, 11),
    shapes: [
      { kind: 'ring', x: 4, y: 78, size: 50, colour: 'soft', duration: 20 },
      { kind: 'blob', x: 96, y: 86, size: 56, colour: 'lavender', duration: 22 },
    ],
  },
  teacher: {
    squiggles: [
      { side: 'right', top: 16, colour: 'secondary', speed: 19 },
      { side: 'left', top: 56, colour: 'soft', speed: 22 },
    ],
    dots: makeDots(71, 7),
    shapes: [{ kind: 'ring', x: 96, y: 86, size: 48, colour: 'soft', duration: 24 }],
  },
  reports: {
    squiggles: [{ side: 'right', top: 58, colour: 'muted', speed: 20 }],
    dots: makeDots(83, 6),
    shapes: [{ kind: 'arc', x: 3, y: 86, size: 64, colour: 'soft', duration: 26 }],
  },
  auth: {
    squiggles: [
      { side: 'left', top: 10, colour: 'secondary', speed: 16 },
      { side: 'right', top: 46, colour: 'secondary', speed: 18 },
    ],
    dots: makeDots(97, 12),
    shapes: [
      { kind: 'blob', x: 5, y: 76, size: 70, colour: 'lavender', duration: 22 },
      { kind: 'ring', x: 96, y: 88, size: 52, colour: 'soft', duration: 24 },
    ],
  },
  calm: { squiggles: [], dots: makeDots(5, 2), shapes: [] },
};

export function arrangementFor(variant: DecorVariant): Arrangement {
  return ARRANGEMENTS[variant];
}

/** Which arrangement a page gets, from its address. Lessons and reading stay calm. */
export function decorVariantFor(pathname: string): DecorVariant {
  if (/^\/student\/learn\/[^/]+/.test(pathname)) return 'calm';
  if (/^\/student\/textbook\/[^/]+\/[^/]+/.test(pathname)) return 'calm';
  if (pathname.startsWith('/student/learn')) return 'learn';
  if (pathname.startsWith('/student/textbook')) return 'textbook';
  if (pathname.startsWith('/student/class/tasks')) return 'tasks';
  if (pathname.startsWith('/student/class')) return 'class';
  if (pathname.startsWith('/student/more/shop')) return 'shop';
  if (pathname.startsWith('/student')) return 'student';
  if (pathname.startsWith('/teacher/reports')) return 'reports';
  if (pathname.startsWith('/teacher/tasks')) return 'tasks';
  if (pathname.startsWith('/teacher/classes')) return 'class';
  if (pathname.startsWith('/teacher')) return 'teacher';
  return 'auth';
}
