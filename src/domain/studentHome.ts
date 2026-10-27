import type { Assignment } from './assignment';
import type { LeaderboardEntry } from './leaderboard';
import type { LearningProgress } from './progress';
import type { PracticeRecommendation } from './recommendation';
import type { DailyChallenge, RewardSummary, ShopItem } from './rewards';

/** Everything the student home page shows, as one response from the data source. */
export interface StudentHome {
  assignments: Assignment[];
  /** Null until the student has answered enough questions to base a suggestion on. */
  recommendation: PracticeRecommendation | null;
  progress: LearningProgress;
  rewards: RewardSummary;
  /** Coins earned this week by everyone in the student's class. */
  leaderboard: LeaderboardEntry[];
  challenges: DailyChallenge[];
  featuredShopItems: ShopItem[];
}
