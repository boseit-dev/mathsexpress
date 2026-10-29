/** Server-backed MathsExpress cosmetic shop. No real-money payments or random rewards. */
export type CosmeticCategory = 'theme' | 'frame';

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  category: CosmeticCategory;
  price: number;
}

export interface ShopTransaction {
  id: number;
  itemId: string | null;
  delta: number;
  reason: 'welcome' | 'purchase' | 'correct_answer';
  createdAt: string;
}

export interface ShopState {
  balance: number;
  equippedTheme: string | null;
  equippedFrame: string | null;
  items: ShopProduct[];
  owned: string[];
  transactions: ShopTransaction[];
}

/** Also used by the in-memory test store. Real prices always come from SQL. */
export const SHOP_CATALOGUE: readonly ShopProduct[] = [
  { id: 'theme-ocean', name: 'Ocean Blue', description: 'A fresh ocean-blue dashboard accent.', category: 'theme', price: 40 },
  { id: 'theme-lavender', name: 'Lavender Sky', description: 'A soft purple and lavender accent.', category: 'theme', price: 60 },
  { id: 'theme-mint', name: 'Mint Breeze', description: 'A calm mint-coloured accent.', category: 'theme', price: 80 },
  { id: 'theme-sunset', name: 'Sunset Glow', description: 'Warm sunset colours on your dashboard.', category: 'theme', price: 100 },
  { id: 'frame-starlight', name: 'Starlight Frame', description: 'A sparkling outline for your account avatar.', category: 'frame', price: 35 },
  { id: 'frame-sky', name: 'Sky Frame', description: 'A bright blue ring around your avatar.', category: 'frame', price: 50 },
  { id: 'frame-royal', name: 'Royal Frame', description: 'A bold lavender outline.', category: 'frame', price: 75 },
  { id: 'frame-sunrise', name: 'Sunrise Frame', description: 'A warm golden outline.', category: 'frame', price: 90 },
];

export function shopProductState(state: ShopState, item: ShopProduct): 'equipped' | 'owned' | 'available' | 'locked' {
  const equipped = item.category === 'theme' ? state.equippedTheme : state.equippedFrame;
  if (equipped === item.id) return 'equipped';
  if (state.owned.includes(item.id)) return 'owned';
  return state.balance >= item.price ? 'available' : 'locked';
}

export function makeFreshShopState(): ShopState {
  return {
    balance: 100,
    equippedTheme: null,
    equippedFrame: null,
    items: [...SHOP_CATALOGUE],
    owned: [],
    transactions: [{
      id: 1, itemId: null, delta: 100, reason: 'welcome',
      createdAt: '2026-10-29T00:00:00Z',
    }],
  };
}
