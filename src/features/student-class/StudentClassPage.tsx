import { useEffect, useRef } from 'react';
import { FormMessage } from '@/components/forms/FormMessage';
import { PageHeader } from '@/components/ui/PageHeader';
import { LatestFormScope } from '@/app/forms/LatestFormScope';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import { JoinClassPanel } from './components/JoinClassPanel';
import { LEAVE_CLASS_FETCHER } from './components/leaveClassFetcher';
import { NoClassesYet } from './components/NoClassesYet';
import { StudentClassCard } from './components/StudentClassCard';
import styles from './StudentClassPage.module.css';

/** The student's classes, their teachers and year levels, and joining a class with a code. */
export function StudentClassPage() {
  return (
    <LatestFormScope>
      <StudentClasses />
    </LatestFormScope>
  );
}

function StudentClasses() {
  const student = useCurrentStudent();
  useDocumentTitle('Class');
  const leave = useFetcherForm({ key: LEAVE_CLASS_FETCHER });
  const leaveMessageRef = useRef<HTMLDivElement>(null);

  // Leaving removes the card and the button that was pressed, so move focus to the result.
  useEffect(() => {
    if (leave.result) leaveMessageRef.current?.focus();
  }, [leave.result]);

  const leaveMessage = leave.successMessage ?? leave.formMessage;

  return (
    <div className={styles.page}>
      <PageHeader title="Class">
        <p>
          Your classes and teachers. To join a class, enter the code your teacher gives you. Your
          teacher sets your year level.
        </p>
      </PageHeader>

      <div className={styles.columns}>
        <section className={styles.classes} aria-labelledby="your-classes-heading">
          <h2 id="your-classes-heading" className={styles.sectionTitle}>
            Your classes
          </h2>
          {leaveMessage && (
            <FormMessage
              ref={leaveMessageRef}
              tabIndex={-1}
              tone={leave.successMessage ? 'success' : 'error'}
            >
              {leaveMessage}
            </FormMessage>
          )}
          {student.classes.length === 0 ? (
            <NoClassesYet />
          ) : (
            <ul className={styles.list}>
              {student.classes.map((membership) => (
                <li key={membership.classId}>
                  <StudentClassCard membership={membership} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <JoinClassPanel />
      </div>
    </div>
  );
}
