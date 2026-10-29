/**
 * The editable source artwork for the MathsExpress capybara: the shapes of every body part in
 * each base view, in a 200 × 220 drawing space with the ground at y = 212.
 *
 * Five views are drawn here. The other three are exact mirror images, so the character can never
 * drift between them: `left` mirrors `right`, `front-left` mirrors `front-right` and `back-left`
 * mirrors `back-right`. Limbs are separate parts that rotate around their joints, and the face
 * is drawn on top by the renderer, so poses never redraw the body.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Ellipse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** Degrees. */
  rotate?: number;
}

export interface Joint extends Point {
  /** Drawn behind the body (the far side) or in front of it. */
  layer: 'back' | 'front';
}

export interface ViewRig {
  head: string;
  body: string;
  /** The big brown snout. In back views only the tip peeks out, so it is drawn behind the head. */
  snout?: {
    path: string;
    layer: 'back' | 'front';
    /** Clipped to the head outline, so the snout's outer edge is the head's own edge. */
    clip?: boolean;
  };
  nostrils: readonly Ellipse[];
  /** Eye centres. Front views show two eyes, three-quarter and side views one. */
  eyes: readonly Point[];
  /** Ears, drawn behind the head so only their rounded tops show. */
  ears: readonly { cx: number; cy: number; r: number }[];
  tuft: string;
  belly?: Ellipse;
  /** A soft, darker side for depth; clipped to the body. */
  shade?: Ellipse;
  tail?: Ellipse & { layer: 'back' | 'front' };
  shoulders: { left: Joint; right: Joint };
  hips: { left: Joint; right: Joint };
  /** How far the feet point forward from the hips: 0 when facing the viewer. */
  footOffset: number;
  /** The head turns around this point. */
  neck: Point;
}

export type BaseView = 'front' | 'front-right' | 'right' | 'back-right' | 'back';

export const GROUND_Y = 212;
export const CANVAS = { width: 200, height: 220 } as const;

/** The small two-strand tuft of hair on top of the head, with its base centred on (x, y). */
function tuftAt(x: number, y: number): string {
  return `M${x - 4.5} ${y + 1}C${x - 5} ${y - 4} ${x - 3} ${y - 8} ${x + 1} ${y - 9}C${x} ${y - 6} ${x + 1} ${y - 4} ${x + 2} ${y - 3}C${x + 3} ${y - 6} ${x + 5} ${y - 8} ${x + 8} ${y - 8}C${x + 6} ${y - 5} ${x + 5} ${y - 2} ${x + 5} ${y + 1}Z`;
}

const FRONT_HEAD =
  'M100 22C129 22 151 39 152 67C153 93 141 114 100 116C59 114 47 93 48 67C49 39 71 22 100 22Z';
const FRONT_BODY =
  'M100 90C129 90 150 108 155 140C159 166 157 186 142 193C130 198 115 199 100 199C85 199 70 198 58 193C43 186 41 166 45 140C50 108 71 90 100 90Z';

export const viewRigs: Record<BaseView, ViewRig> = {
  front: {
    head: FRONT_HEAD,
    body: FRONT_BODY,
    snout: {
      path: 'M100 69C118 69 129 76 129 89C129 103 117 110 100 110C83 110 71 103 71 89C71 76 82 69 100 69Z',
      layer: 'front',
    },
    nostrils: [
      { cx: 90, cy: 81, rx: 4, ry: 2.8, rotate: -14 },
      { cx: 110, cy: 81, rx: 4, ry: 2.8, rotate: 14 },
    ],
    eyes: [
      { x: 75, y: 62 },
      { x: 125, y: 62 },
    ],
    ears: [
      { cx: 64, cy: 31, r: 11 },
      { cx: 136, cy: 31, r: 11 },
    ],
    tuft: tuftAt(99, 24),
    belly: { cx: 100, cy: 160, rx: 33, ry: 34 },
    shoulders: {
      left: { x: 57, y: 124, layer: 'front' },
      right: { x: 143, y: 124, layer: 'front' },
    },
    hips: { left: { x: 80, y: 186, layer: 'front' }, right: { x: 120, y: 186, layer: 'front' } },
    footOffset: 0,
    neck: { x: 100, y: 112 },
  },
  'front-right': {
    head: 'M97 22C122 21 142 32 150 50C160 58 167 72 166 90C165 106 154 115 135 116C119 117 109 116 101 115C62 117 46 96 46 68C46 40 68 23 97 22Z',
    body: 'M103 90C131 90 151 109 155 141C158 168 155 187 140 194C128 199 113 200 100 200C86 200 71 199 60 193C45 186 42 166 47 140C52 109 74 90 103 90Z',
    snout: {
      path: 'M148 60C163 60 174 73 174 90C174 107 163 120 148 120C133 120 122 107 122 90C122 73 133 60 148 60Z',
      layer: 'front',
      clip: true,
    },
    nostrils: [{ cx: 159, cy: 71, rx: 3.4, ry: 2.5, rotate: 28 }],
    eyes: [{ x: 99, y: 60 }],
    ears: [
      { cx: 60, cy: 33, r: 11 },
      { cx: 127, cy: 25, r: 10 },
    ],
    tuft: tuftAt(94, 24),
    belly: { cx: 114, cy: 159, rx: 30, ry: 33 },
    shade: { cx: 44, cy: 156, rx: 20, ry: 60 },
    shoulders: {
      left: { x: 60, y: 124, layer: 'front' },
      right: { x: 145, y: 124, layer: 'front' },
    },
    hips: { left: { x: 84, y: 186, layer: 'front' }, right: { x: 122, y: 186, layer: 'front' } },
    footOffset: 3,
    neck: { x: 102, y: 112 },
  },
  right: {
    head: 'M84 24C106 20 128 25 144 36C160 47 172 60 177 76C182 94 172 110 152 113C128 117 102 118 87 114C63 108 50 90 52 66C54 42 66 27 84 24Z',
    body: 'M97 90C127 88 147 107 151 139C154 166 149 188 133 195C119 200 99 201 85 199C65 195 52 180 52 158C52 124 71 92 97 90Z',
    snout: {
      path: 'M162 50C181 50 196 66 196 86C196 106 181 122 162 122C143 122 130 106 130 86C130 66 143 50 162 50Z',
      layer: 'front',
      clip: true,
    },
    nostrils: [{ cx: 171, cy: 65, rx: 3.2, ry: 2.5, rotate: 34 }],
    eyes: [{ x: 113, y: 56 }],
    ears: [{ cx: 72, cy: 32, r: 11 }],
    tuft: tuftAt(86, 25),
    belly: { cx: 142, cy: 156, rx: 18, ry: 34 },
    shade: { cx: 52, cy: 156, rx: 16, ry: 58 },
    tail: { cx: 53, cy: 176, rx: 8, ry: 7, layer: 'back' },
    shoulders: {
      left: { x: 128, y: 122, layer: 'back' },
      right: { x: 116, y: 126, layer: 'front' },
    },
    hips: { left: { x: 90, y: 186, layer: 'back' }, right: { x: 110, y: 186, layer: 'front' } },
    footOffset: 6,
    neck: { x: 100, y: 112 },
  },
  'back-right': {
    head: 'M103 22C75 21 53 36 50 62C47 88 55 112 97 115C138 117 154 96 154 68C154 40 132 23 103 22Z',
    body: 'M97 90C69 90 49 109 45 141C42 168 45 187 60 194C72 199 87 200 100 200C114 200 129 199 140 193C155 186 158 166 153 140C148 109 126 90 97 90Z',
    snout: {
      path: 'M146 64C157 61 166 70 166 83C166 95 158 102 148 100C151 88 150 75 146 64Z',
      layer: 'back',
    },
    nostrils: [],
    eyes: [],
    ears: [
      { cx: 73, cy: 26, r: 11 },
      { cx: 140, cy: 33, r: 11 },
    ],
    tuft: tuftAt(106, 24),
    shade: { cx: 158, cy: 156, rx: 18, ry: 60 },
    tail: { cx: 90, cy: 184, rx: 8, ry: 7, layer: 'front' },
    shoulders: {
      left: { x: 55, y: 124, layer: 'front' },
      right: { x: 140, y: 124, layer: 'front' },
    },
    hips: { left: { x: 78, y: 186, layer: 'front' }, right: { x: 116, y: 186, layer: 'front' } },
    footOffset: 2,
    neck: { x: 98, y: 112 },
  },
  back: {
    head: FRONT_HEAD,
    body: FRONT_BODY,
    nostrils: [],
    eyes: [],
    ears: [
      { cx: 64, cy: 31, r: 11 },
      { cx: 136, cy: 31, r: 11 },
    ],
    tuft: tuftAt(101, 24),
    tail: { cx: 100, cy: 184, rx: 8.5, ry: 7.5, layer: 'front' },
    shoulders: {
      left: { x: 57, y: 124, layer: 'front' },
      right: { x: 143, y: 124, layer: 'front' },
    },
    hips: { left: { x: 80, y: 186, layer: 'front' }, right: { x: 120, y: 186, layer: 'front' } },
    footOffset: 0,
    neck: { x: 100, y: 112 },
  },
};

/** The lying-down body (facing right), used for resting and sleeping. */
export const lyingRig = {
  body: 'M40 212C22 212 16 196 20 180C26 156 56 140 100 140C130 140 150 150 160 168L162 212Z',
  head: 'M136 128C162 122 192 128 206 148C218 166 218 194 204 206C190 216 152 216 134 208C116 198 112 140 136 128Z',
  snout:
    'M208 134C228 134 242 154 242 177C242 200 228 220 208 220C188 220 176 200 176 177C176 154 188 134 208 134Z',
  nostril: { cx: 205, cy: 147, rx: 3.4, ry: 2.6, rotate: 30 },
  eye: { x: 158, y: 156 },
  ear: { cx: 140, cy: 132, r: 10.5 },
  tuft: tuftAt(158, 128),
  frontPaw: { cx: 160, cy: 210, rx: 13, ry: 6 },
  backFoot: { cx: 36, cy: 210, rx: 12, ry: 5.5 },
  tail: { cx: 19, cy: 186, rx: 7.5, ry: 6.5 },
  shade: { cx: 64, cy: 218, rx: 56, ry: 20 },
  neck: { x: 150, y: 204 },
  chest: { x: 100, y: 212 },
} as const;
