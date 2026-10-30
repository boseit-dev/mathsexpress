/**
 * The capybara's faces. It has no mouth in any pose, so emotion comes from the eyes, the
 * eyebrows and body language only.
 */

export type EyeShape =
  /** Simple black ovals: the everyday look. */
  | 'open'
  /** Bigger ovals with a highlight: surprised, excited. */
  | 'wide'
  /** Closed upward arcs: a smile in the eyes. */
  | 'happy'
  /** Closed downward arcs: calm and proud. */
  | 'content'
  /** Gentle closed lines: asleep. */
  | 'closed'
  /** Heavy lids. */
  | 'half'
  /** Slightly flattened ovals: concentrating. */
  | 'narrow';

export interface BrowSpec {
  /** How far above the normal brow line, in drawing units. */
  lift: number;
  /** Degrees; positive tips the inner end down (determined), negative tips it up (worried). */
  angle: number;
}

export interface ExpressionDef {
  label: string;
  eyes: EyeShape;
  /** Where the eyes look, in drawing units. */
  look?: { x: number; y: number };
  /** First brow, or both when `otherBrow` is not set. Null hides the brows. */
  brow: BrowSpec | null;
  /** The second brow in front views, for uneven expressions such as confused. */
  otherBrow?: BrowSpec;
}

export const expressions = {
  neutral: { label: 'Neutral', eyes: 'open', brow: null },
  happy: { label: 'Happy', eyes: 'happy', brow: { lift: 1, angle: 0 } },
  excited: { label: 'Excited', eyes: 'wide', brow: { lift: 4, angle: -6 } },
  surprised: { label: 'Surprised', eyes: 'wide', brow: { lift: 6, angle: 0 } },
  thinking: {
    label: 'Thinking',
    eyes: 'open',
    look: { x: 2, y: -2.5 },
    brow: { lift: 4, angle: -10 },
    otherBrow: { lift: 0, angle: 8 },
  },
  confused: {
    label: 'Confused',
    eyes: 'open',
    brow: { lift: 5, angle: -14 },
    otherBrow: { lift: 0, angle: 12 },
  },
  determined: { label: 'Determined', eyes: 'narrow', brow: { lift: -1, angle: 18 } },
  worried: {
    label: 'Worried',
    eyes: 'open',
    look: { x: 0, y: 1.5 },
    brow: { lift: 2, angle: -18 },
  },
  proud: { label: 'Proud', eyes: 'content', brow: { lift: 3, angle: -4 } },
  calm: { label: 'Calm', eyes: 'content', brow: null },
  sleepy: { label: 'Sleepy', eyes: 'half', brow: { lift: -1, angle: -6 } },
  sleeping: { label: 'Sleeping', eyes: 'closed', brow: null },
  curious: { label: 'Curious', eyes: 'wide', look: { x: 1.5, y: 0 }, brow: { lift: 3, angle: -8 } },
  focused: { label: 'Focused', eyes: 'narrow', look: { x: 1, y: 1 }, brow: { lift: 0, angle: 8 } },
  reading: { label: 'Reading', eyes: 'open', look: { x: 1.5, y: 2.5 }, brow: null },
  encouraging: { label: 'Encouraging', eyes: 'content', brow: { lift: 2, angle: -12 } },
} as const satisfies Record<string, ExpressionDef>;

export type ExpressionName = keyof typeof expressions;

export const expressionNames = Object.keys(expressions) as ExpressionName[];

/** Closed eyes don't blink. */
export function canBlink(name: ExpressionName): boolean {
  const eyes: EyeShape = expressions[name].eyes;
  return eyes === 'open' || eyes === 'wide' || eyes === 'narrow';
}
