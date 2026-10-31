import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  GraduationCap,
  History,
  LibraryBig,
  ListTodo,
  Palette,
  School,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router';
import { paths } from '@/config/paths';
import { formatYearLevel } from '@/domain/student';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import styles from './MorePages.module.css';

const studyLinks = [
  {
    to: paths.student.learn,
    icon: GraduationCap,
    title: 'Guided learning',
    detail: 'Learn with worked examples and practice.',
  },
  {
    to: paths.student.textbook,
    icon: BookOpen,
    title: 'Maths textbooks',
    detail: 'Read explanations for your topics.',
  },
  {
    to: paths.student.tasks,
    icon: ListTodo,
    title: 'My assignments',
    detail: 'See your teacher-assigned work and progress.',
  },
  {
    to: paths.student.class,
    icon: School,
    title: 'My classes',
    detail: 'See your classes, teachers and year levels.',
  },
  {
    to: paths.student.shop,
    icon: Sparkles,
    title: 'Rewards shop',
    detail: 'Explore items you can buy with your coins.',
  },
  {
    to: paths.student.shopCollection,
    icon: Palette,
    title: 'My collection',
    detail: 'Try on the looks you have collected.',
  },
  {
    to: paths.student.shopHistory,
    icon: History,
    title: 'Coin history',
    detail: 'Review your rewards and spending.',
  },
] as const;

function displayTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

/** A deliberately local timer: it never tracks or reports a student's study activity. */
function FocusTimer() {
  const [duration, setDuration] = useState(15 * 60);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [deadline, setDeadline] = useState<number | null>(null);

  useEffect(() => {
    if (deadline === null) return;
    const refresh = () => setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    refresh();
    const timerId = window.setInterval(refresh, 500);
    return () => window.clearInterval(timerId);
  }, [deadline]);

  const running = deadline !== null && secondsLeft > 0;
  const finished = secondsLeft === 0;
  const pause = () => {
    if (deadline !== null) {
      setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
      setDeadline(null);
    }
  };
  const reset = (nextDuration = duration) => {
    setDeadline(null);
    setDuration(nextDuration);
    setSecondsLeft(nextDuration);
  };

  return (
    <section className={styles.timer} aria-labelledby="focus-heading">
      <div className={styles.timerIntro}>
        <span className={styles.iconBubble}>
          <Clock3 aria-hidden="true" />
        </span>
        <div>
          <h2 id="focus-heading">Focus timer</h2>
          <p>Choose a short study session. Take a break when you need one.</p>
        </div>
      </div>
      <output className={styles.time} aria-label="Time remaining">
        {displayTime(secondsLeft)}
      </output>
      {finished && (
        <p className={styles.done} role="status">
          Session finished. Great work!
        </p>
      )}
      <div className={styles.presets} aria-label="Choose a focus session">
        {[5, 15, 25].map((minutes) => (
          <button
            key={minutes}
            type="button"
            aria-pressed={duration === minutes * 60}
            onClick={() => reset(minutes * 60)}
          >
            {minutes} min
          </button>
        ))}
      </div>
      <div className={styles.timerActions}>
        {running ? (
          <button type="button" className={styles.primaryButton} onClick={pause}>
            Pause
          </button>
        ) : (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setDeadline(Date.now() + secondsLeft * 1000)}
            disabled={finished}
          >
            {secondsLeft === duration ? 'Start focus' : 'Resume'}
          </button>
        )}
        <button type="button" className={styles.secondaryButton} onClick={() => reset()}>
          Reset
        </button>
      </div>
      <p className={styles.localNote}>
        This timer runs only while you stay on this page. It does not save or share your activity.
      </p>
    </section>
  );
}

export function StudentMorePage() {
  const student = useCurrentStudent();
  useDocumentTitle('More');
  const years = [...new Set(student.classes.map((membership) => membership.yearLevel))];

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>
          <LibraryBig size={17} aria-hidden="true" /> YOUR STUDY SPACE
        </p>
        <h1>More</h1>
        <p>Everything you need to keep learning, customise your look and stay organised.</p>
      </header>
      <section className={styles.overview} aria-label="Your account at a glance">
        <div>
          <strong>{student.classes.length}</strong>
          <span>{student.classes.length === 1 ? 'Class joined' : 'Classes joined'}</span>
        </div>
        <div>
          <strong>{years.length ? years.map(formatYearLevel).join(' · ') : '—'}</strong>
          <span>Teacher-assigned learning level</span>
        </div>
      </section>
      <div className={styles.columns}>
        <section className={styles.tools} aria-labelledby="tools-heading">
          <div className={styles.heading}>
            <h2 id="tools-heading">Explore your tools</h2>
            <p>All links open real sections of MathsExpress.</p>
          </div>
          <nav aria-label="Student tools" className={styles.linkGrid}>
            {studyLinks.map(({ to, icon: Icon, title, detail }) => (
              <Link key={to} to={to} className={styles.toolLink}>
                <span className={styles.iconBubble}>
                  <Icon aria-hidden="true" />
                </span>
                <span className={styles.toolCopy}>
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </span>
                <ArrowUpRight className={styles.arrow} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </section>
        <FocusTimer />
      </div>
    </div>
  );
}
