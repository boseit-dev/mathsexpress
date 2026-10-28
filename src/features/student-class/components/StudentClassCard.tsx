import { useId } from 'react';
import { CalendarDays, LockKeyhole, UserRound } from 'lucide-react';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { ConfirmAction } from '@/components/ui/ConfirmAction';
import type { StudentClassMembership } from '@/domain/classes';
import { formatYearLevel } from '@/domain/student';
import { formatLongDate } from '@/lib/dates';
import { YearCrest } from '@/features/classes/YearCrest';
import { LEAVE_CLASS_FETCHER } from './leaveClassFetcher';
import styles from './StudentClassCard.module.css';

interface StudentClassCardProps {
  membership: StudentClassMembership;
}

/** One of the student's classes: its teacher, the student's year level, and leaving it. */
export function StudentClassCard({ membership }: StudentClassCardProps) {
  const headingId = useId();
  const leave = useFetcherForm({ key: LEAVE_CLASS_FETCHER });
  const isLeaving =
    leave.isSubmitting && leave.fetcher.formData?.get('classId') === membership.classId;
  const ownLevelDiffers = membership.yearLevel !== membership.classYearLevel;

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      <div className={styles.header}>
        <YearCrest yearLevel={membership.yearLevel} />
        <div className={styles.titles}>
          <h3 id={headingId} className={styles.name}>
            {membership.className}
          </h3>
          <p className={styles.teacher}>
            <UserRound aria-hidden="true" />
            {membership.teacherName}
          </p>
        </div>
      </div>

      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt>Your year level</dt>
          <dd>
            <strong>{formatYearLevel(membership.yearLevel)}</strong>
            <span className={styles.locked}>
              <LockKeyhole aria-hidden="true" />
              Set by your teacher
            </span>
          </dd>
        </div>
        {ownLevelDiffers && (
          <div className={styles.detail}>
            <dt>Class year level</dt>
            <dd>{formatYearLevel(membership.classYearLevel)}</dd>
          </div>
        )}
        <div className={styles.detail}>
          <dt>Joined</dt>
          <dd>
            <CalendarDays aria-hidden="true" className={styles.inlineIcon} />
            {formatLongDate(new Date(membership.joinedAt))}
          </dd>
        </div>
      </dl>

      <div className={styles.footer}>
        {membership.studentsCanLeave ? (
          <leave.fetcher.Form method="post" onSubmit={leave.onSubmit}>
            <input type="hidden" name="classId" value={membership.classId} />
            <input type="hidden" name="className" value={membership.className} />
            <ConfirmAction
              triggerLabel="Leave class"
              triggerContext={membership.className}
              message={`Leave ${membership.className}? To come back, you’ll need the class code from your teacher.`}
              confirmLabel="Yes, leave class"
              intent="leave"
              pending={isLeaving}
              pendingLabel="Leaving…"
            />
          </leave.fetcher.Form>
        ) : (
          <p className={styles.note}>Your teacher manages who is in this class.</p>
        )}
      </div>
    </article>
  );
}
