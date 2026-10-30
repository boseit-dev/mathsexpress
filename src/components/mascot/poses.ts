import type { ExpressionName } from './expressions';

/** The eight directions the capybara can face. "Right" means facing the right of the screen. */
export type MascotView =
  'front' | 'front-right' | 'right' | 'back-right' | 'back' | 'back-left' | 'left' | 'front-left';

export const mascotViews: readonly MascotView[] = [
  'front',
  'front-right',
  'right',
  'back-right',
  'back',
  'back-left',
  'left',
  'front-left',
];

/** Things the capybara holds. They move with its paw. */
export type HeldProp = 'calculator' | 'pointer' | 'pencil' | 'medal' | 'thumb';

/** Things held in front of the body with both paws, or worn. They move with the body. */
export type BodyProp = 'book' | 'certificate' | 'hat';

/** Scenery and effects placed around the capybara. */
export type SceneProp =
  | 'whiteboard'
  | 'desk'
  | 'laptop'
  | 'wall'
  | 'lightbulb'
  | 'question'
  | 'thought'
  | 'stars'
  | 'sparkles'
  | 'confetti'
  | 'zzz'
  | 'notes'
  | 'speed'
  | 'glow'
  | 'hearts';

export interface ArmPose {
  /**
   * Degrees the arm is lifted away from the body: 0 hangs straight down, 90 points out to the
   * side, 160 is overhead and negative values cross in front of the body.
   */
  raise: number;
  /**
   * Elbow bend in degrees, in the same direction as `raise`: positive lifts the forearm further
   * up or out, negative folds it in towards the body.
   */
  bend?: number;
  holds?: HeldProp;
}

export interface PoseDef {
  label: string;
  view: MascotView;
  /** `lie` uses the lying-down body; `sit` folds the legs forward. */
  body: 'stand' | 'sit' | 'lie';
  expression: ExpressionName;
  arms: { left: ArmPose; right: ArmPose };
  /** Leg swing in degrees around the hips; positive swings the foot backwards. */
  legs?: { left: number; right: number };
  /** Head tilt in degrees; positive tips the top of the head forwards. */
  head?: number;
  /** Whole-body lean in degrees around the feet. */
  lean?: number;
  /** Moves the whole character, in drawing units (negative y is up). */
  shift?: { x?: number; y?: number };
  bodyProps?: readonly BodyProp[];
  scene?: readonly SceneProp[];
  /** Wider framing for poses with scenery beside the character. */
  frame?: 'standard' | 'wide';
}

/** Which layer each piece of scenery is drawn in. */
export const SCENE_LAYERS: Record<SceneProp, 'back' | 'front' | 'fx'> = {
  glow: 'back',
  whiteboard: 'back',
  speed: 'back',
  desk: 'front',
  laptop: 'front',
  wall: 'front',
  lightbulb: 'fx',
  question: 'fx',
  thought: 'fx',
  stars: 'fx',
  sparkles: 'fx',
  hearts: 'fx',
  confetti: 'fx',
  zzz: 'fx',
  notes: 'fx',
};

const rest: ArmPose = { raise: 13, bend: -8 };

export const poses = {
  standing: {
    label: 'Standing',
    view: 'front-right',
    body: 'stand',
    expression: 'neutral',
    arms: { left: rest, right: rest },
  },
  waving: {
    label: 'Waving',
    view: 'front-right',
    body: 'stand',
    expression: 'happy',
    arms: { left: rest, right: { raise: 112, bend: 50 } },
    head: -4,
  },
  walking: {
    label: 'Walking',
    view: 'right',
    body: 'stand',
    expression: 'neutral',
    arms: { left: { raise: 14, bend: -14 }, right: { raise: 14, bend: -14 } },
    legs: { left: 16, right: -16 },
  },
  running: {
    label: 'Running',
    view: 'right',
    body: 'stand',
    expression: 'determined',
    arms: { left: { raise: -36, bend: -50 }, right: { raise: 48, bend: 55 } },
    legs: { left: 30, right: -34 },
    lean: 9,
    scene: ['speed'],
  },
  jumping: {
    label: 'Jumping',
    view: 'front-right',
    body: 'stand',
    expression: 'excited',
    arms: { left: { raise: 145, bend: 14 }, right: { raise: 150, bend: 14 } },
    legs: { left: -14, right: 14 },
    shift: { y: -22 },
    scene: ['sparkles'],
  },
  sitting: {
    label: 'Sitting',
    view: 'front-right',
    body: 'sit',
    expression: 'happy',
    arms: { left: { raise: -14 }, right: { raise: -8 } },
  },
  lyingDown: {
    label: 'Lying down',
    view: 'right',
    body: 'lie',
    expression: 'calm',
    arms: { left: rest, right: rest },
  },
  sleeping: {
    label: 'Sleeping',
    view: 'right',
    body: 'lie',
    expression: 'sleeping',
    arms: { left: rest, right: rest },
    scene: ['zzz'],
  },
  reading: {
    label: 'Reading a book',
    view: 'front-right',
    body: 'sit',
    expression: 'reading',
    arms: { left: { raise: -16, bend: -42 }, right: { raise: -2, bend: -36 } },
    head: 5,
    bodyProps: ['book'],
  },
  calculator: {
    label: 'Holding a calculator',
    view: 'front-right',
    body: 'stand',
    expression: 'focused',
    arms: {
      left: { raise: -30, bend: -56 },
      right: { raise: -14, bend: -52, holds: 'calculator' },
    },
    head: 4,
  },
  pointing: {
    label: 'Pointing with a pointer',
    view: 'front-right',
    body: 'stand',
    expression: 'happy',
    arms: { left: rest, right: { raise: 100, bend: -6, holds: 'pointer' } },
    scene: ['sparkles'],
  },
  teaching: {
    label: 'Teaching at a whiteboard',
    view: 'front-right',
    body: 'stand',
    expression: 'happy',
    arms: { left: rest, right: { raise: 112, bend: 4, holds: 'pointer' } },
    scene: ['whiteboard'],
    frame: 'wide',
  },
  thinking: {
    label: 'Thinking',
    view: 'front-right',
    body: 'stand',
    expression: 'thinking',
    arms: { left: { raise: -26, bend: -46 }, right: { raise: -16, bend: -118 } },
    head: 6,
    scene: ['thought'],
  },
  confused: {
    label: 'Confused',
    view: 'front-right',
    body: 'stand',
    expression: 'confused',
    arms: { left: rest, right: { raise: 128, bend: 62 } },
    head: -8,
    scene: ['question'],
  },
  idea: {
    label: 'Lightbulb idea',
    view: 'front-right',
    body: 'stand',
    expression: 'excited',
    arms: { left: rest, right: { raise: 150, bend: 18 } },
    scene: ['lightbulb'],
  },
  celebrating: {
    label: 'Celebrating',
    view: 'front',
    body: 'stand',
    expression: 'excited',
    arms: { left: { raise: 145, bend: 18 }, right: { raise: 145, bend: 18 } },
    scene: ['confetti', 'stars'],
  },
  clapping: {
    label: 'Clapping',
    view: 'front-right',
    body: 'stand',
    expression: 'happy',
    arms: { left: { raise: -44, bend: -48 }, right: { raise: -40, bend: -48 } },
    scene: ['sparkles'],
  },
  thumbsUp: {
    label: 'Thumbs-up',
    view: 'front-right',
    body: 'stand',
    expression: 'happy',
    arms: { left: rest, right: { raise: 36, bend: 64, holds: 'thumb' } },
    scene: ['sparkles'],
  },
  supportive: {
    label: 'Supportive',
    view: 'front-right',
    body: 'stand',
    expression: 'encouraging',
    arms: { left: rest, right: { raise: -22, bend: -40 } },
    head: 7,
    scene: ['hearts'],
  },
  medal: {
    label: 'Holding a medal',
    view: 'front-right',
    body: 'stand',
    expression: 'proud',
    arms: { left: rest, right: { raise: 122, bend: 22, holds: 'medal' } },
    scene: ['sparkles'],
  },
  certificate: {
    label: 'Holding a certificate',
    view: 'front-right',
    body: 'stand',
    expression: 'proud',
    arms: { left: { raise: -18, bend: -40 }, right: { raise: -4, bend: -38 } },
    bodyProps: ['certificate'],
  },
  writing: {
    label: 'Writing maths',
    view: 'front-right',
    body: 'stand',
    expression: 'focused',
    arms: { left: { raise: -26, bend: -40 }, right: { raise: -16, bend: -38, holds: 'pencil' } },
    head: 8,
    scene: ['desk'],
  },
  laptop: {
    label: 'Using a laptop',
    view: 'front-right',
    body: 'sit',
    expression: 'focused',
    arms: { left: { raise: -30, bend: -42 }, right: { raise: -12, bend: -40 } },
    head: 4,
    scene: ['laptop'],
  },
  peeking: {
    label: 'Peeking around a wall',
    view: 'front-left',
    body: 'stand',
    expression: 'curious',
    arms: { left: rest, right: rest },
    head: -6,
    shift: { x: -18 },
    scene: ['wall'],
  },
  cheering: {
    label: 'Cheering',
    view: 'front-right',
    body: 'stand',
    expression: 'happy',
    arms: { left: { raise: 124, bend: 24 }, right: { raise: 134, bend: 24 } },
    scene: ['stars'],
  },
  waking: {
    label: 'Waking up',
    view: 'front-right',
    body: 'stand',
    expression: 'neutral',
    arms: { left: rest, right: rest },
  },
  danceStep: {
    label: 'Victory dance',
    view: 'front',
    body: 'stand',
    expression: 'happy',
    arms: { left: { raise: 145, bend: 20 }, right: { raise: 40, bend: 56 } },
    legs: { left: -10, right: 0 },
    scene: ['notes'],
  },
  graduate: {
    label: 'Lesson complete',
    view: 'front',
    body: 'stand',
    expression: 'excited',
    arms: { left: { raise: 145, bend: 18 }, right: { raise: 145, bend: 18 } },
    bodyProps: ['hat'],
    scene: ['confetti', 'stars'],
  },
  levelUp: {
    label: 'Level up',
    view: 'front',
    body: 'stand',
    expression: 'proud',
    arms: { left: { raise: 132, bend: 28 }, right: { raise: 132, bend: 28 } },
    scene: ['glow', 'stars'],
  },
} as const satisfies Record<string, PoseDef>;

export type PoseName = keyof typeof poses;

export const poseNames = Object.keys(poses) as PoseName[];

export function getPose(name: PoseName): PoseDef {
  return poses[name];
}
