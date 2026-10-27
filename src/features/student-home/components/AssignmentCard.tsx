import { useId } from 'react';
import { Check } from 'lucide-react';
import { CoinAmount } from '@/components/ui/CoinAmount';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { describeDue, getAssignmentStatus, type Assignment } from '@/domain/assignment';
import { cx } from '@/lib/cx';
import { formatCount } from '@/lib/format';
import { assignmentKindDisplay, assignmentStatusDisplay, dueToneIcon } from './assignmentDisplay';
import { TaskArt } from './TaskArt';
import styles from './AssignmentCard.module.css';

interface AssignmentCardProps {
  assignment: Assignment;
  now: Date;
}

/** One assigned task: type, title, progress, coin reward, due date and status. */
export function AssignmentCard({ assignment, now }: AssignmentCardProps) {
  const titleId = useId();
  const status = getAssignmentStatus(assignment);
  const due = describeDue(assignment, now);
  const kind = assignmentKindDisplay[assignment.kind];
  const KindIcon = kind.icon;
  const kindChip = (
    <span className={styles.kindChip}>
      <KindIcon />
      {kind.label}
    </span>
  );

  if (status === 'completed') {
    return (
      <article className={cx(styles.card, styles.completed)} aria-labelledby={titleId}>
        {kindChip}
        <p className={styles.completedDate}>{due.label}</p>
        <h3 id={titleId} className={styles.completedTitle}>
          {assignment.title}
        </h3>
        <StatusBadge tone="success" icon={Check}>
          Done
        </StatusBadge>
        <p className={styles.completedMessage}>
          Well done! You earned <CoinAmount amount={assignment.coinsEarned} />.
        </p>
      </article>
    );
  }

  const DueIcon = dueToneIcon[due.tone];
  const statusDisplay = assignmentStatusDisplay[status];
  const questions = `${assignment.questionsCompleted} of ${assignment.questionCount} questions`;

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <div className={cx(styles.art, styles[assignment.kind])}>
        <TaskArt kind={assignment.kind} />
        {kindChip}
      </div>
      <div className={styles.body}>
        <h3 id={titleId} className={styles.title}>
          {assignment.title}
        </h3>
        <p className={styles.topic}>{assignment.topic}</p>
        <div className={styles.progressRow}>
          <ProgressBar
            className={styles.bar}
            value={assignment.questionsCompleted}
            max={assignment.questionCount}
            label={`${assignment.title} progress`}
            valueText={questions}
            size="large"
          />
          <span className={styles.reward}>
            <VisuallyHidden>Reward: </VisuallyHidden>
            <CoinAmount amount={assignment.coinsAvailable} prefix="+" />
          </span>
        </div>
        <p className={styles.progressText}>
          {questions}
          {assignment.coinsEarned > 0 &&
            ` · ${formatCount(assignment.coinsEarned, 'coin')} earned so far`}
        </p>
        <div className={styles.footer}>
          <span className={cx(styles.dueChip, styles[due.tone])}>
            <DueIcon />
            {due.label}
          </span>
          <StatusBadge tone={statusDisplay.tone}>{statusDisplay.label}</StatusBadge>
        </div>
      </div>
    </article>
  );
}
