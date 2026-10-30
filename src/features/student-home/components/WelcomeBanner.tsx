import { useEffect, useId } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Mascot } from '@/components/mascot/Mascot';
import { useMascotController } from '@/components/mascot/useMascotController';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { paths } from '@/config/paths';
import type { StudentClassMembership } from '@/domain/classes';
import { formatYearLevel, type CurrentStudent } from '@/domain/student';
import type { StudentTask } from '@/domain/tasks';
import { getGreeting } from '@/lib/dates';
import { formatCount } from '@/lib/format';
import { toPercent } from '@/lib/math';
import styles from './WelcomeBanner.module.css';

interface WelcomeBannerProps {
  student: CurrentStudent;
  primaryClass: StudentClassMembership | null;
  now: Date;
  taskCounts: { open: number; overdue: number };
  continueTask: StudentTask | null;
}

const GREETED_KEY = 'mathsexpress:mascot-greeted';

/** True the first time it is asked in this browser tab, so the mascot waves once, not on every visit. */
function isFirstArrival(): boolean {
  try {
    if (window.sessionStorage.getItem(GREETED_KEY)) return false;
    window.sessionStorage.setItem(GREETED_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

function describeTasks({ open, overdue }: WelcomeBannerProps['taskCounts']): string {
  if (open === 0) return 'You’re all caught up on your tasks. Nice work!';
  const tasks = formatCount(open, 'task');
  if (overdue === 0) return `You have ${tasks} to finish.`;
  return `You have ${tasks} to finish, and ${overdue} ${overdue === 1 ? 'is' : 'are'} overdue.`;
}

/** Plain, welcoming heading with a single clear next action. No oversized hero illustration. */
export function WelcomeBanner({
  student,
  primaryClass,
  now,
  taskCounts,
  continueTask,
}: WelcomeBannerProps) {
  const headingId = useId();
  const mascot = useMascotController('idle');
  const { play } = mascot;

  useEffect(() => {
    if (isFirstArrival()) play('wave', { cycles: 2 });
  }, [play]);

  return (
    <section className={styles.banner} aria-labelledby={headingId}>
      <div className={styles.hello}>
        <div className={styles.introduction}>
          <p className={styles.eyebrow}>YOUR STUDY JOURNAL</p>
          <h1 id={headingId} className={styles.greeting}>
            {getGreeting(now)}, {student.firstName}
          </h1>
          <p className={styles.summary}>{describeTasks(taskCounts)}</p>
          {primaryClass ? (
            <p className={styles.classLabel}>
              {formatYearLevel(primaryClass.yearLevel)} · {primaryClass.className}
            </p>
          ) : (
            <Link to={paths.student.class} className={styles.classLabel}>
              You’re not in a class yet · Join a class
            </Link>
          )}
        </div>
        <Mascot {...mascot.bind} className={styles.mascot} />
      </div>
      <div className={styles.nextUp}>
        <p className={styles.nextUpHeading}>Your next step</p>
        {continueTask && (
          <div className={styles.preview}>
            <p className={styles.nextUpLabel}>
              {continueTask.progress === 'in_progress' ? 'Pick up where you left off' : 'Up next'}
            </p>
            <p className={styles.nextUpTitle}>{continueTask.title}</p>
            <ProgressBar
              value={continueTask.questionsSolved}
              max={continueTask.questionCount}
              label={`${continueTask.title} progress`}
              valueText={`${continueTask.questionsSolved} of ${continueTask.questionCount} questions`}
              size="small"
            />
            <p className={styles.nextUpMeta}>
              {continueTask.questionsSolved} of {continueTask.questionCount} questions ·{' '}
              {toPercent(continueTask.questionsSolved, continueTask.questionCount)}% done
            </p>
          </div>
        )}
        <ButtonLink
          to={continueTask ? paths.student.lesson(continueTask.contentId) : paths.student.learn}
          size="large"
          className={styles.continueButton}
        >
          Continue learning <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </div>
    </section>
  );
}
