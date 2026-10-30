import { useId, type ReactNode } from 'react';
import { resolveLook, type Look, type ShopProduct } from '@/domain/shop';
import { cx } from '@/lib/cx';
import { ACCESSORY_ART, SLOT_VIEWBOX } from './accessoryArt';
import type { IdMaker } from './artKit';
import { THEME_SWATCHES } from './artwork';
import { AvatarPortrait } from './AvatarPortrait';
import { BACKGROUND_ART, BACKGROUND_VIEWBOX } from './backgroundArt';
import { TitleBadge } from './TitleBadge';
import styles from './ItemArt.module.css';

interface ItemArtProps {
  item: ShopProduct;
  /** The student's own look, so frames and effects are shown on their avatar. */
  wearer?: Look;
  /** Pause motion, for crowded grids. */
  still?: boolean;
  className?: string;
}

/** The picture of one shop item on its own, for cards and previews. Decorative. */
export function ItemArt({ item, wearer = {}, still = true, className }: ItemArtProps) {
  const prefix = `i${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const ids: IdMaker = (name) => `${prefix}-${name}`;
  const own = resolveLook(wearer);

  let art: ReactNode = null;
  switch (item.category) {
    case 'avatar':
      art = <AvatarPortrait look={{ avatar: item.id }} backdrop="tint" still={still} />;
      break;
    case 'accessory': {
      const accessory = ACCESSORY_ART[item.id];
      art = accessory && (
        <svg viewBox={SLOT_VIEWBOX[accessory.slot]} className={styles.object} focusable="false">
          {accessory.draw(ids)}
        </svg>
      );
      break;
    }
    case 'background': {
      const background = BACKGROUND_ART[item.id];
      art = background && (
        <svg
          viewBox={BACKGROUND_VIEWBOX}
          preserveAspectRatio="xMidYMid slice"
          className={styles.fill}
          focusable="false"
        >
          {background(ids)}
        </svg>
      );
      break;
    }
    case 'frame':
      art = (
        <AvatarPortrait
          look={{ avatar: own.avatar, frame: item.id }}
          backdrop="tint"
          still={still}
        />
      );
      break;
    case 'effect': {
      // Effects are light particles, so they are shown on a small blue stage.
      const stage = BACKGROUND_ART['bg-classic-blue'];
      art = (
        <div className={styles.scene}>
          {stage && (
            <svg
              viewBox={BACKGROUND_VIEWBOX}
              preserveAspectRatio="xMidYMid slice"
              className={styles.fill}
              focusable="false"
            >
              {stage(ids)}
            </svg>
          )}
          <div className={styles.onStage}>
            <AvatarPortrait
              look={{ avatar: own.avatar, effect: item.id }}
              backdrop="glass"
              showEffect
              still={still}
            />
          </div>
        </div>
      );
      break;
    }
    case 'title':
      art = <TitleBadge name={item.name} rarity={item.rarity} size="large" />;
      break;
    case 'theme': {
      const [strong, middle, wash] = THEME_SWATCHES[item.id] ?? ['#3d52a0', '#7091e6', '#ede8f5'];
      art = (
        <svg viewBox="0 0 120 80" className={styles.object} focusable="false">
          <rect x={4} y={4} width={112} height={72} rx={10} fill={wash} stroke={middle} />
          <rect x={4} y={4} width={112} height={16} rx={10} fill={strong} />
          <rect x={4} y={14} width={112} height={6} fill={strong} />
          <rect x={14} y={30} width={44} height={8} rx={4} fill={strong} />
          <rect x={14} y={44} width={60} height={5} rx={2.5} fill={middle} />
          <rect x={14} y={54} width={48} height={5} rx={2.5} fill={middle} opacity={0.6} />
          <circle cx={94} cy={50} r={14} fill={middle} />
          <circle cx={94} cy={50} r={8} fill={wash} />
        </svg>
      );
      break;
    }
  }

  return (
    <div className={cx(styles.art, className)} data-category={item.category} aria-hidden="true">
      {art}
    </div>
  );
}
