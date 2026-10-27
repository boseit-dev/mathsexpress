import { Trophy } from 'lucide-react';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Avatar } from '@/components/ui/Avatar';
import { CoinAmount } from '@/components/ui/CoinAmount';
import { Panel } from '@/components/ui/Panel';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { paths } from '@/config/paths';
import {
  getLeaderboardPreview,
  rankLeaderboard,
  type LeaderboardEntry,
  type RankedLeaderboardEntry,
} from '@/domain/leaderboard';
import { cx } from '@/lib/cx';
import styles from './LeaderboardPanel.module.css';

/** How many places the home page shows. */
const LEADERBOARD_SIZE = 5;

const MEDAL_CLASS: Partial<Record<number, string>> = {
  1: styles.gold,
  2: styles.silver,
  3: styles.bronze,
};

interface LeaderboardPanelProps {
  entries: readonly LeaderboardEntry[];
  currentStudentId: string;
}

function renderRow(entry: RankedLeaderboardEntry, detached = false) {
  return (
    <li
      key={entry.studentId}
      className={cx(
        styles.row,
        entry.isCurrentStudent && styles.currentRow,
        detached && styles.detached,
      )}
    >
      <span className={cx(styles.rank, MEDAL_CLASS[entry.rank])}>
        <VisuallyHidden>Rank </VisuallyHidden>
        {entry.rank}
      </span>
      <Avatar name={entry.displayName} size="small" decorative />
      <span className={styles.name}>
        {entry.isCurrentStudent ? (
          <>
            You<VisuallyHidden> ({entry.displayName})</VisuallyHidden>
          </>
        ) : (
          entry.displayName
        )}
      </span>
      <CoinAmount amount={entry.coinsThisWeek} className={styles.coins} />
    </li>
  );
}

/** This week's class leaderboard, with the current student highlighted. */
export function LeaderboardPanel({ entries, currentStudentId }: LeaderboardPanelProps) {
  const { top, currentStudent } = getLeaderboardPreview(
    rankLeaderboard(entries, currentStudentId),
    LEADERBOARD_SIZE,
  );

  return (
    <Panel
      title="Class leaderboard"
      icon={Trophy}
      footer={<ArrowLink to={paths.student.class}>View your class</ArrowLink>}
    >
      <p className={styles.caption}>Coins earned this week</p>
      {top.length === 0 ? (
        <p className={styles.empty}>Nobody in your class has earned coins yet this week.</p>
      ) : (
        <ol role="list" className={styles.list}>
          {top.map((entry) => renderRow(entry))}
          {currentStudent && renderRow(currentStudent, true)}
        </ol>
      )}
    </Panel>
  );
}
