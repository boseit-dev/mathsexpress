import { useId, type ReactNode } from 'react';
import { AvatarPortrait } from '@/components/cosmetics/AvatarPortrait';
import { BACKGROUND_ART, BACKGROUND_VIEWBOX } from '@/components/cosmetics/backgroundArt';
import { TitleBadge } from '@/components/cosmetics/TitleBadge';
import { describeLook, type Look, type ShopProduct } from '@/domain/shop';
import { cx } from '@/lib/cx';
import styles from './LookStage.module.css';

interface LookStageProps {
  /** A full look, from `resolveLook`. */
  look: Look;
  items: readonly ShopProduct[];
  name: string;
  /** Says what the preview shows, e.g. "Your look" or "Trying on". */
  caption: string;
  size?: 'large' | 'compact';
  children?: ReactNode;
}

/** A large live preview of a look: the background fills the stage, the portrait sits in front. */
export function LookStage({
  look,
  items,
  name,
  caption,
  size = 'large',
  children,
}: LookStageProps) {
  const prefix = `s${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const background = look.background ? BACKGROUND_ART[look.background] : undefined;
  const title = items.find((item) => item.id === look.title);
  const description = describeLook(look, items);

  return (
    <figure className={cx(styles.stage, styles[size])}>
      <div className={styles.scene}>
        {background && (
          <svg
            className={styles.backdrop}
            viewBox={BACKGROUND_VIEWBOX}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
          >
            {background((part) => `${prefix}-${part}`)}
          </svg>
        )}
        <div key={look.avatar} className={styles.portrait}>
          <AvatarPortrait
            look={look}
            backdrop="glass"
            showEffect
            label={`${caption}: ${description}`}
          />
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.label}>{caption}</span>
        <strong className={styles.name}>{name}</strong>
        {title && <TitleBadge name={title.name} rarity={title.rarity} />}
      </figcaption>
      {children}
    </figure>
  );
}
