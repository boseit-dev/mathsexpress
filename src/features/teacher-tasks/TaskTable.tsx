import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Link } from 'react-router';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { paths } from '@/config/paths';
import { describeTaskDue, type TeacherTask } from '@/domain/tasks';
import { formatShortDate } from '@/lib/dates';
import { cx } from '@/lib/cx';
import { ofCount } from '@/features/tasks/taskDisplay';
import styles from './TaskTable.module.css';

type SortKey = 'due' | 'title' | 'done';

const COMPARE: Record<SortKey, (a: TeacherTask, b: TeacherTask) => number> = {
  due: (a, b) => a.dueAt.localeCompare(b.dueAt),
  title: (a, b) => a.title.localeCompare(b.title),
  done: (a, b) =>
    (a.assignedCount ? a.completedCount / a.assignedCount : -1) -
    (b.assignedCount ? b.completedCount / b.assignedCount : -1),
};

interface TaskTableProps {
  tasks: readonly TeacherTask[];
  now: Date;
  caption: string;
  /** Show which class each task is for (off inside a class's own page). */
  showClass?: boolean;
}

/** Tasks with their due dates and how many students have finished, sortable by column. */
export function TaskTable({ tasks, now, caption, showClass = true }: TaskTableProps) {
  const [sort, setSort] = useState<{ key: SortKey; descending: boolean }>({
    key: 'due',
    descending: false,
  });
  const sorted = [...tasks].sort((a, b) => {
    const order = COMPARE[sort.key](a, b);
    return sort.descending ? -order : order;
  });

  function header(key: SortKey, label: string) {
    const active = sort.key === key;
    const Icon = active && sort.descending ? ArrowDown : ArrowUp;
    return (
      <th
        scope="col"
        aria-sort={active ? (sort.descending ? 'descending' : 'ascending') : undefined}
      >
        <button
          type="button"
          className={cx(styles.sortButton, active && styles.sorted)}
          onClick={() => {
            setSort({ key, descending: active ? !sort.descending : false });
          }}
        >
          {label}
          <Icon aria-hidden="true" />
        </button>
      </th>
    );
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {header('title', 'Task')}
            {showClass && <th scope="col">Class</th>}
            {header('due', 'Due')}
            <th scope="col">Status</th>
            {header('done', 'Completed')}
          </tr>
        </thead>
        <tbody>
          {sorted.map((task) => {
            const due = describeTaskDue(task, now);
            const isDraft = task.state === 'draft';
            return (
              <tr key={task.id}>
                <td data-label="Task">
                  <Link to={paths.teacher.taskDetail(task.id)} className={styles.title}>
                    {task.title}
                  </Link>
                  <span className={styles.sub}>{task.contentTitle}</span>
                </td>
                {showClass && <td data-label="Class">{task.className}</td>}
                <td data-label="Due">
                  <span
                    className={cx(styles.due, !isDraft && due.tone === 'overdue' && styles.overdue)}
                  >
                    {isDraft ? formatShortDate(new Date(task.dueAt)) : due.label}
                  </span>
                </td>
                <td data-label="Status">
                  {isDraft ? (
                    <StatusBadge tone="warning">Draft</StatusBadge>
                  ) : (
                    <StatusBadge tone="brand">Published</StatusBadge>
                  )}
                </td>
                <td data-label="Completed">
                  {isDraft ? (
                    <span className={styles.sub}>Not set yet</span>
                  ) : task.assignedCount === 0 ? (
                    <span className={styles.sub}>No students</span>
                  ) : (
                    <div className={styles.done}>
                      <ProgressBar
                        value={task.completedCount}
                        max={task.assignedCount}
                        label={`${task.title} completed`}
                        valueText={`${ofCount(task.completedCount, task.assignedCount)} students`}
                        size="small"
                        tone={task.completedCount === task.assignedCount ? 'success' : 'brand'}
                      />
                      <span className={styles.sub}>
                        {ofCount(task.completedCount, task.assignedCount)}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
