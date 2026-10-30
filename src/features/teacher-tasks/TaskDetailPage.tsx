import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, CalendarClock, School, BookOpenText, UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import { LatestFormScope } from '@/app/forms/LatestFormScope';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { FormMessage } from '@/components/forms/FormMessage';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextField } from '@/components/forms/TextField';
import { ConfirmAction } from '@/components/ui/ConfirmAction';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TableToolbar } from '@/components/ui/TableToolbar';
import { paths } from '@/config/paths';
import { getFullName } from '@/domain/people';
import { describeTaskDue, type TaskStudentResult } from '@/domain/tasks';
import { accuracyPercent, ofCount, progressDisplay } from '@/features/tasks/taskDisplay';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatLongDate, formatShortDate } from '@/lib/dates';
import { formatCount } from '@/lib/format';
import { useTaskDetailData } from './teacherTaskHandlers';
import styles from './TaskDetailPage.module.css';

const PROGRESS_ORDER = { completed: 0, in_progress: 1, not_started: 2 } as const;

const SORTS = {
  name: {
    label: 'Surname',
    compare: (a: TaskStudentResult, b: TaskStudentResult) =>
      a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName),
  },
  status: {
    label: 'Status',
    compare: (a: TaskStudentResult, b: TaskStudentResult) =>
      PROGRESS_ORDER[a.progress] - PROGRESS_ORDER[b.progress],
  },
  accuracy: {
    label: 'First-try accuracy',
    compare: (a: TaskStudentResult, b: TaskStudentResult) =>
      (accuracyPercent(b.firstTryCorrect, b.questionsSolved) ?? -1) -
      (accuracyPercent(a.firstTryCorrect, a.questionsSolved) ?? -1),
  },
} as const;

type SortKey = keyof typeof SORTS;

function dateInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function timeInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** One task: what it is, when it is due, and each student's result. */
export function TaskDetailPage() {
  const { task, results, now } = useTaskDetailData();
  useDocumentTitle(task.title);
  const isDraft = task.state === 'draft';
  const due = new Date(task.dueAt);
  const publish = useFetcherForm();
  const dueFormRef = useRef<HTMLFormElement>(null);
  const dueDate = useFetcherForm({ formRef: dueFormRef });
  const remove = useFetcherForm();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return results
      .filter((row) => !needle || getFullName(row).toLowerCase().includes(needle))
      .sort(SORTS[sort].compare);
  }, [results, query, sort]);
  const notStarted = task.assignedCount - task.completedCount - task.inProgressCount;

  return (
    <LatestFormScope>
      <div className={styles.page}>
        <PageHeader
          title={task.title}
          before={
            <Link to={paths.teacher.tasks} className={styles.back}>
              <ArrowLeft aria-hidden="true" />
              All tasks
            </Link>
          }
        >
          <p>
            {isDraft ? (
              <StatusBadge tone="warning">Draft · students can’t see it yet</StatusBadge>
            ) : (
              <StatusBadge tone="brand">
                Published {formatShortDate(new Date(task.publishedAt ?? task.createdAt))}
              </StatusBadge>
            )}
          </p>
        </PageHeader>

        <FormMessage tone="success">{publish.successMessage ?? dueDate.successMessage}</FormMessage>
        <FormMessage tone="error">{publish.formMessage ?? remove.formMessage}</FormMessage>

        <div className={styles.columns}>
          <div className={styles.main}>
            <dl className={styles.facts}>
              <div>
                <dt>
                  <School aria-hidden="true" /> Class
                </dt>
                <dd>
                  <Link to={paths.teacher.classTasks(task.classId)}>{task.className}</Link>
                </dd>
              </div>
              <div>
                <dt>
                  <BookOpenText aria-hidden="true" /> Lesson
                </dt>
                <dd>{task.contentTitle}</dd>
              </div>
              <div>
                <dt>
                  <CalendarClock aria-hidden="true" /> Due
                </dt>
                <dd>
                  {formatLongDate(due)},{' '}
                  {due.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}
                  {/* "Due tomorrow" or "Overdue by 2 days" helps; repeating the date doesn't. */}
                  {!isDraft && describeTaskDue(task, now).tone !== 'upcoming' && (
                    <span className={styles.dueNote}>{describeTaskDue(task, now).label}</span>
                  )}
                </dd>
              </div>
              <div>
                <dt>
                  <UsersRound aria-hidden="true" /> For
                </dt>
                <dd>
                  {task.audience === 'class' ? 'The whole class' : 'Chosen students'}
                  {!isDraft && ` · ${formatCount(task.assignedCount, 'student')}`}
                </dd>
              </div>
            </dl>
            {task.instructions && (
              <div className={styles.instructions}>
                <h2>Instructions</h2>
                <p>{task.instructions}</p>
              </div>
            )}

            {isDraft ? (
              <section className={styles.panel} aria-labelledby="results-heading">
                <h2 id="results-heading">Results</h2>
                <p className={styles.muted}>
                  Results appear once the task is published and students start the lesson.
                </p>
              </section>
            ) : (
              <section className={styles.panel} aria-labelledby="results-heading">
                <h2 id="results-heading">Results</h2>
                {task.assignedCount === 0 ? (
                  <p className={styles.muted}>
                    Nobody is set this task right now. Students who join the class will get it.
                  </p>
                ) : (
                  <>
                    <div className={styles.summary}>
                      <ProgressBar
                        value={task.completedCount}
                        max={task.assignedCount}
                        label="Students who completed the task"
                        valueText={`${ofCount(task.completedCount, task.assignedCount)} students`}
                        tone={task.completedCount === task.assignedCount ? 'success' : 'brand'}
                      />
                      <p>
                        <strong>{ofCount(task.completedCount, task.assignedCount)}</strong>{' '}
                        completed · {task.inProgressCount} in progress · {notStarted} not started
                      </p>
                    </div>
                    <TableToolbar
                      searchLabel="Search students"
                      query={query}
                      onQueryChange={setQuery}
                      sortLabel="Sort students by"
                      sort={sort}
                      sortOptions={Object.entries(SORTS).map(([value, { label }]) => ({
                        value,
                        label,
                      }))}
                      onSortChange={(value) => {
                        setSort(value as SortKey);
                      }}
                      summary={
                        query.trim()
                          ? `${formatCount(shown.length, 'student')} of ${results.length} match`
                          : undefined
                      }
                    />
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <caption className={styles.visuallyHidden}>Each student’s result</caption>
                        <thead>
                          <tr>
                            <th scope="col">Student</th>
                            <th scope="col">Status</th>
                            <th scope="col">Questions solved</th>
                            <th scope="col">Right first time</th>
                            <th scope="col">Finished</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shown.map((row) => {
                            const display = progressDisplay[row.progress];
                            const accuracy = accuracyPercent(
                              row.firstTryCorrect,
                              row.questionsSolved,
                            );
                            return (
                              <tr key={row.studentId}>
                                <th scope="row" data-label="Student">
                                  {getFullName(row)}
                                </th>
                                <td data-label="Status">
                                  <StatusBadge tone={display.tone}>{display.label}</StatusBadge>
                                </td>
                                <td data-label="Questions solved">
                                  {ofCount(row.questionsSolved, row.questionCount)}
                                </td>
                                <td data-label="Right first time">
                                  {accuracy === null
                                    ? '—'
                                    : `${accuracy}% (${ofCount(row.firstTryCorrect, row.questionsSolved)})`}
                                </td>
                                <td data-label="Finished">
                                  {row.completedAt ? (
                                    <>
                                      {formatShortDate(new Date(row.completedAt))}
                                      {new Date(row.completedAt) > due && (
                                        <span className={styles.late}> · late</span>
                                      )}
                                    </>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {shown.length === 0 && (
                      <p className={styles.muted}>No students match “{query.trim()}”.</p>
                    )}
                  </>
                )}
              </section>
            )}
          </div>

          <aside className={styles.sidebar} aria-label="Task actions">
            {isDraft && (
              <div className={styles.panel}>
                <h2>Publish</h2>
                <p className={styles.muted}>
                  Students see the task on their home page as soon as it is published.
                </p>
                <publish.fetcher.Form method="post" onSubmit={publish.onSubmit}>
                  <SubmitButton
                    name="intent"
                    value="publish"
                    pending={publish.isSubmitting}
                    pendingLabel="Publishing…"
                  >
                    Publish task
                  </SubmitButton>
                </publish.fetcher.Form>
              </div>
            )}
            <div className={styles.panel}>
              <h2>Due date</h2>
              <dueDate.fetcher.Form
                method="post"
                ref={dueFormRef}
                onSubmit={dueDate.onSubmit}
                noValidate
                className={styles.dueForm}
                // Rebuild with the saved date after each change.
                key={task.dueAt}
              >
                <TextField
                  label="Due date"
                  name="dueDate"
                  type="date"
                  defaultValue={dateInputValue(due)}
                  required
                  error={dueDate.fieldError('dueDate')}
                />
                <TextField
                  label="Due time"
                  name="dueTime"
                  type="time"
                  defaultValue={timeInputValue(due)}
                  required
                />
                <SubmitButton
                  variant="secondary"
                  name="intent"
                  value="due-date"
                  pending={dueDate.isSubmitting}
                  pendingLabel="Saving…"
                >
                  Save due date
                </SubmitButton>
              </dueDate.fetcher.Form>
            </div>
            <div className={styles.panel}>
              <h2>Delete</h2>
              <p className={styles.muted}>
                Students’ saved lesson progress is kept; only the task is removed.
              </p>
              <remove.fetcher.Form method="post" onSubmit={remove.onSubmit}>
                <ConfirmAction
                  triggerLabel="Delete task"
                  triggerContext={task.title}
                  message={`Delete “${task.title}”? Students will no longer see it. This can’t be undone.`}
                  confirmLabel="Delete task"
                  intent="delete"
                  pending={remove.isSubmitting}
                  pendingLabel="Deleting…"
                />
              </remove.fetcher.Form>
            </div>
          </aside>
        </div>
      </div>
    </LatestFormScope>
  );
}
