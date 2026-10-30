import {
  SHOP_CATALOGUE,
  type CosmeticCategory,
  type Rarity,
  type ShopProduct,
} from './shopCatalogue';

export type { CosmeticCategory, Rarity, ShopProduct };

/**
 * Server-backed MathsExpress cosmetic shop. Coins are earned only through maths practice and
 * spent only on cosmetics: no real-money payments, random rewards or gameplay advantages.
 */
export const COSMETIC_CATEGORIES: readonly CosmeticCategory[] = [
  'avatar',
  'accessory',
  'background',
  'frame',
  'effect',
  'title',
  'theme',
];

export const CATEGORY_LABELS: Record<CosmeticCategory, { one: string; many: string }> = {
  avatar: { one: 'Avatar', many: 'Avatars' },
  accessory: { one: 'Accessory', many: 'Accessories' },
  background: { one: 'Background', many: 'Backgrounds' },
  frame: { one: 'Profile frame', many: 'Frames' },
  effect: { one: 'Effect', many: 'Effects' },
  title: { one: 'Profile title', many: 'Titles' },
  theme: { one: 'Dashboard theme', many: 'Themes' },
};

export const RARITIES: readonly Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

/** The price each rarity sits in. The database enforces the same bands. */
export const RARITY_PRICES: Record<Rarity, { min: number; max: number }> = {
  common: { min: 0, max: 75 },
  uncommon: { min: 100, max: 250 },
  rare: { min: 300, max: 600 },
  epic: { min: 750, max: 2500 },
  legendary: { min: 3000, max: 5000 },
};

export interface PriceBand {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_BANDS: readonly PriceBand[] = [
  { id: 'free', label: 'Free', min: 0, max: 0 },
  { id: 'very-cheap', label: '25–75 coins', min: 1, max: 75 },
  { id: 'cheap', label: '100–250 coins', min: 76, max: 250 },
  { id: 'medium', label: '300–600 coins', min: 251, max: 600 },
  { id: 'expensive', label: '750–1,200 coins', min: 601, max: 1200 },
  { id: 'very-expensive', label: '1,500–2,500 coins', min: 1201, max: 2500 },
  { id: 'legendary', label: '3,000 coins and up', min: 2501, max: Number.MAX_SAFE_INTEGER },
];

export type TransactionReason = 'welcome' | 'purchase' | 'correct_answer' | 'lesson_complete';

export interface ShopTransaction {
  id: number;
  itemId: string | null;
  delta: number;
  reason: TransactionReason;
  createdAt: string;
}

/** The item a student wears in each category. A missing category uses the default look. */
export type Look = Partial<Record<CosmeticCategory, string>>;

export interface ShopState {
  balance: number;
  equipped: Look;
  items: ShopProduct[];
  /** Everything the student may equip: items bought plus the free starter items. */
  owned: string[];
  transactions: ShopTransaction[];
}

/** How a student earns coins. The numbers here are shown to students; SQL applies them. */
export const COIN_RULES = {
  welcome: 100,
  firstCorrectAnswer: 20,
  lessonComplete: 25,
  lessonFirstTryBonus: 5,
  rewardedLessonsPerDay: 4,
} as const;

/** What a student looks like when nothing is equipped: the MathsExpress default. */
export const DEFAULT_LOOK = {
  avatar: 'av-capybara',
  background: 'bg-lavender-hills',
  frame: 'frame-classic',
} as const satisfies Look;

export { SHOP_CATALOGUE };

export type ProductStatus = 'equipped' | 'owned' | 'available' | 'locked';

/** "Equipped" includes a free default item worn because nothing else is equipped. */
export function shopProductState(state: ShopState, item: ShopProduct): ProductStatus {
  if (resolveLook(state.equipped)[item.category] === item.id) return 'equipped';
  if (state.owned.includes(item.id)) return 'owned';
  return state.balance >= item.price ? 'available' : 'locked';
}

/** The parts of a look that appear on an avatar. Themes and effects stay with the student. */
export const AVATAR_PARTS: readonly CosmeticCategory[] = [
  'avatar',
  'accessory',
  'background',
  'frame',
  'title',
];

export function avatarParts(look: Look): Look {
  return Object.fromEntries(
    Object.entries(look).filter(([category]) =>
      AVATAR_PARTS.includes(category as CosmeticCategory),
    ),
  );
}

/** True when the item is worn only because it is the default; it can't be taken off. */
export function isWornByDefault(state: ShopState, item: ShopProduct): boolean {
  return state.equipped[item.category] === undefined && resolveLook({})[item.category] === item.id;
}

/** The look to draw: the equipped items, then items being tried on, over the defaults. */
export function resolveLook(equipped: Look, trying: Look = {}): Look {
  return { ...DEFAULT_LOOK, ...equipped, ...trying };
}

export function priceBandOf(price: number): PriceBand | undefined {
  return PRICE_BANDS.find((band) => price >= band.min && price <= band.max);
}

export type ShopSort = 'featured' | 'cheapest' | 'expensive' | 'name';

export interface ShopFilters {
  category: CosmeticCategory | 'all';
  search: string;
  rarity: Rarity | 'all';
  price: string;
  sort: ShopSort;
  ownedOnly: boolean;
  affordableOnly: boolean;
}

export const DEFAULT_FILTERS: ShopFilters = {
  category: 'all',
  search: '',
  rarity: 'all',
  price: 'all',
  sort: 'featured',
  ownedOnly: false,
  affordableOnly: false,
};

function normalise(text: string): string {
  return text.toLocaleLowerCase('en-AU').replace(/\s+/g, ' ').trim();
}

/** Items matching every filter, in the chosen order. "Featured" keeps the catalogue order. */
export function filterShopItems(state: ShopState, filters: ShopFilters): ShopProduct[] {
  const search = normalise(filters.search);
  const band = PRICE_BANDS.find((entry) => entry.id === filters.price);
  const matches = state.items.filter((item) => {
    const owned = state.owned.includes(item.id);
    const text = `${item.name} ${item.description} ${CATEGORY_LABELS[item.category].one}`;
    return (
      (filters.category === 'all' || item.category === filters.category) &&
      (filters.rarity === 'all' || item.rarity === filters.rarity) &&
      (!band || (item.price >= band.min && item.price <= band.max)) &&
      (!filters.ownedOnly || owned) &&
      (!filters.affordableOnly || (!owned && item.price <= state.balance)) &&
      (search === '' || normalise(text).includes(search))
    );
  });
  const byName = (a: ShopProduct, b: ShopProduct) => a.name.localeCompare(b.name, 'en-AU');
  switch (filters.sort) {
    case 'cheapest':
      return matches.sort((a, b) => a.price - b.price || byName(a, b));
    case 'expensive':
      return matches.sort((a, b) => b.price - a.price || byName(a, b));
    case 'name':
      return matches.sort(byName);
    case 'featured':
      return matches;
  }
}

export function makeFreshShopState(): ShopState {
  return {
    balance: COIN_RULES.welcome,
    equipped: {},
    items: [...SHOP_CATALOGUE],
    owned: SHOP_CATALOGUE.filter((item) => item.price === 0).map((item) => item.id),
    transactions: [
      {
        id: 1,
        itemId: null,
        delta: COIN_RULES.welcome,
        reason: 'welcome',
        createdAt: '2026-10-29T00:00:00Z',
      },
    ],
  };
}

/** The look in words, for screen readers: "Fox avatar, Royal Crown, Deep Ocean background…". */
export function describeLook(look: Look, items: readonly ShopProduct[]): string {
  const parts = COSMETIC_CATEGORIES.filter((category) => category !== 'theme').flatMap(
    (category) => {
      const item = items.find((entry) => entry.id === look[category]);
      if (!item) return [];
      switch (category) {
        case 'avatar':
          return [`${item.name} avatar`];
        case 'background':
          return [`${item.name} background`];
        case 'title':
          return [`title “${item.name}”`];
        default:
          return [item.name];
      }
    },
  );
  return parts.join(', ');
}
