export interface LeaderboardEntry {
  studentId: string;
  displayName: string;
  coinsThisWeek: number;
}

export interface RankedLeaderboardEntry extends LeaderboardEntry {
  rank: number;
  isCurrentStudent: boolean;
}

/**
 * Orders by coins earned this week. Equal totals share a rank and the next rank is skipped
 * (1, 2, 2, 4), so nobody is placed above a classmate with the same score.
 */
export function rankLeaderboard(
  entries: readonly LeaderboardEntry[],
  currentStudentId: string,
): RankedLeaderboardEntry[] {
  const sorted = [...entries].sort(
    (a, b) => b.coinsThisWeek - a.coinsThisWeek || a.displayName.localeCompare(b.displayName),
  );

  const ranked: RankedLeaderboardEntry[] = [];
  sorted.forEach((entry, index) => {
    const previous = ranked[index - 1];
    const rank = previous?.coinsThisWeek === entry.coinsThisWeek ? previous.rank : index + 1;
    ranked.push({ ...entry, rank, isCurrentStudent: entry.studentId === currentStudentId });
  });
  return ranked;
}

/** The top places, plus the current student's own row when they are not among them. */
export function getLeaderboardPreview(ranked: readonly RankedLeaderboardEntry[], size: number) {
  const top = ranked.slice(0, size);
  const currentStudent = top.some((entry) => entry.isCurrentStudent)
    ? null
    : (ranked.find((entry) => entry.isCurrentStudent) ?? null);
  return { top, currentStudent };
}
