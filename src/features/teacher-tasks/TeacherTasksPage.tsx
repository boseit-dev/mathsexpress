import { useMemo, useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { IconTile } from '@/components/ui/IconTile';
import { PageHeader } from '@/components/ui/PageHeader';
import { TableToolbar } from '@/components/ui/TableToolbar';
import { paths } from '@/config/paths';
import { isTaskOverdue, type TeacherTask } from '@/domain/tasks';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatCount } from '@/lib/format';
import { TaskTable } from './TaskTable';
import { useTeacherTasksData } from './teacherTaskHandlers';
import styles from './TeacherTasksPage.module.css';

type StatusFilter = 'all' | 'open' | 'overdue' | 'draft';

const STATUS_FILTERS: Record<
  StatusFilter,
  { label: string; test: (task: TeacherTask, now: Date) => boolean }
> = {
  all: { label: 'All tasks', test: () => true },
  open: {
    label: 'Open',
    test: (task, now) => task.state === 'published' && !isTaskOverdue(task, now),
  },
  overdue: {
    label: 'Past due',
    test: (task, now) => task.state === 'published' && isTaskOverdue(task, now),
  },
  draft: { label: 'Drafts', test: (task) => task.state === 'draft' },
};

/** Every task the teacher has set, across their classes, with search and filters. */
export function TeacherTasksPage() {
  const { tasks, classes, now } = useTeacherTasksData();
  useDocumentTitle('Tasks');
  const [query, setQuery] = useState('');
  const [classId, setClassId] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tasks.filter(
      (task) =>
        (!classId || task.classId === classId) &&
        STATUS_FILTERS[status].test(task, now) &&
        (!needle ||
          task.title.toLowerCase().includes(needle) ||
          task.contentTitle.toLowerCase().includes(needle)),
    );
  }, [tasks, query, classId, status, now]);
  const filtered = query.trim() !== '' || classId !== '' || status !== 'all';

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <PageHeader title="Tasks">
          <p>Set lessons for a class or for chosen students, and see who has finished.</p>
        </PageHeader>
        {classes.length > 0 && (
          <ButtonLink to={paths.teacher.newTask()} className={styles.create}>
            <Plus aria-hidden="true" /> Create task
          </ButtonLink>
        )}
      </div>

      {classes.length === 0 ? (
        <div className={styles.empty}>
          <IconTile icon={ClipboardList} size="large" />
          <div>
            <p className={styles.emptyTitle}>Create a class first</p>
            <p>Tasks are set for a class, so you’ll need a class with students before you start.</p>
            <ButtonLink to={`${paths.teacher.classes}#create-class`} variant="secondary">
              Create a class
            </ButtonLink>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className={styles.empty}>
          <IconTile icon={ClipboardList} size="large" />
          <div>
            <p className={styles.emptyTitle}>No tasks yet</p>
            <p>Set a lesson for a class. Students see it on their home page straight away.</p>
            <ButtonLink to={paths.teacher.newTask()}>Create your first task</ButtonLink>
          </div>
        </div>
      ) : (
        <section aria-labelledby="task-list-heading" className={styles.section}>
          <h2 id="task-list-heading" className={styles.visuallyHidden}>
            Your tasks
          </h2>
          <div className={styles.filters}>
            <TableToolbar
              searchLabel="Search tasks"
              query={query}
              onQueryChange={setQuery}
              summary={
                filtered
                  ? `${formatCount(shown.length, 'task')} of ${tasks.length} shown`
                  : undefined
              }
            />
            <div className={styles.selects}>
              <label className={styles.filter}>
                <span>Class</span>
                <select
                  value={classId}
                  onChange={(event) => {
                    setClassId(event.target.value);
                  }}
                >
                  <option value="">All classes</option>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.filter}>
                <span>Status</span>
                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as StatusFilter);
                  }}
                >
                  {Object.entries(STATUS_FILTERS).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          {shown.length === 0 ? (
            <p className={styles.noMatch}>No tasks match these filters.</p>
          ) : (
            <TaskTable tasks={shown} now={now} caption="Your tasks" />
          )}
        </section>
      )}
    </div>
  );
}
