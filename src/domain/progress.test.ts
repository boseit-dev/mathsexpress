import { describe, expect, it } from 'vitest';
import { getAccuracyPercent, type LearningProgress } from './progress';
import { getCoinsNeeded, isChallengeComplete } from './rewards';

const progress: LearningProgress = {
  topicsCompleted: 0,
  topicsInCourse: 10,
  questionsAnswered: 1286,
  questionsCorrect: 1055,
  questionsAnsweredThisWeek: 0,
  streakDays: 0,
  bestStreakDays: 0,
};

describe('getAccuracyPercent', () => {
  it('is the share of correct answers', () => {
    expect(getAccuracyPercent(progress)).toBe(82);
  });

  it('is null before any question has been answered', () => {
    expect(
      getAccuracyPercent({ ...progress, questionsAnswered: 0, questionsCorrect: 0 }),
    ).toBeNull();
  });
});

describe('isChallengeComplete', () => {
  const challenge = { id: 'c', title: 'Answer 20 questions', target: 20, rewardCoins: 20 };
  it('is complete once progress reaches the target', () => {
    expect(isChallengeComplete({ ...challenge, progress: 19 })).toBe(false);
    expect(isChallengeComplete({ ...challenge, progress: 20 })).toBe(true);
  });
});

describe('getCoinsNeeded', () => {
  it('is the shortfall, never negative', () => {
    expect(getCoinsNeeded(400, 340)).toBe(60);
    expect(getCoinsNeeded(250, 340)).toBe(0);
  });
});
