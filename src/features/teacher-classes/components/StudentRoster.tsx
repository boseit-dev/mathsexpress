import { useEffect, useMemo, useRef, useState } from 'react';
import { UsersRound } from 'lucide-react';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { FormMessage } from '@/components/forms/FormMessage';
import { Panel } from '@/components/ui/Panel';
import { TableToolbar } from '@/components/ui/TableToolbar';
import type { ClassStudent, TeacherClass } from '@/domain/classes';
import { getFullName } from '@/domain/people';
import type { Look } from '@/domain/shop';
import { yearLevelToNumber } from '@/domain/student';
import { formatCount } from '@/lib/format';
import { REMOVE_STUDENT_FETCHER } from './removeStudentFetcher';
import { StudentRow } from './StudentRow';
import styles from './StudentRoster.module.css';

const SORTS = {
  surname: {
    label: 'Surname',
    compare: (a: ClassStudent, b: ClassStudent) =>
      a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName),
  },
  firstName: {
    label: 'First name',
    compare: (a: ClassStudent, b: ClassStudent) =>
      a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName),
  },
  yearLevel: {
    label: 'Year level',
    compare: (a: ClassStudent, b: ClassStudent) =>
      yearLevelToNumber(a.yearLevel) - yearLevelToNumber(b.yearLevel) ||
      a.lastName.localeCompare(b.lastName),
  },
  joined: {
    label: 'Recently joined',
    compare: (a: ClassStudent, b: ClassStudent) => b.joinedAt.localeCompare(a.joinedAt),
  },
} as const;

type SortKey = keyof typeof SORTS;

interface StudentRosterProps {
  teacherClass: TeacherClass;
  students: ClassStudent[];
  /** What each student wears, by student id. */
  looks?: Record<string, Look>;
}

/** The students in a class, with each one's year level and removing them. */
export function StudentRoster({ teacherClass, students, looks = {} }: StudentRosterProps) {
  const remove = useFetcherForm({ key: REMOVE_STUDENT_FETCHER });
  const removedRef = useRef<HTMLDivElement>(null);
  const removeProblemRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('surname');
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return students
      .filter((student) => !needle || getFullName(student).toLowerCase().includes(needle))
      .sort(SORTS[sort].compare);
  }, [students, query, sort]);

  // Removing a student removes their row and the button that was pressed, so move focus to
  // the result instead.
  useEffect(() => {
    if (!remove.result) return;
    (remove.result.ok ? removedRef : removeProblemRef).current?.focus();
  }, [remove.result]);

  return (
    <Panel
      title="Students"
      icon={UsersRound}
      action={<span className={styles.count}>{formatCount(students.length, 'student')}</span>}
    >
      <FormMessage ref={removedRef} tabIndex={-1} tone="success">
        {remove.successMessage}
      </FormMessage>
      <FormMessage ref={removeProblemRef} tabIndex={-1} tone="error">
        {remove.formMessage}
      </FormMessage>
      {students.length === 0 ? (
        <p className={styles.empty}>
          No students yet. Share the class code, and students will appear here as they join.
        </p>
      ) : (
        <>
          <p className={styles.help}>
            Each student starts on the class’s year level. Change it for students who need work from
            a different year. Students can’t change it themselves.
          </p>
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
                ? `${formatCount(shown.length, 'student')} of ${students.length} match`
                : undefined
            }
          />
          {shown.length === 0 ? (
            <p className={styles.empty}>No students match “{query.trim()}”.</p>
          ) : (
            <ul className={styles.rows}>
              {shown.map((student) => (
                <li key={student.studentId}>
                  <StudentRow
                    student={student}
                    className={teacherClass.name}
                    look={looks[student.studentId]}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Panel>
  );
}
