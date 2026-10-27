import { describe, expect, it } from 'vitest';
import { getLeaderboardPreview, rankLeaderboard } from './leaderboard';

const entries = [
  { studentId: 'c', displayName: 'Cara', coinsThisWeek: 90 },
  { studentId: 'a', displayName: 'Ali', coinsThisWeek: 120 },
  { studentId: 'e', displayName: 'Eve', coinsThisWeek: 40 },
  { studentId: 'b', displayName: 'Ben', coinsThisWeek: 90 },
  { studentId: 'd', displayName: 'Dan', coinsThisWeek: 60 },
];

describe('rankLeaderboard', () => {
  it('orders by coins and lets equal scores share a rank', () => {
    const ranked = rankLeaderboard(entries, 'd');
    expect(ranked.map(({ displayName, rank }) => `${rank} ${displayName}`)).toEqual([
      '1 Ali',
      '2 Ben',
      '2 Cara',
      '4 Dan',
      '5 Eve',
    ]);
    expect(
      ranked.filter((entry) => entry.isCurrentStudent).map(({ studentId }) => studentId),
    ).toEqual(['d']);
  });
});

describe('getLeaderboardPreview', () => {
  it('adds the current student’s row when they are outside the top places', () => {
    const preview = getLeaderboardPreview(rankLeaderboard(entries, 'e'), 3);
    expect(preview.top.map(({ studentId }) => studentId)).toEqual(['a', 'b', 'c']);
    expect(preview.currentStudent?.studentId).toBe('e');
  });

  it('does not repeat the current student when they are already shown', () => {
    const preview = getLeaderboardPreview(rankLeaderboard(entries, 'b'), 3);
    expect(preview.currentStudent).toBeNull();
  });
});
