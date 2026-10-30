import { useOutletContext } from 'react-router';
import type { CosmeticCategory, Look, ShopProduct, ShopState } from '@/domain/shop';
import type { CurrentStudent } from '@/domain/student';

export type ShopResult = string | null | undefined;

/** The shop's shared state, provided by ShopLayout to the shop, collection and history pages. */
export interface ShopContextValue {
  student: CurrentStudent;
  state: ShopState;
  /** The item (or "reset") being saved right now; every other change waits for it. */
  pending: string | null;
  /** Items being tried on, by category. Trying never costs coins and saves nothing. */
  trying: Look;
  tryOn: (item: ShopProduct) => void;
  /** Stops trying one category, or everything. */
  stopTrying: (category?: CosmeticCategory) => void;
  /**
   * Each returns null when it worked, an error message when it didn't, or undefined when it was
   * ignored because another change was still being saved (a double click).
   */
  buy: (item: ShopProduct) => Promise<ShopResult>;
  equip: (category: CosmeticCategory, itemId: string | null) => Promise<ShopResult>;
  resetLook: () => Promise<ShopResult>;
}

export function useShop(): ShopContextValue {
  return useOutletContext<ShopContextValue>();
}
