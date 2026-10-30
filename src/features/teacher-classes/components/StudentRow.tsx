import { useRef } from 'react';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { SelectField } from '@/components/forms/SelectField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { StudentAvatar } from '@/components/cosmetics/StudentAvatar';
import { ConfirmAction } from '@/components/ui/ConfirmAction';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import type { ClassStudent } from '@/domain/classes';
import { getFullName } from '@/domain/people';
import type { Look } from '@/domain/shop';
import { yearLevelToNumber } from '@/domain/student';
import { yearLevelOptions } from '@/features/classes/yearLevelOptions';
import { formatLongDate } from '@/lib/dates';
import { cx } from '@/lib/cx';
import { REMOVE_STUDENT_FETCHER } from './removeStudentFetcher';
import styles from './StudentRow.module.css';

interface StudentRowProps {
  student: ClassStudent;
  className: string;
  /** The student's equipped look, if it loaded; otherwise their initials are shown. */
  look?: Look;
}

/** One student in a class: their year level, which the teacher can change, and removing them. */
export function StudentRow({ student, className, look }: StudentRowProps) {
  const name = getFullName(student);
  const formRef = useRef<HTMLFormElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const yearLevel = useFetcherForm({ formRef, focusAfterSuccess: saveRef });
  const remove = useFetcherForm({ key: REMOVE_STUDENT_FETCHER });
  const isRemoving =
    remove.isSubmitting && remove.fetcher.formData?.get('studentId') === student.studentId;
  const yearMessage =
    yearLevel.successMessage ?? yearLevel.formMessage ?? yearLevel.fieldError('yearLevel');

  return (
    <div className={styles.row}>
      <div className={styles.person}>
        <StudentAvatar name={name} look={look} decorative />
        <div className={styles.names}>
          <p className={styles.name}>{name}</p>
          <p className={styles.joined}>Joined {formatLongDate(new Date(student.joinedAt))}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <yearLevel.fetcher.Form
          // Rebuild the form when the saved year level changes, e.g. after a class-wide change.
          key={student.yearLevel}
          method="post"
          onSubmit={yearLevel.onSubmit}
          ref={formRef}
          className={styles.yearForm}
        >
          <input type="hidden" name="studentId" value={student.studentId} />
          <SelectField
            label={`${name}’s year level`}
            hideLabel
            name="yearLevel"
            options={yearLevelOptions}
            defaultValue={String(yearLevelToNumber(student.yearLevel))}
            className={styles.select}
          />
          <SubmitButton
            ref={saveRef}
            variant="secondary"
            name="intent"
            value="set-year-level"
            pending={yearLevel.isSubmitting}
            pendingLabel="Saving…"
          >
            Save <VisuallyHidden>{name}’s year level</VisuallyHidden>
          </SubmitButton>
        </yearLevel.fetcher.Form>

        <remove.fetcher.Form method="post" onSubmit={remove.onSubmit}>
          <input type="hidden" name="studentId" value={student.studentId} />
          <input type="hidden" name="studentName" value={name} />
          <ConfirmAction
            triggerLabel="Remove"
            triggerContext={name}
            message={`Remove ${name} from ${className}? They can join again with the class code while joining is on.`}
            confirmLabel="Remove student"
            intent="remove-student"
            pending={isRemoving}
            pendingLabel="Removing…"
            // One removal at a time: they share a fetcher, and a second would cancel the first.
            disabled={remove.isSubmitting && !isRemoving}
          />
        </remove.fetcher.Form>
      </div>

      <p
        role="status"
        className={cx(styles.result, yearLevel.successMessage ? styles.saved : styles.problem)}
      >
        {yearMessage}
      </p>
    </div>
  );
}
