import { useEffect, useRef, type CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import {
  animationPose,
  mascotAnimations,
  type AnimationDef,
  type AnimationName,
} from './animations';
import { canBlink, type ExpressionName } from './expressions';
import { MascotFigure } from './MascotFigure';
import { poses, type MascotView, type PoseName } from './poses';
import styles from './Mascot.module.css';

const SIZES = { small: 72, medium: 132, large: 200, hero: 260 } as const;

export type MascotSize = keyof typeof SIZES | number;

export interface MascotProps {
  /** A still pose. Ignored when `animation` is set, unless both are given on purpose. */
  pose?: PoseName;
  /** A named animation; it starts from its own pose. */
  animation?: AnimationName;
  /** Shows a different face than the pose normally has. */
  expression?: ExpressionName;
  /** Faces a different direction than the pose normally does. */
  view?: MascotView;
  /** Height: a named size or pixels. The width follows the artwork. */
  size?: MascotSize;
  /**
   * What the mascot is doing, for screen readers. Leave it out when the mascot is decoration
   * next to text that already says the same thing (the usual case): it is then hidden.
   */
  label?: string;
  /**
   * How many times to play the animation before holding still on its last frame. Leave it out
   * to loop. Pages use a small number so the mascot settles instead of moving all the time.
   */
  cycles?: number;
  /** Change this to restart the animation from the beginning. */
  replayKey?: number | string;
  /** `reduce` shows the still key pose. The visitor's reduced-motion setting always wins. */
  motion?: 'auto' | 'reduce';
  className?: string;
}

/**
 * The MathsExpress capybara. `<Mascot pose="thinking" size="medium" />` draws a still pose;
 * `<Mascot animation="wave" />` animates. Pair it with `useMascotController` to react to events.
 */
export function Mascot({
  pose,
  animation,
  expression,
  view,
  size = 'medium',
  label,
  cycles,
  replayKey,
  motion = 'auto',
  className,
}: MascotProps) {
  const def: AnimationDef | undefined = animation ? mascotAnimations[animation] : undefined;
  const chosen = pose ? poses[pose] : animation ? animationPose(animation) : poses.standing;
  const drawn = expression ? { ...chosen, expression } : chosen;
  const facing = view ?? drawn.view;
  const height = typeof size === 'number' ? size : SIZES[size];
  const ambient = def ? def.ambient === true : true;
  const svg = useRef<SVGSVGElement>(null);

  // A new animation name restarts the keyframes by itself; replaying the same one needs a nudge.
  // Restarting in place (rather than redrawing) keeps the smooth easing between poses.
  useEffect(() => {
    const element = svg.current;
    // jsdom (the test environment) has no Web Animations API.
    if (replayKey === undefined || !element || !('getAnimations' in element)) return;
    for (const running of element.getAnimations({ subtree: true })) {
      // Only keyframe animations restart; the fade-in on first appearance must not replay.
      const name = 'animationName' in running ? (running as CSSAnimation).animationName : '';
      if (name && !name.includes('enter')) running.currentTime = 0;
    }
  }, [replayKey]);

  return (
    <MascotFigure
      // Changing direction or body swaps the drawing, so fade the new one in.
      key={`${facing}-${drawn.body}`}
      ref={svg}
      pose={drawn}
      view={facing}
      title={label}
      className={cx(styles.root, className)}
      style={
        {
          '--mascot-height': `${height}px`,
          '--cycle': `${def?.cycleMs ?? 3600}ms`,
          '--iterations': cycles === undefined ? 'infinite' : String(cycles),
        } as CSSProperties
      }
      dataAttributes={{
        'data-animation': animation,
        'data-ambient': ambient ? 'on' : undefined,
        'data-blink': ambient && canBlink(drawn.expression) ? 'on' : undefined,
        'data-motion': motion === 'reduce' ? 'reduce' : undefined,
      }}
    />
  );
}
