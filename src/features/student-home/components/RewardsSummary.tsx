import { Award, Gift } from 'lucide-react';
import { CoinAmount } from '@/components/ui/CoinAmount';
import { IconTile } from '@/components/ui/IconTile';
import { Panel } from '@/components/ui/Panel';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { RewardSummary } from '@/domain/rewards';
import { formatNumber } from '@/lib/format';
import styles from './RewardsSummary.module.css';

/** Compact reward information: this week's coins, badges and the next badge to earn. */
export function RewardsSummary({ rewards }: { rewards: RewardSummary }) {
  const { nextBadge } = rewards;

  return (
    <Panel title="Your rewards" icon={Gift}>
      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt>Earned this week</dt>
          <dd>
            <CoinAmount amount={rewards.coinsEarnedThisWeek} prefix="+" />
          </dd>
        </div>
        <div className={styles.stat}>
          <dt>Badges earned</dt>
          <dd>{formatNumber(rewards.badgesEarned)}</dd>
        </div>
      </dl>
      {nextBadge && (
        <div className={styles.nextBadge}>
          <div className={styles.badgeRow}>
            <IconTile icon={Award} tone="coin" size="small" />
            <div>
              <p className={styles.badgeName}>Next badge: {nextBadge.name}</p>
              <p className={styles.badgeDescription}>{nextBadge.description}</p>
            </div>
          </div>
          <ProgressBar
            value={nextBadge.progress}
            max={nextBadge.target}
            label={`Progress towards the ${nextBadge.name} badge`}
            valueText={`${nextBadge.progress} of ${nextBadge.target}`}
            size="small"
          />
          <p className={styles.badgeProgress}>
            {nextBadge.progress} of {nextBadge.target} done
          </p>
        </div>
      )}
    </Panel>
  );
}
