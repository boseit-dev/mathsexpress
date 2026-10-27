import { useId } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { CoinAmount } from '@/components/ui/CoinAmount';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { paths } from '@/config/paths';
import { describeDue, getAssignmentStatus, type Assignment } from '@/domain/assignment';
import { cx } from '@/lib/cx';
import { assignmentKindLabel, assignmentStatusDisplay } from './assignmentDisplay';
import { TaskGlyph } from './TaskGlyph';
import styles from './AssignmentCard.module.css';

interface AssignmentCardProps {
  assignment: Assignment;
  now: Date;
}

/** One assigned task as a compact strip: progress, details, due date, coins, status and action. */
export function AssignmentCard({ assignment, now }: AssignmentCardProps) {
  const titleId = useId();
  const status = getAssignmentStatus(assignment);
  const isCompleted = status === 'completed';
  const due = describeDue(assignment, now);
  const statusDisplay = assignmentStatusDisplay[status];
  const questions = `${assignment.questionsCompleted} of ${assignment.questionCount} questions`;

  return (
    <article
      className={cx(styles.card, styles[assignment.kind], isCompleted && styles.completed)}
      aria-labelledby={titleId}
    >
      <div className={styles.layout}>
        <div className={styles.progress}>
          {isCompleted ? (
            <span className={styles.medallion}>
              <TaskGlyph name="done" className={styles.medallionGlyph} />
            </span>
          ) : (
            <ProgressRing
              value={assignment.questionsCompleted}
              max={assignment.questionCount}
              label={`${assignment.title} progress`}
              valueText={questions}
            />
          )}
        </div>

        <div className={styles.info}>
          <p className={styles.kind}>
            <TaskGlyph name={assignment.kind} className={styles.kindGlyph} />
            {assignmentKindLabel[assignment.kind]} · {assignment.topic}
          </p>
          <h3 id={titleId} className={styles.title}>
            {assignment.title}
          </h3>
          <p className={styles.questions}>{questions}</p>
        </div>

        <ul role="list" className={styles.meta}>
          <li className={cx(styles.chip, due.tone === 'overdue' && styles.overdue)}>
            <TaskGlyph name={isCompleted ? 'done' : 'due'} className={styles.chipGlyph} />
            {due.label}
          </li>
          <li className={styles.chip}>
            {isCompleted ? (
              <>
                <CoinAmount amount={assignment.coinsEarned} /> earned
              </>
            ) : (
              <>
                <VisuallyHidden>Reward: </VisuallyHidden>
                <CoinAmount amount={assignment.coinsAvailable} prefix="+" />
              </>
            )}
          </li>
          <li>
            <StatusBadge tone={statusDisplay.tone}>{statusDisplay.label}</StatusBadge>
          </li>
        </ul>

        <ButtonLink
          to={paths.student.learn}
          variant={isCompleted ? 'secondary' : 'primary'}
          className={styles.action}
        >
          {statusDisplay.action} <VisuallyHidden>{assignment.title}</VisuallyHidden>
          <TaskGlyph name="arrow" className={styles.actionGlyph} />
        </ButtonLink>
      </div>
    </article>
  );
}
