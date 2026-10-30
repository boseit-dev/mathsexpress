import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SHOP_CATALOGUE } from '@/domain/shop';
import { ACCESSORY_ART } from './accessoryArt';
import { hasArtwork } from './artwork';
import { AvatarPortrait } from './AvatarPortrait';
import { AVATAR_ART } from './avatarArt';
import { ItemArt } from './ItemArt';

describe('shop artwork', () => {
  it('exists for every catalogue item', () => {
    const missing = SHOP_CATALOGUE.filter((item) => !hasArtwork(item)).map((item) => item.id);
    expect(missing).toEqual([]);
  });

  it('draws every item as a card picture', () => {
    for (const item of SHOP_CATALOGUE) {
      const markup = renderToStaticMarkup(<ItemArt item={item} />);
      expect(markup, item.id).toMatch(/<svg|<span/);
      expect(markup, item.id).toContain('aria-hidden="true"');
    }
  });

  it('fits every accessory on every avatar, with unique ids per copy', () => {
    for (const avatar of Object.keys(AVATAR_ART)) {
      for (const accessory of Object.keys(ACCESSORY_ART)) {
        const markup = renderToStaticMarkup(
          <>
            <AvatarPortrait look={{ avatar, accessory, frame: 'frame-golden' }} />
            <AvatarPortrait look={{ avatar, accessory, frame: 'frame-golden' }} />
          </>,
        );
        const ids = [...markup.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
        expect(new Set(ids).size, `${avatar} + ${accessory}`).toBe(ids.length);
      }
    }
  });
});
