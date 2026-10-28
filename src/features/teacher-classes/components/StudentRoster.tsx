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
  const messageRef = useRef<HTMLDivElement>(null);

  // Removing a student removes their row and the button that was pressed, so move focus to
  // the result instead.
  useEffect(() => {
    if (remove.result) messageRef.current?.focus();
  }, [remove.result]);

  const removeMessage = remove.successMessage ?? remove.formMessage;

  return (
    <Panel
      title="Students"
      icon={UsersRound}
      action={<span className={styles.count}>{formatCount(students.length, 'student')}</span>}
    >
      {removeMessage && (
        <FormMessage
          ref={messageRef}
          tabIndex={-1}
          tone={remove.successMessage ? 'success' : 'error'}
        >
          {removeMessage}
        </FormMessage>
      )}
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
