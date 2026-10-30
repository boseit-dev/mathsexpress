import { useId } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { paths } from '@/config/paths';
import { describeTaskDue, type StudentTask } from '@/domain/tasks';
import { contentKindLabel, progressDisplay } from '@/features/tasks/taskDisplay';
import { cx } from '@/lib/cx';
import { TaskGlyph } from './TaskGlyph';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: StudentTask;
  now: Date;
}

/** One task a teacher set, as a compact strip: progress, details, due date, status and action. */
export function TaskCard({ task, now }: TaskCardProps) {
  const titleId = useId();
  const isCompleted = task.progress === 'completed';
  const due = describeTaskDue(task, now);
  const display = progressDisplay[task.progress];
  const questions = `${task.questionsSolved} of ${task.questionCount} questions`;

  return (
    <article
      className={cx(styles.card, styles.homework, isCompleted && styles.completed)}
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
              value={task.questionsSolved}
              max={task.questionCount}
              label={`${task.title} progress`}
              valueText={questions}
            />
          )}
        </div>

        <div className={styles.info}>
          <p className={styles.kind}>
            <TaskGlyph name="homework" className={styles.kindGlyph} />
            {contentKindLabel[task.contentKind]} · {task.topic} · {task.className}
          </p>
          <h3 id={titleId} className={styles.title}>
            {task.title}
          </h3>
          <p className={styles.questions}>{questions}</p>
          {task.instructions && <p className={styles.questions}>{task.instructions}</p>}
        </div>

        <ul role="list" className={styles.meta}>
          <li className={cx(styles.chip, due.tone === 'overdue' && styles.overdue)}>
            <TaskGlyph name={isCompleted ? 'done' : 'due'} className={styles.chipGlyph} />
            {due.label}
          </li>
          <li>
            <StatusBadge tone={display.tone}>{display.label}</StatusBadge>
          </li>
        </ul>

        <ButtonLink
          to={paths.student.lesson(task.contentId)}
          variant={isCompleted ? 'secondary' : 'primary'}
          className={styles.action}
        >
          {display.action} <VisuallyHidden>{task.title}</VisuallyHidden>
          <TaskGlyph name="arrow" className={styles.actionGlyph} />
        </ButtonLink>
      </div>
    </article>
  );
}
