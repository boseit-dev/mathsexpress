import { useId } from 'react';
import { ArrowRight, DoorClosed, DoorOpen } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { paths } from '@/config/paths';
import type { TeacherClass } from '@/domain/classes';
import { formatYearLevel } from '@/domain/student';
import { YearCrest } from '@/features/classes/YearCrest';
import { formatCount } from '@/lib/format';
import { JoinCode } from './JoinCode';
import styles from './TeacherClassCard.module.css';

/** One of the teacher's classes in their list of classes. */
export function TeacherClassCard({ teacherClass }: { teacherClass: TeacherClass }) {
  const headingId = useId();

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      <div className={styles.header}>
        <YearCrest yearLevel={teacherClass.yearLevel} />
        <div className={styles.titles}>
          <h3 id={headingId} className={styles.name}>
            {teacherClass.name}
          </h3>
          <p className={styles.meta}>
            {formatYearLevel(teacherClass.yearLevel)} ·{' '}
            {formatCount(teacherClass.studentCount, 'student')}
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.joining}>
          <span className={styles.codeLabel}>Class code</span>
          <JoinCode code={teacherClass.joinCode} />
          {teacherClass.joiningEnabled ? (
            <StatusBadge tone="success" icon={DoorOpen}>
              Joining open
            </StatusBadge>
          ) : (
            <StatusBadge tone="warning" icon={DoorClosed}>
              Joining off
            </StatusBadge>
          )}
        </div>
        <ButtonLink to={paths.teacher.classDetail(teacherClass.id)} variant="secondary">
          Open class <VisuallyHidden>{teacherClass.name}</VisuallyHidden>
          <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </div>
    </article>
  );
}
