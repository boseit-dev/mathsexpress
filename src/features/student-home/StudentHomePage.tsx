import { countOpenAssignments, selectContinueAssignment } from '@/domain/assignment';
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

/** The student's home page: a welcome banner, then tasks and practice beside class rewards. */
export function StudentHomePage() {
  const student = useCurrentStudent();
  const { home, now } = useStudentHomeData();
  useDocumentTitle('Home');
  useRefreshWhenStale(now);

  return (
    <div className={styles.page}>
      <WelcomeBanner
        student={student}
        now={now}
        taskCounts={countOpenAssignments(home.assignments, now)}
        continueAssignment={selectContinueAssignment(home.assignments)}
      />
      <div className={styles.columns}>
        <div className={styles.main}>
          <AssignmentSection assignments={home.assignments} now={now} />
          <RecommendedPractice recommendation={home.recommendation} />
          <StudentProgress progress={home.progress} yearLevel={student.enrolment.yearLevel} />
        </div>
        <div className={styles.sidebar}>
          <LeaderboardPanel entries={home.leaderboard} currentStudentId={student.id} />
          <ShopPanel items={home.featuredShopItems} coinBalance={student.coinBalance} />
          <ChallengesPanel challenges={home.challenges} />
          <RewardsSummary rewards={home.rewards} />
        </div>
      </div>
    </div>
  );
}
