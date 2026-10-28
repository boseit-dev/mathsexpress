import { useEffect, useRef } from 'react';
import { FormMessage } from '@/components/forms/FormMessage';
import { PageHeader } from '@/components/ui/PageHeader';
import { LatestFormScope } from '@/app/forms/LatestFormScope';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
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
  const { classes } = useCurrentStudent();
  useDocumentTitle('Class');
  // Picks up a teacher's changes when the student comes back to the tab.
  useRefreshWhenVisible();
  const leave = useFetcherForm({ key: LEAVE_CLASS_FETCHER });
  const leftRef = useRef<HTMLDivElement>(null);
  const leaveProblemRef = useRef<HTMLDivElement>(null);

  // Leaving removes the card and the button that was pressed, so move focus to the result.
  useEffect(() => {
    if (!leave.result) return;
    (leave.result.ok ? leftRef : leaveProblemRef).current?.focus();
  }, [leave.result]);

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
          <FormMessage ref={leftRef} tabIndex={-1} tone="success">
            {leave.successMessage}
          </FormMessage>
          <FormMessage ref={leaveProblemRef} tabIndex={-1} tone="error">
            {leave.formMessage}
          </FormMessage>
          {classes.length === 0 ? (
            <NoClassesYet />
          ) : (
            <ul className={styles.list}>
              {classes.map((membership) => (
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
