import { DoorClosed, DoorOpen, GraduationCap, UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import { paths } from '@/config/paths';
import { formatYearLevel } from '@/domain/student';
import { formatCount } from '@/lib/format';
import { ClassSettingsPanel } from './components/ClassSettingsPanel';
import { JoinCodePanel } from './components/JoinCodePanel';
import { useClassWorkspace } from './useClassWorkspace';
import styles from './ClassOverviewPage.module.css';

/** The class at a glance, with joining and settings. */
export function ClassOverviewPage() {
  const { teacherClass, students } = useClassWorkspace();
  const levels = new Set(students.map((student) => student.yearLevel));

  return (
    <div className={styles.columns}>
      <div className={styles.main}>
        <section aria-labelledby="class-summary-heading" className={styles.summary}>
          <h2 id="class-summary-heading" className={styles.sectionTitle}>
            Class summary
          </h2>
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>
                <UsersRound aria-hidden="true" /> Students
              </dt>
              <dd>
                <Link to={paths.teacher.classStudents(teacherClass.id)}>
                  {formatCount(students.length, 'student')}
                </Link>
              </dd>
            </div>
            <div className={styles.fact}>
              <dt>
                <GraduationCap aria-hidden="true" /> Year levels
              </dt>
              <dd>
                {levels.size <= 1
                  ? formatYearLevel(teacherClass.yearLevel)
                  : `${levels.size} different levels`}
              </dd>
            </div>
            <div className={styles.fact}>
              <dt>
                {teacherClass.joiningEnabled ? (
                  <DoorOpen aria-hidden="true" />
                ) : (
                  <DoorClosed aria-hidden="true" />
                )}{' '}
                Joining
              </dt>
              <dd>{teacherClass.joiningEnabled ? 'Open with the class code' : 'Turned off'}</dd>
            </div>
          </dl>
          {students.length === 0 && (
            <p className={styles.hint}>
              No students yet. Share the class code below, and students appear as they join.
            </p>
          )}
        </section>
      </div>
      <div className={styles.sidebar}>
        <JoinCodePanel teacherClass={teacherClass} />
        <ClassSettingsPanel teacherClass={teacherClass} />
      </div>
    </div>
  );
}
