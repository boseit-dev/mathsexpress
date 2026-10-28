import { Circle, CircleCheck, Clock, Zap } from 'lucide-react';
import { CoinAmount } from '@/components/ui/CoinAmount';
import { Panel } from '@/components/ui/Panel';
import { SampleDataBadge } from '@/components/ui/SampleDataBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { isChallengeComplete, type DailyChallenge } from '@/domain/rewards';
import { cx } from '@/lib/cx';
import styles from './ChallengesPanel.module.css';

interface ChallengesPanelProps {
  challenges: readonly DailyChallenge[];
}

/** Today's challenges with progress and coin rewards. They reset at midnight. */
export function ChallengesPanel({ challenges }: ChallengesPanelProps) {
  return (
    <Panel
      title="Daily challenges"
      badge={<SampleDataBadge />}
      icon={Zap}
      action={
        <p className={styles.reset}>
          <Clock />
          Resets at midnight
        </p>
      }
    >
      {challenges.length === 0 ? (
        <p className={styles.empty}>New challenges appear here every day.</p>
      ) : (
        <ul role="list" className={styles.list}>
          {challenges.map((challenge) => {
            const isComplete = isChallengeComplete(challenge);
            const StatusIcon = isComplete ? CircleCheck : Circle;
            const progress = `${Math.min(challenge.progress, challenge.target)} of ${challenge.target}`;
            return (
              <li
                key={challenge.id}
                className={cx(styles.challenge, isComplete && styles.complete)}
              >
                <div className={styles.top}>
                  <p className={styles.title}>
                    <StatusIcon className={styles.statusIcon} />
                    {challenge.title}
                  </p>
                  <span className={styles.reward}>
                    <VisuallyHidden>Reward: </VisuallyHidden>
                    <CoinAmount amount={challenge.rewardCoins} prefix="+" />
                  </span>
                </div>
                <ProgressBar
                  value={challenge.progress}
                  max={challenge.target}
                  label={challenge.title}
                  valueText={progress}
                  tone={isComplete ? 'success' : 'brand'}
                  size="small"
                />
                <p className={styles.progressText}>{isComplete ? 'Completed' : progress}</p>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
