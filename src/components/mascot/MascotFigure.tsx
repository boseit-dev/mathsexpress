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
  children,
}: {
  part: string;
  at: Point;
  turn?: number;
  extra?: string;
  /** Children are drawn around (0, 0) instead of in drawing coordinates. */
  local?: boolean;
  children: ReactNode;
}) {
  const pose = `${extra} rotate(${turn}deg)`.trim();
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <g className={styles.pose} style={{ transform: pose }}>
        <g className={styles.motion} data-p={part}>
          {local ? children : <g transform={`translate(${-at.x} ${-at.y})`}>{children}</g>}
        </g>
      </g>
    </g>
  );
}

function Eye({ shape, x, y, look }: { shape: EyeShape; x: number; y: number; look: Point }) {
  const line = {
    fill: 'none',
    stroke: m.eye,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  let art: ReactNode;
  switch (shape) {
    case 'open':
      art = <ellipse rx="4.8" ry="6.6" fill={m.eye} />;
      break;
    case 'wide':
      art = (
        <>
          <ellipse rx="5.6" ry="7.4" fill={m.eye} />
          <circle cx="1.7" cy="-2.8" r="1.7" fill={m.highlight} />
        </>
      );
      break;
    case 'narrow':
      art = <ellipse rx="4.9" ry="4.3" fill={m.eye} />;
      break;
    case 'happy':
      art = <path d="M-5.2 2.4Q0 -5.2 5.2 2.4" {...line} strokeWidth="2.9" />;
      break;
    case 'content':
      art = <path d="M-5.2 -1.6Q0 4.6 5.2 -1.6" {...line} strokeWidth="2.9" />;
      break;
    case 'closed':
      art = <path d="M-5 0.4Q0 3.6 5 0.4" {...line} strokeWidth="2.5" />;
      break;
    case 'half':
      art = (
        <>
          <path d="M-4.8 -0.4A4.8 5.2 0 0 0 4.8 -0.4Z" fill={m.eye} />
          <path d="M-5.8 -0.8H5.8" {...line} strokeWidth="2.2" />
        </>
      );
      break;
  }
  return <g transform={`translate(${x + look.x} ${y + look.y})`}>{art}</g>;
}

function Brow({ spec, x, y, mirror }: { spec: BrowSpec; x: number; y: number; mirror: boolean }) {
  const angle = mirror ? -spec.angle : spec.angle;
  return (
    <path
      d="M-5.6 1Q0 -2 5.6 1"
      transform={`translate(${x} ${y - 12 - spec.lift}) rotate(${angle})`}
      fill="none"
      stroke={m.brow}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  );
}

function Face({ rig, expression }: { rig: ViewRig; expression: ExpressionName }) {
  const def = expressions[expression];
  const look = 'look' in def ? def.look : { x: 0, y: 0 };
  if (rig.eyes.length === 0) return null;
  const eyeLine = rig.eyes.reduce((sum, eye) => sum + eye.y, 0) / rig.eyes.length;
  const eyeCentre = rig.eyes.reduce((sum, eye) => sum + eye.x, 0) / rig.eyes.length;
  return (
    <>
      <Joint part="eyes" at={{ x: eyeCentre, y: eyeLine }}>
        {rig.eyes.map((eye) => (
          <Eye key={eye.x} shape={def.eyes} x={eye.x} y={eye.y} look={look} />
        ))}
      </Joint>
      <g data-p="brows">
        {def.brow &&
          rig.eyes.map((eye, i) => {
            const spec = i === 1 && 'otherBrow' in def ? def.otherBrow : (def.brow as BrowSpec);
            return <Brow key={eye.x} spec={spec} x={eye.x} y={eye.y} mirror={i === 1} />;
          })}
      </g>
    </>
  );
}

/**
 * A stubby arm: drawn hanging down from the shoulder at (0, 0), paw centred at (0, 29).
 * The shoulder itself moves a little with the arm, up and out when it is raised and inwards
 * when it reaches across the body, so raised paws clear the big head and both paws can meet.
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
  const turn = side === 'left' ? pose.raise : -pose.raise;
  const outward = side === 'left' ? -1 : 1;
  const up = shrug ? Math.min(Math.max(pose.raise / 140, 0), 1) : 0;
  const across = shrug ? Math.min(Math.max(-pose.raise / 80, 0), 1) : 0;
  const dx = outward * (6 * up - 11 * across);
  const dy = -9 * up - 2 * across;
  const held = pose.holds;
  return (
    <Joint
      part={`arm-${side}`}
      at={joint}
      turn={turn}
      extra={dx || dy ? `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` : ''}
      local
    >
      {held && held !== 'thumb' && <HeldPropArt prop={held} armTurn={turn} />}
      <rect x="-8.5" y="-8" width="17" height="45" rx="8.5" fill={far ? m.bodyFar : m.bodyDark} />
      {held === 'thumb' && <HeldPropArt prop={held} armTurn={turn} />}
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
        </g>
        {rig.tail?.layer === 'front' && <ellipse {...ellipseProps(rig.tail)} fill={m.bodyDark} />}
        <Joint part="head" at={rig.neck} turn={pose.head ?? 0}>
          {rig.ears.map((ear) => (
            <g key={ear.cx}>
              <circle cx={ear.cx} cy={ear.cy} r={ear.r} fill={m.bodyDark} />
              <circle
                cx={ear.cx + (ear.cx < 100 ? 2 : -2)}
                cy={ear.cy + 1}
                r={ear.r * 0.48}
                fill={m.earInner}
              />
            </g>
          ))}
          {rig.snout?.layer === 'back' && <path d={rig.snout.path} fill={m.snout} />}
          <path d={rig.head} fill={m.body} />
          <path d={rig.tuft} fill={m.bodyDark} />
          {rig.snout?.layer === 'front' && (
            <path
              d={rig.snout.path}
              fill={m.snout}
              clipPath={rig.snout.clip ? `url(#${clipId}-head)` : undefined}
            />
          )}
          {rig.nostrils.map((nostril) => (
            <ellipse key={nostril.cx} {...ellipseProps(nostril)} fill={m.nostril} />
          ))}
          <Face rig={rig} expression={pose.expression} />
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
        <ellipse
          {...ellipseProps(r.shade)}
          fill={m.bodyDark}
          opacity="0.22"
          clipPath={`url(#${clipId})`}
        />
        <Joint part="head" at={r.neck} turn={pose.head ?? 0}>
          <circle cx={r.ear.cx} cy={r.ear.cy} r={r.ear.r} fill={m.bodyDark} />
          <circle cx={r.ear.cx + 1.5} cy={r.ear.cy + 1} r={r.ear.r * 0.48} fill={m.earInner} />
          <path d={r.head} fill={m.body} />
          <path d={r.tuft} fill={m.bodyDark} />
          <path d={r.snout} fill={m.snout} clipPath={`url(#${clipId}-head)`} />
          <ellipse {...ellipseProps(r.nostril)} fill={m.nostril} />
          <Face
            rig={{ ...viewRigs.right, eyes: [r.eye], nostrils: [] }}
            expression={pose.expression}
          />
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
