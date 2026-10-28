import { ArrowUpRight, BookOpenText, GraduationCap, UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import { paths } from '@/config/paths';
import { countOpenAssignments, selectContinueAssignment } from '@/domain/assignment';
import { getPrimaryClass } from '@/domain/student';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useRefreshWhenStale } from '@/hooks/useRefreshWhenStale';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import { AssignmentSection } from './components/AssignmentSection';
import { RecommendedPractice } from './components/RecommendedPractice';
import { StudentProgress } from './components/StudentProgress';
import { WelcomeBanner } from './components/WelcomeBanner';
import { useStudentHomeData } from './studentHomeLoader';
import styles from './StudentHomePage.module.css';

/** The MathsExpress study journal: simple paths into learning and a calm progress overview. */
export function StudentHomePage() {
  const student = useCurrentStudent();
  const { home, now } = useStudentHomeData();
  useDocumentTitle('Home');
  useRefreshWhenStale(now);
  const primaryClass = getPrimaryClass(student);

  return (
    <div className={styles.page}>
      <WelcomeBanner
        student={student}
        primaryClass={primaryClass}
        now={now}
        taskCounts={countOpenAssignments(home.assignments, now)}
        continueAssignment={selectContinueAssignment(home.assignments)}
      />

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
      </nav>

      <section className={styles.section} aria-label="Your study list">
        <div className={styles.sectionTitle}>
          <p className={styles.eyebrow}>01 / YOUR PLAN</p>
          <h2>What’s on your list</h2>
        </div>
        <AssignmentSection assignments={home.assignments} now={now} />
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
        Your account and class details are real. Sections marked “Sample data” are examples while
        we finish building those features.
      </p>
    </div>
  );
}
