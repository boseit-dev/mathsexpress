import type { ShopRepository } from '@/data/repositories';
import type { CosmeticCategory, ShopProduct, ShopState, ShopTransaction } from '@/domain/shop';
import type { MathsExpressClient } from './client';
import { unwrap } from './errors';

function object(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Shop data was not in the expected format');
  }
  return value as Record<string, unknown>;
}

/** Decode the RPC payload at the network boundary. Never trust JSON to match our types. */
export function decodeShopState(value: unknown): ShopState {
  const raw = object(value);
  if (!Number.isSafeInteger(raw.balance) || (raw.balance as number) < 0) {
    throw new Error('Invalid shop coin balance');
  }
  if (!Array.isArray(raw.items) || !Array.isArray(raw.owned) || !Array.isArray(raw.transactions)) {
    throw new Error('Incomplete shop inventory');
  }
  const items: ShopProduct[] = raw.items.map((entry: unknown) => {
    const item = object(entry);
    if (
      typeof item.id !== 'string' || typeof item.name !== 'string' ||
      typeof item.description !== 'string' ||
      (item.category !== 'theme' && item.category !== 'frame') ||
      !Number.isSafeInteger(item.price) || (item.price as number) < 0
    ) throw new Error('Invalid shop item');
    return {
      id: item.id, name: item.name, description: item.description,
      category: item.category as CosmeticCategory, price: item.price as number,
    };
  });
  const transactions: ShopTransaction[] = raw.transactions.map((entry: unknown) => {
    const row = object(entry);
    if (
      !Number.isSafeInteger(row.id) || !Number.isSafeInteger(row.delta) ||
      typeof row.createdAt !== 'string' ||
      (row.reason !== 'welcome' && row.reason !== 'purchase' && row.reason !== 'correct_answer') ||
      !(row.itemId === null || typeof row.itemId === 'string')
    ) throw new Error('Invalid shop transaction');
    return {
      id: row.id as number, itemId: row.itemId as string | null,
      delta: row.delta as number, reason: row.reason, createdAt: row.createdAt,
    };
  });
  if (
    !raw.owned.every((id: unknown) => typeof id === 'string') ||
    !(raw.equippedTheme === null || typeof raw.equippedTheme === 'string') ||
    !(raw.equippedFrame === null || typeof raw.equippedFrame === 'string')
  ) throw new Error('Invalid shop equipment');
  return {
    balance: raw.balance as number,
    items, owned: raw.owned as string[], transactions,
    equippedTheme: raw.equippedTheme as string | null,
    equippedFrame: raw.equippedFrame as string | null,
  };
}

export function createSupabaseShopRepository(client: MathsExpressClient): ShopRepository {
  return {
    async getState() {
      return decodeShopState(unwrap(await client.rpc('shop_state')));
    },
    async buy(itemId) {
      return decodeShopState(unwrap(await client.rpc('shop_buy', { item_id: itemId })));
    },
    async equip(category, itemId) {
      return decodeShopState(
        unwrap(await client.rpc('shop_equip', { category, item_id: itemId })),
      );
    },
    async awardAnswer(questionId, answer) {
      return decodeShopState(
        unwrap(await client.rpc('shop_award_answer', { question_id: questionId, answer })),
      );
    },
  };
}
