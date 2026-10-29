import { Award, LockKeyhole } from 'lucide-react';
import type { ShopRepository } from '@/data/repositories';
import { ShopPreview } from '@/features/shop/ShopPreview';
import { Link } from 'react-router';
import { SampleDataBadge } from '@/components/ui/SampleDataBadge';
import { paths } from '@/config/paths';
import { createSampleStudentHome } from '@/data/sample/sampleStudentHome';
import type { CurrentStudent } from '@/domain/student';
import { ChallengesPanel } from '@/features/student-home/components/ChallengesPanel';
import { LeaderboardPanel } from '@/features/student-home/components/LeaderboardPanel';
import { RewardsSummary } from '@/features/student-home/components/RewardsSummary';
import type { PanelName } from './SidePanelToolbar';
import styles from './SidePanelContents.module.css';

interface SidePanelContentsProps {
  panel: PanelName;
  student: CurrentStudent;
  shop: ShopRepository;
}

/**
 * Scores, coins, badges and challenges do not exist in the V2 database yet.
 * Reuse the existing labelled sample data, never simulate purchases or write data.
 */
export function SidePanelContents({ panel, student, shop }: SidePanelContentsProps) {
  const preview = createSampleStudentHome(new Date(), {
    id: student.id,
    displayName: student.displayName,
  });

  if (panel === 'leaderboard' && student.classes.length === 0) {
    return (
      <div className={styles.contents}>
        <p>Join a class to see class activities here.</p>
        <Link to={paths.student.class}>Go to my class</Link>
      </div>
    );
  }

  return (
    <div className={styles.contents}>
      {panel !== 'shop' && (
        <p className={styles.disclaimer}>
          Preview only. Scores, challenges and achievements shown here are examples, not account results.
        </p>
      )}
      {panel === 'leaderboard' && (
        <LeaderboardPanel entries={preview.leaderboard} currentStudentId={student.id} />
      )}
      {panel === 'shop' && <ShopPreview shop={shop} />}
      {panel === 'challenges' && <ChallengesPanel challenges={preview.challenges} />}
      {panel === 'achievements' && (
        <section className={styles.achievements} aria-label="Achievement preview">
          <div className={styles.previewHeading}>
            <h3>Badge collection</h3>
            <SampleDataBadge />
          </div>
          <p>Here are some examples of badges students could unlock.</p>
          <ul role="list" className={styles.badges}>
            <li>
              <Award aria-hidden="true" />
              <span>
                <strong>First Steps</strong>
                <small>Complete your first lesson · preview badge</small>
              </span>
            </li>
            <li>
              <LockKeyhole aria-hidden="true" />
              <span>
                <strong>Practice Explorer</strong>
                <small>Answer 50 practice questions · preview badge</small>
              </span>
            </li>
            <li>
              <LockKeyhole aria-hidden="true" />
              <span>
                <strong>Algebra Ace</strong>
                <small>Complete 10 algebra lessons · preview badge</small>
              </span>
            </li>
          </ul>
        </section>
      )}
      {panel === 'rewards' && <RewardsSummary rewards={preview.rewards} />}
    </div>
  );
}
