import { ClipboardList } from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Panel } from '@/components/ui/Panel';
import { SampleDataBadge } from '@/components/ui/SampleDataBadge';
import { paths } from '@/config/paths';
import { selectHomeAssignments, type Assignment } from '@/domain/assignment';
import { formatCount } from '@/lib/format';
import { AssignmentCard } from './AssignmentCard';
import styles from './AssignmentSection.module.css';

/** How many tasks the home page shows before "View all". */
const HOME_TASK_LIMIT = 3;

interface AssignmentSectionProps {
  assignments: readonly Assignment[];
  now: Date;
}

export function AssignmentSection({ assignments, now }: AssignmentSectionProps) {
  const shown = selectHomeAssignments(assignments, HOME_TASK_LIMIT);

  return (
    <Panel
      title="Your assigned tasks"
      badge={<SampleDataBadge />}
      icon={ClipboardList}
      footer={
        assignments.length > 0 && (
          <ArrowLink to={paths.student.tasks}>
            View all {formatCount(assignments.length, 'task')}
          </ArrowLink>
        )
      }
    >
      {shown.length === 0 ? (
        <div className={styles.emptyState}>
          <Mascot animation="reading" size={96} cycles={1} />
          <p className={styles.empty}>
            Your teacher hasn’t set any tasks yet. They’ll appear here when they do.
          </p>
        </div>
      ) : (
        <ul role="list" className={styles.list}>
          {shown.map((assignment) => (
            <li key={assignment.id}>
              <AssignmentCard assignment={assignment} now={now} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
