import type { ShopProduct } from '@/domain/shop';
import { ACCESSORY_ART } from './accessoryArt';
import { AVATAR_ART } from './avatarArt';
import { BACKGROUND_ART } from './backgroundArt';
import { EFFECT_ART } from './effectArt';
import { FRAME_ART } from './frameArt';

/** The colours each dashboard theme sets, from `tokens.css`, for its shop swatch. */
export const THEME_SWATCHES: Record<string, readonly [string, string, string]> = {
  'theme-ocean': ['#235d8f', '#729fd1', '#e3f2fa'],
  'theme-lavender': ['#62449b', '#a08acb', '#eee7fa'],
  'theme-mint': ['#21685f', '#79b6ab', '#e2f5ef'],
  'theme-sunset': ['#955038', '#da977c', '#fbefe7'],
};

/** True when the website ships artwork for the item, so it can be shown and worn. */
export function hasArtwork(item: Pick<ShopProduct, 'id' | 'category'>): boolean {
  switch (item.category) {
    case 'avatar':
      return item.id in AVATAR_ART;
    case 'accessory':
      return item.id in ACCESSORY_ART;
    case 'background':
      return item.id in BACKGROUND_ART;
    case 'frame':
      return item.id in FRAME_ART;
    case 'effect':
      return item.id in EFFECT_ART;
    case 'theme':
      return item.id in THEME_SWATCHES;
    case 'title':
      return true;
  }
}
