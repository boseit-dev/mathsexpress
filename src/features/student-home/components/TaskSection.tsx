import { ClipboardList } from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Panel } from '@/components/ui/Panel';
import { paths } from '@/config/paths';
import { sortStudentTasks, type StudentTask } from '@/domain/tasks';
import { formatCount } from '@/lib/format';
import { TaskCard } from './TaskCard';
import styles from './TaskSection.module.css';

/** How many tasks the home page shows before "View all". */
const HOME_TASK_LIMIT = 3;

interface TaskSectionProps {
  tasks: readonly StudentTask[];
  now: Date;
}

/** The work teachers have set, most urgent first. */
export function TaskSection({ tasks, now }: TaskSectionProps) {
  const shown = sortStudentTasks(tasks).slice(0, HOME_TASK_LIMIT);

  return (
    <Panel
      title="Your assigned tasks"
      icon={ClipboardList}
      footer={
        tasks.length > HOME_TASK_LIMIT && (
          <ArrowLink to={paths.student.tasks}>
            View all {formatCount(tasks.length, 'task')}
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
          {shown.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} now={now} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
