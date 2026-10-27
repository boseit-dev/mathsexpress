export interface BadgeProgress {
  name: string;
  description: string;
  progress: number;
  target: number;
}

export interface RewardSummary {
  coinsEarnedThisWeek: number;
  badgesEarned: number;
  /** The badge the student is closest to earning, if any. */
  nextBadge: BadgeProgress | null;
}

export interface DailyChallenge {
  id: string;
  title: string;
  progress: number;
  target: number;
  rewardCoins: number;
}

export function isChallengeComplete(challenge: DailyChallenge): boolean {
  return challenge.progress >= challenge.target;
}

export type ShopItemCategory = 'theme' | 'avatar' | 'power-up';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopItemCategory;
  price: number;
}

/** Coins still needed to buy an item; 0 when the student can already afford it. */
export function getCoinsNeeded(price: number, coinBalance: number): number {
  return Math.max(0, price - coinBalance);
}
