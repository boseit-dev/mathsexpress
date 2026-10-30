import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTERS,
  RARITY_PRICES,
  SHOP_CATALOGUE,
  avatarParts,
  describeLook,
  filterShopItems,
  isWornByDefault,
  makeFreshShopState,
  resolveLook,
  shopProductState,
  type ShopProduct,
} from './shop';

function item(id: string): ShopProduct {
  const found = SHOP_CATALOGUE.find((entry) => entry.id === id);
  if (!found) throw new Error(`Missing catalogue item ${id}`);
  return found;
}

describe('the shop catalogue', () => {
  it('has at least 80 original items with unique ids', () => {
    expect(SHOP_CATALOGUE.length).toBeGreaterThanOrEqual(80);
    expect(new Set(SHOP_CATALOGUE.map((entry) => entry.id)).size).toBe(SHOP_CATALOGUE.length);
    expect(new Set(SHOP_CATALOGUE.map((entry) => entry.name)).size).toBe(SHOP_CATALOGUE.length);
  });

  it('has enough of every kind of item', () => {
    const count = (category: ShopProduct['category']) =>
      SHOP_CATALOGUE.filter((entry) => entry.category === category).length;
    expect(count('accessory')).toBeGreaterThanOrEqual(20);
    expect(count('avatar')).toBeGreaterThanOrEqual(20);
    expect(count('background')).toBeGreaterThanOrEqual(15);
    expect(count('frame')).toBeGreaterThanOrEqual(10);
    expect(count('effect') + count('title')).toBeGreaterThanOrEqual(15);
  });

  it('prices items from free to 5,000 coins, each within its rarity’s band', () => {
    for (const entry of SHOP_CATALOGUE) {
      const band = RARITY_PRICES[entry.rarity];
      expect(entry.price, entry.id).toBeGreaterThanOrEqual(band.min);
      expect(entry.price, entry.id).toBeLessThanOrEqual(band.max);
    }
    const prices = SHOP_CATALOGUE.map((entry) => entry.price);
    expect(Math.min(...prices)).toBe(0);
    expect(Math.max(...prices)).toBe(5000);
  });

  it('has plenty of cheap items, not just expensive ones', () => {
    const affordable = SHOP_CATALOGUE.filter((entry) => entry.price <= 250);
    const legendary = SHOP_CATALOGUE.filter((entry) => entry.rarity === 'legendary');
    expect(affordable.length).toBeGreaterThanOrEqual(35);
    expect(affordable.length).toBeGreaterThan(legendary.length * 3);
    // A new student's 100 welcome coins already buy something in most categories.
    const firstBuys = new Set(
      SHOP_CATALOGUE.filter((entry) => entry.price > 0 && entry.price <= 100).map(
        (entry) => entry.category,
      ),
    );
    expect(firstBuys.size).toBeGreaterThanOrEqual(5);
  });
});

describe('item status', () => {
  it('distinguishes affordable, locked, owned, equipped and default items', () => {
    const state = makeFreshShopState();
    const crown = item('acc-crown');
    const books = item('acc-books');
    expect(shopProductState(state, books)).toBe('available');
    expect(shopProductState(state, crown)).toBe('locked');
    state.owned.push(crown.id);
    expect(shopProductState(state, crown)).toBe('owned');
    state.equipped.accessory = crown.id;
    expect(shopProductState(state, crown)).toBe('equipped');
    expect(isWornByDefault(state, crown)).toBe(false);

    // The capybara is worn by default until another avatar is equipped.
    const capybara = item('av-capybara');
    expect(shopProductState(state, capybara)).toBe('equipped');
    expect(isWornByDefault(state, capybara)).toBe(true);
    state.equipped.avatar = 'av-fox';
    expect(shopProductState(state, capybara)).toBe('owned');
  });

  it('owns the free starter items from the start', () => {
    const state = makeFreshShopState();
    expect(state.owned).toEqual(
      SHOP_CATALOGUE.filter((entry) => entry.price === 0).map((entry) => entry.id),
    );
  });
});

describe('looks', () => {
  it('layers tried-on items over equipped ones, over the defaults', () => {
    expect(resolveLook({})).toEqual({
      avatar: 'av-capybara',
      background: 'bg-lavender-hills',
      frame: 'frame-classic',
    });
    expect(
      resolveLook({ avatar: 'av-fox', frame: 'frame-golden' }, { background: 'bg-moon-surface' }),
    ).toEqual({ avatar: 'av-fox', background: 'bg-moon-surface', frame: 'frame-golden' });
  });

  it('shares only the parts that appear on an avatar', () => {
    expect(avatarParts({ avatar: 'av-owl', theme: 'theme-ocean', effect: 'fx-snowfall' })).toEqual({
      avatar: 'av-owl',
    });
  });

  it('describes a look in words for screen readers', () => {
    expect(
      describeLook(
        { avatar: 'av-capy-astronaut', accessory: 'acc-space-helmet', title: 'title-equation-ace' },
        SHOP_CATALOGUE,
      ),
    ).toBe('Astronaut Capybara avatar, Space Helmet, title “Equation Ace”');
  });
});

describe('browsing', () => {
  const state = { ...makeFreshShopState(), balance: 120 };

  it('searches names, descriptions and kinds', () => {
    const found = filterShopItems(state, { ...DEFAULT_FILTERS, search: '  SPACE ' });
    expect(found.map((entry) => entry.id)).toEqual(
      expect.arrayContaining(['acc-space-helmet', 'frame-cosmic']),
    );
    expect(filterShopItems(state, { ...DEFAULT_FILTERS, search: 'frame' }).length).toBe(16);
  });

  it('filters by category, rarity and price', () => {
    const found = filterShopItems(state, {
      ...DEFAULT_FILTERS,
      category: 'background',
      rarity: 'legendary',
    });
    expect(found.map((entry) => entry.id)).toEqual(['bg-golden-palace', 'bg-maths-universe']);
    const cheap = filterShopItems(state, { ...DEFAULT_FILTERS, price: 'very-cheap' });
    expect(cheap.every((entry) => entry.price >= 25 && entry.price <= 75)).toBe(true);
    const free = filterShopItems(state, { ...DEFAULT_FILTERS, price: 'free' });
    expect(free.every((entry) => entry.price === 0)).toBe(true);
  });

  it('shows only owned, or only affordable and not yet owned, items', () => {
    const owned = filterShopItems(state, { ...DEFAULT_FILTERS, ownedOnly: true });
    expect(owned.every((entry) => entry.price === 0)).toBe(true);
    const affordable = filterShopItems(state, { ...DEFAULT_FILTERS, affordableOnly: true });
    expect(affordable.length).toBeGreaterThan(0);
    expect(affordable.every((entry) => entry.price > 0 && entry.price <= 120)).toBe(true);
  });

  it('sorts by price either way and by name', () => {
    const cheapest = filterShopItems(state, { ...DEFAULT_FILTERS, sort: 'cheapest' });
    const priciest = filterShopItems(state, { ...DEFAULT_FILTERS, sort: 'expensive' });
    const byName = filterShopItems(state, { ...DEFAULT_FILTERS, sort: 'name' });
    expect(cheapest[0]?.price).toBe(0);
    expect(priciest[0]?.price).toBe(5000);
    expect(byName[0]?.name).toBe('Algebra Adventurer');
    expect(cheapest.map((entry) => entry.price)).toEqual(
      [...cheapest.map((entry) => entry.price)].sort((a, b) => a - b),
    );
  });
});
