import { useEffect, useRef } from 'react';
import { UsersRound } from 'lucide-react';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { FormMessage } from '@/components/forms/FormMessage';
import { Panel } from '@/components/ui/Panel';
import type { ClassStudent, TeacherClass } from '@/domain/classes';
import { formatCount } from '@/lib/format';
import { REMOVE_STUDENT_FETCHER } from './removeStudentFetcher';
import { StudentRow } from './StudentRow';
import styles from './StudentRoster.module.css';

interface StudentRosterProps {
  teacherClass: TeacherClass;
  students: ClassStudent[];
}

/** The students in a class, with each one's year level and removing them. */
export function StudentRoster({ teacherClass, students }: StudentRosterProps) {
  const remove = useFetcherForm({ key: REMOVE_STUDENT_FETCHER });
  const removedRef = useRef<HTMLDivElement>(null);
  const removeProblemRef = useRef<HTMLDivElement>(null);

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
          <ul className={styles.rows}>
            {students.map((student) => (
              <li key={student.studentId}>
                <StudentRow student={student} className={teacherClass.name} />
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}
