import { useId } from 'react';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { paths } from '@/config/paths';
import { Link } from 'react-router';
import { getAssignmentStatus, type Assignment } from '@/domain/assignment';
import type { StudentClassMembership } from '@/domain/classes';
import { formatYearLevel, type CurrentStudent } from '@/domain/student';
import { getGreeting } from '@/lib/dates';
import { formatCount } from '@/lib/format';
import { toPercent } from '@/lib/math';
import { HeroIllustration } from './HeroIllustration';
import styles from './WelcomeBanner.module.css';

interface WelcomeBannerProps {
  student: CurrentStudent;
  /** The class shown in the banner; null until the student joins one. */
  primaryClass: StudentClassMembership | null;
  now: Date;
  taskCounts: { open: number; overdue: number };
  /** The task "Continue learning" refers to, or null when nothing is open. */
  continueAssignment: Assignment | null;
}

function describeTasks({ open, overdue }: WelcomeBannerProps['taskCounts']): string {
  if (open === 0) return 'You’re all caught up on your tasks. Nice work!';
  const tasks = formatCount(open, 'task');
  if (overdue === 0) return `You have ${tasks} to finish.`;
  return `You have ${tasks} to finish, and ${overdue} ${overdue === 1 ? 'is' : 'are'} overdue.`;
}

export function WelcomeBanner({
  student,
  primaryClass,
  now,
  taskCounts,
  continueAssignment,
}: WelcomeBannerProps) {
  const headingId = useId();

  return (
    <section className={styles.banner} aria-labelledby={headingId}>
      <div className={styles.content}>
        {primaryClass ? (
          <p className={styles.classLabel}>
            {formatYearLevel(primaryClass.yearLevel)} · {primaryClass.className}
          </p>
        ) : (
          <Link to={paths.student.class} className={styles.classLabel}>
            You’re not in a class yet · Join a class
          </Link>
        )}
        <h1 id={headingId} className={styles.greeting}>
          {getGreeting(now)}, {student.firstName}
        </h1>
        <p className={styles.summary}>{describeTasks(taskCounts)}</p>

        <div className={styles.continue}>
          {continueAssignment && (
            <div className={styles.nextUp}>
              <p className={styles.nextUpLabel}>
                {getAssignmentStatus(continueAssignment) === 'in-progress'
                  ? 'Pick up where you left off'
                  : 'Up next'}{' '}
                <span className={styles.sampleTag}>(sample task)</span>
              </p>
              <p className={styles.nextUpTitle}>{continueAssignment.title}</p>
              <ProgressBar
                value={continueAssignment.questionsCompleted}
                max={continueAssignment.questionCount}
                label={`${continueAssignment.title} progress`}
                valueText={`${continueAssignment.questionsCompleted} of ${continueAssignment.questionCount} questions`}
                tone="inverse"
                size="small"
              />
              <p className={styles.nextUpMeta}>
                {continueAssignment.questionsCompleted} of {continueAssignment.questionCount}{' '}
                questions ·{' '}
                {toPercent(continueAssignment.questionsCompleted, continueAssignment.questionCount)}
                % done
              </p>
            </div>
          )}
          <ButtonLink
            to={paths.student.learn}
            variant="inverse"
            size="large"
            className={styles.continueButton}
          >
            Continue learning
            <ArrowRight />
          </ButtonLink>
        </div>
      </div>
      <HeroIllustration className={styles.illustration} />
    </section>
  );
}
