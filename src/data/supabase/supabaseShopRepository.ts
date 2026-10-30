import type { ShopRepository } from '@/data/repositories';
import { AppError } from '@/domain/errors';
import {
  COSMETIC_CATEGORIES,
  RARITIES,
  type CosmeticCategory,
  type Look,
  type Rarity,
  type ShopProduct,
  type ShopState,
  type ShopTransaction,
  type TransactionReason,
} from '@/domain/shop';
import type { MathsExpressClient } from './client';
import { unwrap } from './errors';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REASONS: readonly TransactionReason[] = [
  'welcome',
  'purchase',
  'correct_answer',
  'lesson_complete',
];

function object(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Shop data was not in the expected format');
  }
  return value as Record<string, unknown>;
}

function isCategory(value: unknown): value is CosmeticCategory {
  return COSMETIC_CATEGORIES.includes(value as CosmeticCategory);
}

/** A look from the server: known categories only, each naming one item id. */
export function decodeLook(value: unknown): Look {
  const look: Look = {};
  for (const [category, itemId] of Object.entries(object(value))) {
    if (!isCategory(category) || typeof itemId !== 'string') throw new Error('Invalid shop look');
    look[category] = itemId;
  }
  return look;
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
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.description !== 'string' ||
      !isCategory(item.category) ||
      !RARITIES.includes(item.rarity as Rarity) ||
      !Number.isSafeInteger(item.price) ||
      (item.price as number) < 0
    )
      throw new Error('Invalid shop item');
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price as number,
      rarity: item.rarity as Rarity,
    };
  });
  const transactions: ShopTransaction[] = raw.transactions.map((entry: unknown) => {
    const row = object(entry);
    if (
      !Number.isSafeInteger(row.id) ||
      !Number.isSafeInteger(row.delta) ||
      typeof row.createdAt !== 'string' ||
      !REASONS.includes(row.reason as TransactionReason) ||
      !(row.itemId === null || typeof row.itemId === 'string')
    )
      throw new Error('Invalid shop transaction');
    return {
      id: row.id as number,
      itemId: row.itemId,
      delta: row.delta as number,
      reason: row.reason as TransactionReason,
      createdAt: row.createdAt,
    };
  });
  if (!raw.owned.every((id: unknown) => typeof id === 'string')) {
    throw new Error('Invalid shop inventory');
  }
  return {
    balance: raw.balance as number,
    equipped: decodeLook(raw.equipped),
    items,
    owned: raw.owned,
    transactions,
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
      const args = itemId === null ? { category } : { category, item_id: itemId };
      return decodeShopState(unwrap(await client.rpc('shop_equip', args)));
    },
    async resetLook() {
      return decodeShopState(unwrap(await client.rpc('shop_reset_look')));
    },
    async awardAnswer(questionId, answer) {
      return decodeShopState(
        unwrap(await client.rpc('shop_award_answer', { question_id: questionId, answer })),
      );
    },
    async classLooks(classId) {
      if (!UUID_PATTERN.test(classId)) throw new AppError('class_not_found');
      const looks = object(unwrap(await client.rpc('class_member_looks', { class_id: classId })));
      return Object.fromEntries(
        Object.entries(looks).map(([studentId, look]) => [studentId, decodeLook(look)]),
      );
    },
  };
}
