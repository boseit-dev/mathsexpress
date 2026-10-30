import { useMemo, useState } from 'react';
import { ArrowLeft, ChartColumn } from 'lucide-react';
import { Link } from 'react-router';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TableToolbar } from '@/components/ui/TableToolbar';
import { getFullName } from '@/domain/people';
import { REPORT_PERIODS, summariseClass, type StudentProgressSummary } from '@/domain/reports';
import { formatYearLevel } from '@/domain/student';
import { accuracyPercent, ofCount } from '@/features/tasks/taskDisplay';
import { TaskTable } from '@/features/teacher-tasks/TaskTable';
import { formatShortDate } from '@/lib/dates';
import { formatCount } from '@/lib/format';
import type { ClassReportData } from './reportHandlers';
import styles from './ClassReport.module.css';

const SORTS = {
  name: {
    label: 'Surname',
    compare: (a: StudentProgressSummary, b: StudentProgressSummary) =>
      a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName),
  },
  lessons: {
    label: 'Lessons completed',
    compare: (a: StudentProgressSummary, b: StudentProgressSummary) =>
      b.lessonsCompleted - a.lessonsCompleted,
  },
  accuracy: {
    label: 'Right first time',
    compare: (a: StudentProgressSummary, b: StudentProgressSummary) =>
      (accuracyPercent(b.firstTryCorrect, b.questionsAnswered) ?? -1) -
      (accuracyPercent(a.firstTryCorrect, a.questionsAnswered) ?? -1),
  },
  recent: {
    label: 'Recently active',
    compare: (a: StudentProgressSummary, b: StudentProgressSummary) =>
      (b.lastActiveAt ?? '').localeCompare(a.lastActiveAt ?? ''),
  },
} as const;

type SortKey = keyof typeof SORTS;

function percentText(part: number, whole: number): string {
  const value = accuracyPercent(part, whole);
  return value === null ? '—' : `${value}%`;
}

interface ClassReportProps {
  data: ClassReportData;
  /** Where to open one student's report, and where to go back to the whole class. */
  studentLink: (studentId: string) => string;
  classLink: string;
}

/** A class's saved learning for the period, or one student's when a student is chosen. */
export function ClassReport({ data, studentLink, classLink }: ClassReportProps) {
  if (data.student) {
    return <StudentReport data={data} classLink={classLink} />;
  }
  return <WholeClassReport data={data} studentLink={studentLink} />;
}

function WholeClassReport({ data, studentLink }: Omit<ClassReportProps, 'classLink'>) {
  const totals = summariseClass(data.students);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return data.students
      .filter((row) => !needle || getFullName(row).toLowerCase().includes(needle))
      .sort(SORTS[sort].compare);
  }, [data.students, query, sort]);
  const period = REPORT_PERIODS[data.period].label.toLowerCase();

  if (data.students.length === 0) {
    return (
      <div className={styles.empty}>
        <IconTile icon={ChartColumn} size="large" />
        <p>No students have joined this class yet, so there is nothing to report.</p>
      </div>
    );
  }

  return (
    <div className={styles.report}>
      <dl className={styles.tiles}>
        <div>
          <dt>Active students</dt>
          <dd>{ofCount(totals.active, totals.students)}</dd>
        </div>
        <div>
          <dt>Lessons completed</dt>
          <dd>{totals.lessonsCompleted}</dd>
        </div>
        <div>
          <dt>Right first time</dt>
          <dd>{percentText(totals.firstTryCorrect, totals.questionsAnswered)}</dd>
        </div>
        <div>
          <dt>Tasks completed</dt>
          <dd>
            {totals.tasksAssigned === 0
              ? '—'
              : ofCount(totals.tasksCompleted, totals.tasksAssigned)}
          </dd>
        </div>
      </dl>

      {totals.questionsAnswered === 0 ? (
        <div className={styles.empty}>
          <IconTile icon={ChartColumn} size="large" />
          <p>
            No saved work {data.period === 'all' ? 'yet' : `in the ${period}`}. Results appear here
            as students answer lesson questions.
          </p>
        </div>
      ) : (
        <>
          <section aria-labelledby="topics-heading" className={styles.section}>
            <h2 id="topics-heading">Lessons</h2>
            <ul role="list" className={styles.topics}>
              {data.topics.map((topic) => (
                <li key={topic.contentId} className={styles.topic}>
                  <div className={styles.topicText}>
                    <strong>{topic.contentTitle}</strong>
                    <span>
                      {topic.strand} · {topic.studentsStarted} started · right first time{' '}
                      {percentText(topic.firstTryCorrect, topic.questionsAnswered)}
                    </span>
                  </div>
                  <ProgressBar
                    value={topic.studentsCompleted}
                    max={topic.classSize}
                    label={`${topic.contentTitle}: students finished`}
                    valueText={`${ofCount(topic.studentsCompleted, topic.classSize)} students finished`}
                    size="small"
                  />
                  <span className={styles.topicCount}>
                    {ofCount(topic.studentsCompleted, topic.classSize)} finished
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="students-heading" className={styles.section}>
            <h2 id="students-heading">Students</h2>
            <TableToolbar
              searchLabel="Search students"
              query={query}
              onQueryChange={setQuery}
              sortLabel="Sort students by"
              sort={sort}
              sortOptions={Object.entries(SORTS).map(([value, { label }]) => ({ value, label }))}
              onSortChange={(value) => {
                setSort(value as SortKey);
              }}
              summary={
                query.trim()
                  ? `${formatCount(shown.length, 'student')} of ${data.students.length} match`
                  : undefined
              }
            />
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <caption className={styles.visuallyHidden}>Each student’s learning</caption>
                <thead>
                  <tr>
                    <th scope="col">Student</th>
                    <th scope="col">Lessons completed</th>
                    <th scope="col">Questions answered</th>
                    <th scope="col">Right first time</th>
                    <th scope="col">Tasks</th>
                    <th scope="col">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((row) => {
                    const accuracy = accuracyPercent(row.firstTryCorrect, row.questionsAnswered);
                    return (
                      <tr key={row.studentId}>
                        <th scope="row" data-label="Student">
                          <Link to={studentLink(row.studentId)}>{getFullName(row)}</Link>
                        </th>
                        <td data-label="Lessons completed">{row.lessonsCompleted}</td>
                        <td data-label="Questions answered">{row.questionsAnswered}</td>
                        <td data-label="Right first time">
                          {accuracy === null ? (
                            '—'
                          ) : (
                            <span className={styles.meter}>
                              <ProgressBar
                                value={row.firstTryCorrect}
                                max={row.questionsAnswered}
                                label={`${getFullName(row)} right first time`}
                                valueText={`${accuracy}%`}
                                size="small"
                              />
                              {accuracy}%
                            </span>
                          )}
                        </td>
                        <td data-label="Tasks">
                          {row.tasksAssigned === 0
                            ? '—'
                            : ofCount(row.tasksCompleted, row.tasksAssigned)}
                        </td>
                        <td data-label="Last active">
                          {row.lastActiveAt
                            ? formatShortDate(new Date(row.lastActiveAt))
                            : 'Not yet'}
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
          </section>
        </>
      )}

      {data.tasks.some((task) => task.state === 'published') && (
        <section aria-labelledby="report-tasks-heading" className={styles.section}>
          <h2 id="report-tasks-heading">Task completion</h2>
          <TaskTable
            tasks={data.tasks.filter((task) => task.state === 'published')}
            now={data.now}
            caption="Task completion"
            showClass={false}
          />
        </section>
      )}
    </div>
  );
}

function StudentReport({ data, classLink }: { data: ClassReportData; classLink: string }) {
  if (!data.student) return null;
  const { summary, attempts } = data.student;
  const name = getFullName(summary);
  return (
    <div className={styles.report}>
      <Link to={classLink} className={styles.back}>
        <ArrowLeft aria-hidden="true" /> All students
      </Link>
      <h2 className={styles.studentName}>
        {name} <span>{formatYearLevel(summary.yearLevel)}</span>
      </h2>
      <dl className={styles.tiles}>
        <div>
          <dt>Lessons completed</dt>
          <dd>{summary.lessonsCompleted}</dd>
        </div>
        <div>
          <dt>Questions answered</dt>
          <dd>{summary.questionsAnswered}</dd>
        </div>
        <div>
          <dt>Right first time</dt>
          <dd>{percentText(summary.firstTryCorrect, summary.questionsAnswered)}</dd>
        </div>
        <div>
          <dt>Tasks completed</dt>
          <dd>
            {summary.tasksAssigned === 0
              ? '—'
              : ofCount(summary.tasksCompleted, summary.tasksAssigned)}
          </dd>
        </div>
      </dl>
      <section aria-labelledby="attempts-heading" className={styles.section}>
        <h2 id="attempts-heading">Lesson attempts</h2>
        {attempts.length === 0 ? (
          <p className={styles.muted}>{name} has no saved work in this period.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.visuallyHidden}>{name}’s lesson attempts</caption>
              <thead>
                <tr>
                  <th scope="col">Lesson</th>
                  <th scope="col">Status</th>
                  <th scope="col">Answered</th>
                  <th scope="col">Right first time</th>
                  <th scope="col">Hints</th>
                  <th scope="col">Last worked on</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt.attemptId}>
                    <th scope="row" data-label="Lesson">
                      {attempt.contentTitle}
                    </th>
                    <td data-label="Status">
                      {attempt.completedAt ? (
                        <StatusBadge tone="success">Completed</StatusBadge>
                      ) : (
                        <StatusBadge tone="brand">In progress</StatusBadge>
                      )}
                    </td>
                    <td data-label="Answered">
                      {ofCount(attempt.questionsAnswered, attempt.questionCount)}
                    </td>
                    <td data-label="Right first time">
                      {percentText(attempt.firstTryCorrect, attempt.questionsAnswered)}
                    </td>
                    <td data-label="Hints">{attempt.hintsUsed}</td>
                    <td data-label="Last worked on">
                      {formatShortDate(new Date(attempt.lastActivityAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
