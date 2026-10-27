import { BookCheck, Flame, PenLine, Target, TrendingUp } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getAccuracyPercent, type LearningProgress } from '@/domain/progress';
import { formatYearLevel, type YearLevel } from '@/domain/student';
import { formatCount, formatNumber } from '@/lib/format';
import { ProgressCard } from './ProgressCard';
import styles from './StudentProgress.module.css';

interface StudentProgressProps {
  progress: LearningProgress;
  /** The year level the teacher set; the course size depends on it. */
  yearLevel: YearLevel;
}

export function StudentProgress({ progress, yearLevel }: StudentProgressProps) {
  const accuracy = getAccuracyPercent(progress);
  const { topicsCompleted, topicsInCourse } = progress;

  return (
    <Panel title="Your progress" icon={TrendingUp}>
      <ul role="list" className={styles.grid}>
        <li>
          <ProgressCard
            icon={BookCheck}
            label="Topics completed"
            value={formatNumber(topicsCompleted)}
            detail={`of ${formatNumber(topicsInCourse)} in ${formatYearLevel(yearLevel)}`}
          >
            <ProgressBar
              value={topicsCompleted}
              max={topicsInCourse}
              label="Topics completed"
              valueText={`${topicsCompleted} of ${topicsInCourse} topics`}
              size="small"
            />
          </ProgressCard>
        </li>
        <li>
          <ProgressCard
            icon={PenLine}
            label="Questions answered"
            value={formatNumber(progress.questionsAnswered)}
            detail={`${formatNumber(progress.questionsAnsweredThisWeek)} this week`}
          />
        </li>
        <li>
          <ProgressCard
            icon={Target}
            tone="success"
            label="Accuracy"
            value={accuracy === null ? '–' : `${accuracy}%`}
            detail={
              accuracy === null
                ? 'No answers yet'
                : `${formatNumber(progress.questionsCorrect)} answered correctly`
            }
          />
        </li>
        <li>
          <ProgressCard
            icon={Flame}
            tone="warning"
            label="Learning streak"
            value={formatCount(progress.streakDays, 'day')}
            detail={`Best: ${formatCount(progress.bestStreakDays, 'day')}`}
          />
        </li>
      </ul>
    </Panel>
  );
}
