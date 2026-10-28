import { countOpenAssignments, selectContinueAssignment } from '@/domain/assignment';
import { getPrimaryClass } from '@/domain/student';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useRefreshWhenStale } from '@/hooks/useRefreshWhenStale';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import { AssignmentSection } from './components/AssignmentSection';
import { ChallengesPanel } from './components/ChallengesPanel';
import { LeaderboardPanel } from './components/LeaderboardPanel';
import { RecommendedPractice } from './components/RecommendedPractice';
import { RewardsSummary } from './components/RewardsSummary';
import { ShopPanel } from './components/ShopPanel';
import { StudentProgress } from './components/StudentProgress';
import { WelcomeBanner } from './components/WelcomeBanner';
import { useStudentHomeData } from './studentHomeLoader';
import styles from './StudentHomePage.module.css';

/**
 * The MathsExpress Learning Desk: a two-card welcome/progress area, a separate
 * practice-and-assignments workbench, and a classroom/rewards collection below.
 * The existing data sources and working destinations stay unchanged.
 */
export function StudentHomePage() {
  const student = useCurrentStudent();
  const { home, now } = useStudentHomeData();
  useDocumentTitle('Home');
  useRefreshWhenStale(now);
  const primaryClass = getPrimaryClass(student);

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div className={styles.welcome}>
          <WelcomeBanner
            student={student}
            primaryClass={primaryClass}
            now={now}
            taskCounts={countOpenAssignments(home.assignments, now)}
            continueAssignment={selectContinueAssignment(home.assignments)}
          />
        </div>
        <div className={styles.progress}>
          <StudentProgress progress={home.progress} yearLevel={primaryClass?.yearLevel ?? null} />
        </div>
      </div>

      <section className={styles.workbench} aria-label="Your learning desk">
        <div className={styles.practice}>
          <RecommendedPractice recommendation={home.recommendation} />
        </div>
        <div className={styles.tasks}>
          <AssignmentSection assignments={home.assignments} now={now} />
        </div>
      </section>

      <section className={styles.community} aria-label="Classroom and rewards">
        <div className={styles.sectionHeading}>
          <h2 className={styles.sectionTitle}>Beyond the lesson</h2>
          <p className={styles.sectionDescription}>
            Your class, your challenges and the little wins worth celebrating.
          </p>
        </div>
        <div className={styles.communityGrid}>
          <div className={styles.challenges}>
            <ChallengesPanel challenges={home.challenges} />
          </div>
          <div className={styles.leaderboard}>
            <LeaderboardPanel entries={home.leaderboard} currentStudentId={student.id} />
          </div>
          <div className={styles.rewards}>
            <RewardsSummary rewards={home.rewards} />
          </div>
          <div className={styles.shop}>
            <ShopPanel items={home.featuredShopItems} coinBalance={home.rewards.coinBalance} />
          </div>
        </div>
      </section>
    </div>
  );
}
