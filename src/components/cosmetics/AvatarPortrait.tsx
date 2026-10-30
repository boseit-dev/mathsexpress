import { useId } from 'react';
import type { Look } from '@/domain/shop';
import { cx } from '@/lib/cx';
import { ACCESSORY_ART, SLOT_PLACEMENT } from './accessoryArt';
import type { IdMaker } from './artKit';
import { AVATAR_ART } from './avatarArt';
import { BACKGROUND_ART, BACKGROUND_VIEWBOX } from './backgroundArt';
import { EFFECT_ART } from './effectArt';
import { FRAME_ART } from './frameArt';
import styles from './Cosmetics.module.css';

/** What shows behind the character inside the circle. */
export type PortraitBackdrop = 'background' | 'glass' | 'tint';

interface AvatarPortraitProps {
  /** The items to draw. Missing parts are left out, so pass `resolveLook(...)` for a full look. */
  look: Look;
  /** Read by screen readers. Leave out when the name is already next to the portrait. */
  label?: string;
  backdrop?: PortraitBackdrop;
  /** Effects are for large previews; small avatars leave them out. */
  showEffect?: boolean;
  /** Pause any motion, for crowded grids. */
  still?: boolean;
  className?: string;
}

/**
 * A student's round portrait, layered back to front: effect glow, background, character,
 * frame, accessory, effect particles. Used everywhere a student's look appears.
 */
export function AvatarPortrait({
  look,
  label,
  backdrop = 'background',
  showEffect = false,
  still = false,
  className,
}: AvatarPortraitProps) {
  const prefix = `p${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const ids =
    (layer: string): IdMaker =>
    (name) =>
      `${prefix}-${layer}-${name}`;

  const background = look.background ? BACKGROUND_ART[look.background] : undefined;
  const avatar = look.avatar ? AVATAR_ART[look.avatar] : undefined;
  const frame = look.frame ? FRAME_ART[look.frame] : undefined;
  const accessory = look.accessory ? ACCESSORY_ART[look.accessory] : undefined;
  const effect = showEffect && look.effect ? EFFECT_ART[look.effect] : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      className={cx(styles.portrait, still && styles.still, className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-look={JSON.stringify(look)}
    >
      <defs>
        <clipPath id={`${prefix}-circle`}>
          <circle cx={50} cy={50} r={42} />
        </clipPath>
      </defs>
      {effect?.layer === 'behind' && effect.draw(ids('effect'))}
      <g clipPath={`url(#${prefix}-circle)`}>
        {backdrop === 'background' && background ? (
          <svg
            width={100}
            height={100}
            viewBox={BACKGROUND_VIEWBOX}
            preserveAspectRatio="xMidYMid slice"
          >
            {background(ids('background'))}
          </svg>
        ) : (
          <circle
            cx={50}
            cy={50}
            r={42}
            fill={backdrop === 'glass' ? 'rgba(255, 255, 255, 0.38)' : '#EDE8F5'}
          />
        )}
        {avatar?.(ids('avatar'))}
      </g>
      {frame?.(ids('frame'))}
      {accessory && (
        <g transform={SLOT_PLACEMENT[accessory.slot]}>{accessory.draw(ids('accessory'))}</g>
      )}
      {effect?.layer === 'front' && effect.draw(ids('effect'))}
    </svg>
  );
}
