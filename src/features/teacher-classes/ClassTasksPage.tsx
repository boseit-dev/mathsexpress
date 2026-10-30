import { ClipboardList, Plus } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { IconTile } from '@/components/ui/IconTile';
import { paths } from '@/config/paths';
import { TaskTable } from '@/features/teacher-tasks/TaskTable';
import { useClassTasksData } from '@/features/teacher-tasks/teacherTaskHandlers';
import { useClassWorkspace } from './useClassWorkspace';
import styles from './ClassTasksPage.module.css';

/** The work set for this class, newest due first, with a shortcut to set more. */
export function ClassTasksPage() {
  const { teacherClass } = useClassWorkspace();
  const { tasks, now } = useClassTasksData();

  return (
    <section className={styles.section} aria-labelledby="class-tasks-heading">
      <div className={styles.header}>
        <h2 id="class-tasks-heading">Tasks for {teacherClass.name}</h2>
        <ButtonLink to={paths.teacher.newTask(teacherClass.id)} variant="secondary">
          <Plus aria-hidden="true" /> Create task
        </ButtonLink>
      </div>
      {tasks.length === 0 ? (
        <div className={styles.empty}>
          <IconTile icon={ClipboardList} size="large" />
          <p>No tasks for this class yet. Create one to set a lesson with a due date.</p>
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          now={now}
          caption={`Tasks for ${teacherClass.name}`}
          showClass={false}
        />
      )}
    </section>
  );
}
