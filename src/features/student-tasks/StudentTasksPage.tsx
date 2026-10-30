import { Mascot } from '@/components/mascot/Mascot';
import { PageHeader } from '@/components/ui/PageHeader';
import { sortStudentTasks } from '@/domain/tasks';
import { TaskCard } from '@/features/student-home/components/TaskCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { formatCount } from '@/lib/format';
import { useStudentTasksData } from './studentTasksLoader';
import styles from './StudentTasksPage.module.css';

/** Every task the student's teachers have set: what's left to do, then what's done. */
export function StudentTasksPage() {
  const { tasks, now } = useStudentTasksData();
  useDocumentTitle('Your tasks');
  useRefreshWhenVisible();
  const sorted = sortStudentTasks(tasks);
  const toDo = sorted.filter((task) => task.progress !== 'completed');
  const done = sorted.filter((task) => task.progress === 'completed');

  return (
    <div className={styles.page}>
      <PageHeader title="Your tasks">
        <p>Work your teachers have set, with due dates and your saved progress.</p>
      </PageHeader>

      {tasks.length === 0 ? (
        <div className={styles.empty}>
          <Mascot animation="reading" size={110} cycles={1} />
          <p>Your teachers haven’t set any tasks yet. They’ll appear here when they do.</p>
        </div>
      ) : (
        <>
          <section aria-labelledby="tasks-to-do" className={styles.section}>
            <h2 id="tasks-to-do">To do · {formatCount(toDo.length, 'task')}</h2>
            {toDo.length === 0 ? (
              <p className={styles.quiet}>You’re all caught up. Nice work!</p>
            ) : (
              <ul role="list" className={styles.list}>
                {toDo.map((task) => (
                  <li key={task.id}>
                    <TaskCard task={task} now={now} />
                  </li>
                ))}
              </ul>
            )}
          </section>
          {done.length > 0 && (
            <section aria-labelledby="tasks-done" className={styles.section}>
              <h2 id="tasks-done">Completed · {formatCount(done.length, 'task')}</h2>
              <ul role="list" className={styles.list}>
                {done.map((task) => (
                  <li key={task.id}>
                    <TaskCard task={task} now={now} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
