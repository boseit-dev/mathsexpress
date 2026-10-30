import { poses, type PoseDef, type PoseName } from './poses';

export type AnimationGroup = 'movement' | 'learning' | 'feedback';

export interface AnimationDef {
  label: string;
  group: AnimationGroup;
  /** The pose the animation moves from. The keyframes in Mascot.module.css add the motion. */
  pose: PoseName;
  /** Changes to that pose while this animation plays. */
  override?: Partial<PoseDef>;
  /** Length of one cycle in milliseconds. Must match the keyframe timing in the CSS. */
  cycleMs: number;
  /**
   * Loops keep playing until something else is chosen. One-shot reactions play once and the
   * controller then returns to the resting animation.
   */
  loop: boolean;
  /** Adds the gentle breathing and blinking underneath. */
  ambient?: boolean;
  description: string;
}

export const mascotAnimations = {
  // Movement
  idle: {
    label: 'Idle breathing',
    group: 'movement',
    pose: 'standing',
    cycleMs: 7200,
    loop: true,
    ambient: true,
    description:
      'Breathes, blinks, glances around and twitches an ear now and then. The default resting state.',
  },
  blink: {
    label: 'Blinking',
    group: 'movement',
    pose: 'standing',
    cycleMs: 2600,
    loop: true,
    description: 'A natural double blink, then a pause.',
  },
  wave: {
    label: 'Waving',
    group: 'movement',
    pose: 'waving',
    cycleMs: 1800,
    loop: false,
    ambient: true,
    description: 'A friendly hello: three waves with a small head tilt.',
  },
  walk: {
    label: 'Walking',
    group: 'movement',
    pose: 'walking',
    override: { legs: { left: 0, right: 0 }, arms: { left: { raise: 6 }, right: { raise: 6 } } },
    cycleMs: 900,
    loop: true,
    description: 'An easy walk cycle on the spot: legs, arms and a soft bob.',
  },
  run: {
    label: 'Running',
    group: 'movement',
    pose: 'running',
    override: { legs: { left: 0, right: 0 }, arms: { left: { raise: 6 }, right: { raise: 6 } } },
    cycleMs: 480,
    loop: true,
    description: 'A faster cycle, leaning forward, with speed lines.',
  },
  jump: {
    label: 'Jumping',
    group: 'movement',
    pose: 'jumping',
    override: { shift: { y: 0 }, legs: { left: 0, right: 0 } },
    cycleMs: 1100,
    loop: false,
    description: 'Crouches, springs up and lands with a soft squash.',
  },
  peek: {
    label: 'Peeking',
    group: 'movement',
    pose: 'peeking',
    cycleMs: 3600,
    loop: true,
    description: 'Peeks out from behind a wall, looks around, ducks back and peeks out again.',
  },
  sleep: {
    label: 'Sleeping',
    group: 'movement',
    pose: 'sleeping',
    cycleMs: 3600,
    loop: true,
    description: 'Lies down and breathes slowly while z’s float up.',
  },
  wakeUp: {
    label: 'Waking up',
    group: 'movement',
    pose: 'waking',
    cycleMs: 2800,
    loop: false,
    description: 'Opens its eyes, stretches both arms up and settles.',
  },
  // Learning
  thinking: {
    label: 'Thinking',
    group: 'learning',
    pose: 'thinking',
    cycleMs: 2400,
    loop: true,
    ambient: true,
    description: 'Paw on chin and eyes up while thought bubbles appear in turn.',
  },
  confused: {
    label: 'Confused',
    group: 'learning',
    pose: 'confused',
    cycleMs: 2000,
    loop: true,
    description: 'Scratches its head and tilts side to side under a question mark.',
  },
  idea: {
    label: 'Lightbulb idea',
    group: 'learning',
    pose: 'idea',
    cycleMs: 2400,
    loop: false,
    description: 'A lightbulb pops on above its head and glows.',
  },
  reading: {
    label: 'Reading',
    group: 'learning',
    pose: 'reading',
    cycleMs: 3600,
    loop: true,
    ambient: true,
    description: 'Sits with a book, eyes moving along the lines, turning a page.',
  },
  writing: {
    label: 'Writing maths',
    group: 'learning',
    pose: 'writing',
    cycleMs: 1800,
    loop: true,
    ambient: true,
    description: 'Writes at a desk; the working appears line by line.',
  },
  teaching: {
    label: 'Teaching',
    group: 'learning',
    pose: 'teaching',
    cycleMs: 2400,
    loop: true,
    ambient: true,
    description: 'Taps the whiteboard with a pointer as the sum appears.',
  },
  calculator: {
    label: 'Using a calculator',
    group: 'learning',
    pose: 'calculator',
    cycleMs: 1400,
    loop: true,
    ambient: true,
    description: 'Taps calculator keys while the screen updates.',
  },
  encouraging: {
    label: 'Encouraging',
    group: 'learning',
    pose: 'thumbsUp',
    cycleMs: 1600,
    loop: false,
    ambient: true,
    description: 'A bouncy thumbs-up with sparkles: “you’ve got this”.',
  },
  // Feedback and rewards
  correct: {
    label: 'Correct answer',
    group: 'feedback',
    pose: 'cheering',
    cycleMs: 1300,
    loop: false,
    description: 'A small happy hop with arms up and a few stars.',
  },
  incorrect: {
    label: 'Incorrect answer',
    group: 'feedback',
    pose: 'supportive',
    cycleMs: 2200,
    loop: false,
    ambient: true,
    description: 'A kind, reassuring nod and an open paw. Never mocking.',
  },
  clap: {
    label: 'Clapping',
    group: 'feedback',
    pose: 'clapping',
    cycleMs: 720,
    loop: true,
    description: 'Claps in front of its chest with little sparkles.',
  },
  dance: {
    label: 'Victory dance',
    group: 'feedback',
    pose: 'danceStep',
    cycleMs: 1200,
    loop: true,
    description: 'Sways, steps and swaps arms to the beat.',
  },
  medal: {
    label: 'Medal presentation',
    group: 'feedback',
    pose: 'medal',
    cycleMs: 2400,
    loop: false,
    ambient: true,
    description: 'Lifts a medal that swings and shines.',
  },
  lessonComplete: {
    label: 'Lesson completed',
    group: 'feedback',
    pose: 'graduate',
    cycleMs: 2400,
    loop: false,
    description: 'A full celebration: mortarboard, jump and a confetti burst.',
  },
  levelUp: {
    label: 'Level up',
    group: 'feedback',
    pose: 'levelUp',
    cycleMs: 2600,
    loop: false,
    description: 'Rises in a golden glow with twinkling stars. Used for perfect scores.',
  },
} as const satisfies Record<string, AnimationDef>;

export type AnimationName = keyof typeof mascotAnimations;

export const animationNames = Object.keys(mascotAnimations) as AnimationName[];

/** The pose an animation starts from, with its overrides applied. */
export function animationPose(name: AnimationName): PoseDef {
  const def: AnimationDef = mascotAnimations[name];
  return { ...poses[def.pose], ...def.override };
}
