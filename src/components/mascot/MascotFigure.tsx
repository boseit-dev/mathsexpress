import { useId, type CSSProperties, type ReactNode, type Ref } from 'react';
import { mascotPalette as m } from '@/assets/mascot/palette';
import {
  CANVAS,
  GROUND_Y,
  lyingRig,
  viewRigs,
  type BaseView,
  type Ellipse,
  type Joint,
  type Point,
  type ViewRig,
} from '@/assets/mascot/rig';
import { expressions, type BrowSpec, type EyeShape, type ExpressionName } from './expressions';
import { BodyPropArt, HeldPropArt, SceneBackArt, SceneFrontArt, SceneFxArt } from './PropArt';
import { FRAMES, resolveView } from './layout';
import { SCENE_LAYERS, type ArmPose, type MascotView, type PoseDef } from './poses';
import styles from './Mascot.module.css';

function ellipseProps({ cx, cy, rx, ry, rotate }: Ellipse) {
  return {
    cx,
    cy,
    rx,
    ry,
    transform: rotate ? `rotate(${rotate} ${cx} ${cy})` : undefined,
  };
}

/**
 * A joint: its children turn around `at`. The outer transform is the pose (it eases between
 * poses); the inner group is free for keyframe animation named by `part`.
 */
function Joint({
  part,
  at,
  turn = 0,
  extra = '',
  local = false,
  vars,
  children,
}: {
  part: string;
  at: Point;
  turn?: number;
  extra?: string;
  /** Children are drawn around (0, 0) instead of in drawing coordinates. */
  local?: boolean;
  /** CSS custom properties for the keyframes, such as an ear's swing direction. */
  vars?: CSSProperties;
  children: ReactNode;
}) {
  const pose = `${extra} rotate(${turn}deg)`.trim();
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <g className={styles.pose} style={{ transform: pose }}>
        <g className={styles.motion} data-p={part} style={vars}>
          {local ? children : <g transform={`translate(${-at.x} ${-at.y})`}>{children}</g>}
        </g>
      </g>
    </g>
  );
}

/**
 * How each eye shape is made from one eyeball and two eyelids. Expressions only move the lids
 * and scale the eyeball, so changing expression animates smoothly (a smile squeezes the lower
 * lid up, a blink drops the upper lid) instead of swapping drawings.
 */
const EYE_SHAPES: Record<
  EyeShape,
  { top: number; bottom: number; scale: number; lash?: 'flat' | 'smile'; shine?: boolean }
> = {
  open: { top: 0, bottom: 0, scale: 1 },
  wide: { top: 0, bottom: 0, scale: 1.14, shine: true },
  narrow: { top: 4.5, bottom: 2.5, scale: 1 },
  happy: { top: 0, bottom: 9.5, scale: 1.06 },
  content: { top: 14, bottom: 0, scale: 1, lash: 'smile' },
  closed: { top: 14, bottom: 0, scale: 1, lash: 'flat' },
  half: { top: 6.5, bottom: 0, scale: 1 },
};

const LASHES = { flat: 'M-5.4 0.6Q0 3.4 5.4 0.6', smile: 'M-5.4 -1Q0 4.6 5.4 -1' } as const;

function Eye({ shape, x, y, eyeClip }: { shape: EyeShape; x: number; y: number; eyeClip: string }) {
  const lids = EYE_SHAPES[shape];
  return (
    <g transform={`translate(${x} ${y})`}>
      <g clipPath={`url(#${eyeClip})`}>
        <ellipse
          className={styles.eyePart}
          rx="4.8"
          ry="6.6"
          fill={m.eye}
          style={{ transform: `scale(${lids.scale})` }}
        />
        <circle
          className={styles.eyePart}
          cx="1.8"
          cy="-2.9"
          r="1.7"
          fill={m.highlight}
          style={{ opacity: lids.shine ? 1 : 0 }}
        />
        <g className={styles.eyePart} style={{ transform: `translateY(${-lids.bottom}px)` }}>
          <path d="M-11 24H11V10Q0 4 -11 10Z" fill={m.body} />
        </g>
        <g className={styles.eyePart} style={{ transform: `translateY(${lids.top}px)` }}>
          <g className={styles.motion} data-p="lid">
            <path d="M-11 -24H11V-8.5Q0 -5.5 -11 -8.5Z" fill={m.body} />
          </g>
        </g>
      </g>
      {(['flat', 'smile'] as const).map((lash) => (
        <path
          key={lash}
          className={styles.eyePart}
          d={LASHES[lash]}
          fill="none"
          stroke={m.eye}
          strokeWidth="2.6"
          strokeLinecap="round"
          style={{ opacity: lids.lash === lash ? 1 : 0 }}
        />
      ))}
    </g>
  );
}

function Brow({
  spec,
  x,
  y,
  mirror,
}: {
  spec: BrowSpec | null;
  x: number;
  y: number;
  mirror: boolean;
}) {
  const angle = spec ? (mirror ? -spec.angle : spec.angle) : 0;
  const lift = spec?.lift ?? 0;
  return (
    <path
      className={styles.eyePart}
      d="M-5.6 1Q0 -2 5.6 1"
      style={{
        transform: `translate(${x}px, ${y - 12 - lift}px) rotate(${angle}deg)`,
        opacity: spec ? 1 : 0,
      }}
      fill="none"
      stroke={m.brow}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  );
}

function Face({
  rig,
  expression,
  clipId,
}: {
  rig: Pick<ViewRig, 'eyes'>;
  expression: ExpressionName;
  clipId: string;
}) {
  const def = expressions[expression];
  const look = 'look' in def ? def.look : { x: 0, y: 0 };
  if (rig.eyes.length === 0) return null;
  const eyeLine = rig.eyes.reduce((sum, eye) => sum + eye.y, 0) / rig.eyes.length;
  const eyeCentre = rig.eyes.reduce((sum, eye) => sum + eye.x, 0) / rig.eyes.length;
  return (
    <>
      <Joint
        part="eyes"
        at={{ x: eyeCentre, y: eyeLine }}
        extra={`translate(${look.x}px, ${look.y}px)`}
      >
        {rig.eyes.map((eye) => (
          <Eye key={eye.x} shape={def.eyes} x={eye.x} y={eye.y} eyeClip={`${clipId}-eye`} />
        ))}
      </Joint>
      <g data-p="brows">
        {rig.eyes.map((eye, i) => {
          const spec: BrowSpec | null = i === 1 && 'otherBrow' in def ? def.otherBrow : def.brow;
          return <Brow key={eye.x} spec={spec} x={eye.x} y={eye.y} mirror={i === 1} />;
        })}
      </g>
    </>
  );
}

/** Where the paw sits on the forearm, which is drawn hanging from the elbow at (0, 0). */
const PAW_Y = 12;
const ELBOW_Y = 17;

/**
 * An arm with an elbow: the upper arm hangs from the shoulder at (0, 0) and the forearm from
 * the elbow, so arms bend naturally and paws can wave, clap and hold things. The shoulder
 * itself moves a little too, up and out when the arm is raised and inwards when it reaches
 * across the body, so raised paws clear the big head and both paws can meet.
 */
function Arm({
  side,
  joint,
  pose,
  far,
  shrug,
}: {
  side: 'left' | 'right';
  joint: Joint;
  pose: ArmPose;
  far: boolean;
  shrug: boolean;
}) {
  const sign = side === 'left' ? 1 : -1;
  const turn = sign * pose.raise;
  const bend = sign * (pose.bend ?? 0);
  const outward = -sign;
  const up = shrug ? Math.min(Math.max(pose.raise / 140, 0), 1) : 0;
  const across = shrug ? Math.min(Math.max(-pose.raise / 80, 0), 1) : 0;
  const dx = outward * (6 * up - 9 * across);
  const dy = -9 * up - 2 * across;
  const held = pose.holds;
  const fill = far ? m.bodyFar : m.bodyDark;
  return (
    <Joint
      part={`arm-${side}`}
      at={joint}
      turn={turn}
      extra={dx || dy ? `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` : ''}
      local
      // --s turns keyframes written for "raise" into the right direction for each side.
      vars={{ '--s': sign } as CSSProperties}
    >
      <rect x="-8.5" y="-8" width="17" height="30" rx="8.5" fill={fill} />
      <Joint
        part={`forearm-${side}`}
        at={{ x: 0, y: ELBOW_Y }}
        turn={bend}
        local
        vars={{ '--s': sign } as CSSProperties}
      >
        {held && held !== 'thumb' && <HeldPropArt prop={held} armTurn={turn + bend} pawY={PAW_Y} />}
        <rect x="-8" y="-7" width="16" height="24" rx="8" fill={fill} />
        <circle cy={PAW_Y + 1} r="8.6" fill={fill} />
        {held === 'thumb' && <HeldPropArt prop={held} armTurn={turn + bend} pawY={PAW_Y} />}
      </Joint>
    </Joint>
  );
}

/** The base of the hair tuft, read from the start of its path, so it can bounce on its own. */
function tuftBase(path: string): Point {
  const match = /^M(-?[\d.]+) (-?[\d.]+)/.exec(path);
  return { x: Number(match?.[1] ?? 100) + 5, y: Number(match?.[2] ?? 24) };
}

function Ear({ ear }: { ear: { cx: number; cy: number; r: number } }) {
  const outer = ear.cx < 100 ? -1 : 1;
  return (
    <Joint
      part="ear"
      at={{ x: ear.cx - outer * ear.r * 0.3, y: ear.cy + ear.r * 0.75 }}
      vars={{ '--ear': outer } as CSSProperties}
    >
      <circle cx={ear.cx} cy={ear.cy} r={ear.r} fill={m.bodyDark} />
      <circle cx={ear.cx - outer * 2} cy={ear.cy + 1} r={ear.r * 0.48} fill={m.earInner} />
    </Joint>
  );
}

function Tuft({ path }: { path: string }) {
  return (
    <Joint part="tuft" at={tuftBase(path)}>
      <path d={path} fill={m.bodyDark} />
    </Joint>
  );
}

function Leg({
  side,
  joint,
  swing,
  footOffset,
  far,
}: {
  side: 'left' | 'right';
  joint: Joint;
  swing: number;
  footOffset: number;
  far: boolean;
}) {
  return (
    <Joint part={`leg-${side}`} at={joint} turn={swing} local>
      <rect x="-11" y="-10" width="22" height="30" rx="10" fill={far ? m.bodyFar : m.bodyDark} />
      <ellipse cx={footOffset} cy="19.5" rx="14.5" ry="7.5" fill={far ? m.feetFar : m.feet} />
    </Joint>
  );
}

/** Legs folded forward for sitting, drawn in front of the body. */
function SittingLegs({ rig, base }: { rig: ViewRig; base: BaseView }) {
  const facing = base === 'front' ? 0 : 1;
  return (
    <g data-p="sit-legs">
      {(['left', 'right'] as const).map((side) => {
        const hip = rig.hips[side];
        const x = hip.x + facing * 12;
        return (
          <g key={side}>
            <ellipse cx={x} cy="201" rx={facing ? 19 : 15} ry="11" fill={m.bodyDark} />
            <ellipse cx={x + facing * 15} cy="202" rx={facing ? 8 : 10} ry="9" fill={m.feet} />
          </g>
        );
      })}
    </g>
  );
}

function StandingFigure({
  rig,
  base,
  pose,
  clipId,
}: {
  rig: ViewRig;
  base: BaseView;
  pose: PoseDef;
  clipId: string;
}) {
  const sitting = pose.body === 'sit';
  const legs = pose.legs ?? { left: 0, right: 0 };
  const limbs = (layer: 'back' | 'front') =>
    (['left', 'right'] as const).filter((side) => rig.shoulders[side].layer === layer);
  const legsIn = (layer: 'back' | 'front') =>
    (['left', 'right'] as const).filter((side) => rig.hips[side].layer === layer);
  const sideView = base === 'right';
  const torsoTransform = sitting ? 'translateY(7px) scale(1.03, 0.94)' : '';

  const arm = (side: 'left' | 'right', layer: 'back' | 'front') => (
    <Arm
      key={side}
      side={side}
      joint={rig.shoulders[side]}
      pose={pose.arms[side]}
      far={sideView && layer === 'back'}
      shrug={!sideView}
    />
  );
  const leg = (side: 'left' | 'right', layer: 'back' | 'front') => (
    <Leg
      key={side}
      side={side}
      joint={rig.hips[side]}
      swing={legs[side]}
      footOffset={rig.footOffset}
      far={sideView && layer === 'back'}
    />
  );

  return (
    <>
      {!sitting && legsIn('back').map((side) => leg(side, 'back'))}
      {!sitting && legsIn('front').map((side) => leg(side, 'front'))}
      <Joint part="torso" at={{ x: 100, y: 211 }} turn={pose.lean ?? 0} extra={torsoTransform}>
        {limbs('back').map((side) => arm(side, 'back'))}
        {rig.tail?.layer === 'back' && <ellipse {...ellipseProps(rig.tail)} fill={m.bodyDark} />}
        <path d={rig.body} fill={m.body} />
        <g clipPath={`url(#${clipId})`}>
          {rig.belly && <ellipse {...ellipseProps(rig.belly)} fill={m.belly} />}
          {rig.shade && <ellipse {...ellipseProps(rig.shade)} fill={m.bodyDark} opacity="0.26" />}
          {/* Soft volume: a darker base and a gentle light from the upper left. */}
          <ellipse cx="100" cy="206" rx="70" ry="20" fill={m.bodyDark} opacity="0.2" />
          <path d={rig.body} fill={`url(#${clipId}-soft)`} />
        </g>
        {rig.tail?.layer === 'front' && <ellipse {...ellipseProps(rig.tail)} fill={m.bodyDark} />}
        <Joint part="head" at={rig.neck} turn={pose.head ?? 0}>
          {rig.ears.map((ear) => (
            <Ear key={ear.cx} ear={ear} />
          ))}
          {rig.snout?.layer === 'back' && <path d={rig.snout.path} fill={m.snout} />}
          <path d={rig.head} fill={m.body} />
          <path d={rig.head} fill={`url(#${clipId}-shine)`} />
          <Tuft path={rig.tuft} />
          {rig.snout?.layer === 'front' && (
            <g clipPath={rig.snout.clip ? `url(#${clipId}-head)` : undefined}>
              <path d={rig.snout.path} fill={m.snout} />
              <path d={rig.snout.path} fill={`url(#${clipId}-soft)`} />
            </g>
          )}
          {rig.nostrils.map((nostril) => (
            <ellipse key={nostril.cx} {...ellipseProps(nostril)} fill={m.nostril} />
          ))}
          <Face rig={rig} expression={pose.expression} clipId={clipId} />
          {pose.bodyProps?.includes('hat') && <BodyPropArt prop="hat" />}
        </Joint>
        {pose.bodyProps
          ?.filter((prop) => prop !== 'hat')
          .map((prop) => (
            <BodyPropArt key={prop} prop={prop} />
          ))}
        {limbs('front').map((side) => arm(side, 'front'))}
      </Joint>
      {sitting && <SittingLegs rig={rig} base={base} />}
    </>
  );
}

function LyingFigure({ pose, clipId }: { pose: PoseDef; clipId: string }) {
  const r = lyingRig;
  return (
    // The lying body is long, so it sits a little left of centre to keep the snout in frame.
    <g transform="translate(-16 0)">
      <Joint part="torso" at={r.chest}>
        <ellipse {...ellipseProps(r.tail)} fill={m.bodyDark} />
        <ellipse {...ellipseProps(r.backFoot)} fill={m.feetFar} />
        <path d={r.body} fill={m.body} />
        <path d={r.body} fill={`url(#${clipId}-soft)`} />
        <ellipse
          {...ellipseProps(r.shade)}
          fill={m.bodyDark}
          opacity="0.22"
          clipPath={`url(#${clipId})`}
        />
        <Joint part="head" at={r.neck} turn={pose.head ?? 0}>
          <Ear ear={r.ear} />
          <path d={r.head} fill={m.body} />
          <path d={r.head} fill={`url(#${clipId}-shine)`} />
          <Tuft path={r.tuft} />
          <g clipPath={`url(#${clipId}-head)`}>
            <path d={r.snout} fill={m.snout} />
            <path d={r.snout} fill={`url(#${clipId}-soft)`} />
          </g>
          <ellipse {...ellipseProps(r.nostril)} fill={m.nostril} />
          <Face rig={{ eyes: [r.eye] }} expression={pose.expression} clipId={clipId} />
        </Joint>
        <ellipse {...ellipseProps(r.frontPaw)} fill={m.feet} />
      </Joint>
    </g>
  );
}

export interface MascotFigureProps {
  pose: PoseDef;
  /** Overrides the pose's own direction, e.g. for the turnaround views. */
  view?: MascotView;
  className?: string;
  style?: CSSProperties;
  /** Data attributes that pick the keyframe animation in Mascot.module.css. */
  dataAttributes?: Record<string, string | undefined>;
  title?: string;
  ref?: Ref<SVGSVGElement>;
}

/** Draws the capybara in one pose. Purely presentational: animation is chosen by CSS. */
export function MascotFigure({
  pose,
  view,
  className,
  style,
  dataAttributes,
  title,
  ref,
}: MascotFigureProps) {
  const clipId = `mascot-body-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const facing = view ?? pose.view;
  const { base, mirrored } = resolveView(facing);
  const rig = viewRigs[base];
  const frame = FRAMES[pose.frame ?? 'standard'];
  const scene = pose.scene ?? [];
  const inLayer = (layer: 'back' | 'front' | 'fx') =>
    scene.filter((prop) => SCENE_LAYERS[prop] === layer);
  const shift = pose.shift ?? {};
  const lying = pose.body === 'lie';

  return (
    <svg
      ref={ref}
      viewBox={`${frame.x} ${frame.y} ${frame.width} ${frame.height}`}
      className={className}
      style={style}
      data-view={facing}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...dataAttributes}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={lying ? lyingRig.body : rig.body} />
        </clipPath>
        <clipPath id={`${clipId}-head`}>
          <path d={lying ? lyingRig.head : rig.head} />
        </clipPath>
        {/* Each eye's lids only show inside this circle around the eye. */}
        <clipPath id={`${clipId}-eye`}>
          <circle r="10" />
        </clipPath>
        <radialGradient id={`${clipId}-shine`} cx="0.4" cy="0.1" r="0.26">
          <stop offset="0" stopColor={m.highlight} stopOpacity="0.38" />
          <stop offset="1" stopColor={m.highlight} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${clipId}-soft`} cx="0.3" cy="0.2" r="0.6">
          <stop offset="0" stopColor={m.highlight} stopOpacity="0.22" />
          <stop offset="1" stopColor={m.highlight} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g data-layer="scene-back">
        {inLayer('back').map((prop) => (
          <SceneBackArt key={prop} prop={prop} />
        ))}
      </g>
      <Joint part="shadow" at={{ x: lying ? 100 : 100, y: GROUND_Y }}>
        <ellipse
          cx="100"
          cy={GROUND_Y}
          rx={lying ? 100 : 56}
          ry="6"
          fill={m.shadow}
          className={styles.shadow}
        />
      </Joint>
      <g transform={`translate(${shift.x ?? 0} ${shift.y ?? 0})`}>
        <Joint part="whole" at={{ x: 100, y: GROUND_Y }}>
          <g transform={mirrored ? `matrix(-1 0 0 1 ${CANVAS.width} 0)` : undefined}>
            {lying ? (
              <LyingFigure pose={pose} clipId={clipId} />
            ) : (
              <StandingFigure rig={rig} base={base} pose={pose} clipId={clipId} />
            )}
          </g>
        </Joint>
      </g>
      <g data-layer="scene-front">
        {inLayer('front').map((prop) => (
          <SceneFrontArt key={prop} prop={prop} />
        ))}
      </g>
      <g data-layer="fx">
        {inLayer('fx').map((prop) => (
          <SceneFxArt key={prop} prop={prop} />
        ))}
      </g>
    </svg>
  );
}
