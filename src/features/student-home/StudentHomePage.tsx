import { ArrowUpRight, BookOpenText, GraduationCap, UsersRound } from 'lucide-react';
import { StudentAvatar } from '@/components/cosmetics/StudentAvatar';
import { findTextbook, findTextbookChapter } from '@/features/textbook/catalogue';
import { getLastReadChapter } from '@/features/textbook/readingHistory';
import { Link } from 'react-router';
import { paths } from '@/config/paths';
import { countOpenTasks, selectContinueTask } from '@/domain/tasks';
import { getPrimaryClass } from '@/domain/student';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useRefreshWhenStale } from '@/hooks/useRefreshWhenStale';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import { useStudentLook } from '@/layouts/student/studentLook';
import { TaskSection } from './components/TaskSection';
import { RecommendedPractice } from './components/RecommendedPractice';
import { StudentProgress } from './components/StudentProgress';
import { WelcomeBanner } from './components/WelcomeBanner';
import { useStudentHomeData } from './studentHomeLoader';
import styles from './StudentHomePage.module.css';

/** The MathsExpress study journal: simple paths into learning and a calm progress overview. */
export function StudentHomePage() {
  const student = useCurrentStudent();
  const { home, tasks, now } = useStudentHomeData();
  useDocumentTitle('Home');
  useRefreshWhenStale(now);
  const primaryClass = getPrimaryClass(student);
  const look = useStudentLook();
  const recent = getLastReadChapter(student.id);
  const recentBook = findTextbook(recent?.bookId);
  const recentChapter = recentBook && findTextbookChapter(recentBook, recent?.chapterId);

  return (
    <div className={styles.page}>
      <WelcomeBanner
        student={student}
        primaryClass={primaryClass}
        now={now}
        taskCounts={countOpenTasks(tasks, now)}
        continueTask={selectContinueTask(tasks)}
      />

      {recentBook && recentChapter?.status === 'ready' && (
        <Link className={styles.resumeReading} to={paths.student.textbookChapter(recentBook.id, recentChapter.id)}>
          <BookOpenText aria-hidden="true" />
          <span><strong>Pick up your textbook</strong><span>{recentBook.course} · {recentChapter.title}</span></span>
          <ArrowUpRight aria-hidden="true" />
        </Link>
      )}

      <nav className={styles.paths} aria-label="Study shortcuts">
        <Link to={paths.student.learn} className={styles.path}>
          <span className={styles.pathIcon}>
            <BookOpenText aria-hidden="true" />
          </span>
          <span className={styles.pathCopy}>
            <strong>Learn a topic</strong>
            <span>Lessons and practice, one step at a time.</span>
          </span>
          <ArrowUpRight className={styles.pathArrow} aria-hidden="true" />
        </Link>
        <Link to={paths.student.textbook} className={styles.path}>
          <span className={styles.pathIcon}>
            <GraduationCap aria-hidden="true" />
          </span>
          <span className={styles.pathCopy}>
            <strong>Textbook</strong>
            <span>Your maths reference space.</span>
          </span>
          <ArrowUpRight className={styles.pathArrow} aria-hidden="true" />
        </Link>
        <Link to={paths.student.class} className={styles.path}>
          <span className={styles.pathIcon}>
            <UsersRound aria-hidden="true" />
          </span>
          <span className={styles.pathCopy}>
            <strong>My class</strong>
            <span>See your teachers and class details.</span>
          </span>
          <ArrowUpRight className={styles.pathArrow} aria-hidden="true" />
        </Link>
        <Link to={paths.student.shop} className={styles.path}>
          <span className={styles.lookIcon}>
            <StudentAvatar name={student.displayName} look={look ?? {}} decorative />
          </span>
          <span className={styles.pathCopy}>
            <strong>Shop</strong>
            <span>Spend your coins on avatars and more.</span>
          </span>
          <ArrowUpRight className={styles.pathArrow} aria-hidden="true" />
        </Link>
      </nav>

      <section className={styles.section} aria-label="Your study list">
        <div className={styles.sectionTitle}>
          <p className={styles.eyebrow}>01 / YOUR PLAN</p>
          <h2>What’s on your list</h2>
        </div>
        <TaskSection tasks={tasks} now={now} />
      </section>

      <section className={styles.section} aria-label="Your learning snapshot">
        <div className={styles.sectionTitle}>
          <p className={styles.eyebrow}>02 / YOUR JOURNEY</p>
          <h2>Learning snapshot</h2>
        </div>
        <StudentProgress progress={home.progress} yearLevel={primaryClass?.yearLevel ?? null} />
      </section>

      <section className={styles.section} aria-label="Practice and review">
        <div className={styles.sectionTitle}>
          <p className={styles.eyebrow}>03 / KEEP GOING</p>
          <h2>A little more practice</h2>
        </div>
        <RecommendedPractice recommendation={home.recommendation} />
      </section>

      <p className={styles.footnote}>
        Your account and class details are real. Sections marked “Sample data” are examples while we
        finish building those features.
      </p>
    </div>
  );
}
