import { describe, expect, it } from 'vitest';
import { SHOP_CATALOGUE, makeFreshShopState, shopProductState } from './shop';

describe('shop catalogue and cosmetic ownership', () => {
  it('lists eight original cosmetics with unique IDs and positive fixed prices', () => {
    expect(SHOP_CATALOGUE).toHaveLength(8);
    expect(new Set(SHOP_CATALOGUE.map((item) => item.id)).size).toBe(8);
    expect(SHOP_CATALOGUE.every((item) => item.price > 0)).toBe(true);
    expect(new Set(SHOP_CATALOGUE.map((item) => item.category))).toEqual(
      new Set(['theme', 'frame']),
    );
  });

  it('distinguishes affordable, locked, owned and equipped items', () => {
    const state = makeFreshShopState();
    const ocean = SHOP_CATALOGUE[0];
    if (!ocean) throw new Error('Missing test item');
    expect(shopProductState(state, ocean)).toBe('available');
    state.balance = 0;
    expect(shopProductState(state, ocean)).toBe('locked');
    state.owned = [ocean.id];
    expect(shopProductState(state, ocean)).toBe('owned');
    state.equippedTheme = ocean.id;
    expect(shopProductState(state, ocean)).toBe('equipped');
  });
});
