import { ArrowRight, Plus, School, UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import { Mascot } from '@/components/mascot/Mascot';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { paths } from '@/config/paths';
import { formatYearLevel } from '@/domain/student';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentTeacher } from '@/layouts/teacher/useCurrentTeacher';
import { formatLongDate, getGreeting } from '@/lib/dates';
import { formatCount } from '@/lib/format';
import { useTeacherHomeData } from './teacherHomeLoader';
import styles from './TeacherHomePage.module.css';

/** How many classes the home page lists before "All classes". */
const HOME_CLASS_LIMIT = 6;

/** The teacher's day at a glance: their classes and the next things to do. */
export function TeacherHomePage() {
  const teacher = useCurrentTeacher();
  const { classes, now } = useTeacherHomeData();
  useDocumentTitle('Home');
  const studentCount = classes.reduce((sum, item) => sum + item.studentCount, 0);
  const shown = classes.slice(0, HOME_CLASS_LIMIT);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>{formatLongDate(now)}</p>
        <h1 className={styles.greeting}>
          {getGreeting(now)}, {teacher.firstName}
        </h1>
        <p className={styles.summary}>
          {classes.length === 0
            ? 'Create your first class to start teaching with MathsExpress.'
            : `You teach ${formatCount(classes.length, 'class')} with ${formatCount(studentCount, 'student')}.`}
        </p>
      </div>

      <nav aria-label="Quick actions" className={styles.actions}>
        <Link to={`${paths.teacher.classes}#create-class`} className={styles.action}>
          <span className={styles.actionIcon}>
            <Plus aria-hidden="true" />
          </span>
          <span>
            <strong>Create a class</strong>
            <span>Get a code for students to join.</span>
          </span>
        </Link>
        {classes.length > 0 && (
          <Link to={paths.teacher.classes} className={styles.action}>
            <span className={styles.actionIcon}>
              <School aria-hidden="true" />
            </span>
            <span>
              <strong>Manage classes</strong>
              <span>Students, year levels and codes.</span>
            </span>
          </Link>
        )}
      </nav>

      <section aria-labelledby="home-classes-heading" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 id="home-classes-heading">Your classes</h2>
          {classes.length > HOME_CLASS_LIMIT && (
            <Link to={paths.teacher.classes} className={styles.more}>
              All {classes.length} classes <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
        {classes.length === 0 ? (
          <div className={styles.empty}>
            <Mascot pose="certificate" size={110} />
            <div>
              <p className={styles.emptyTitle}>No classes yet</p>
              <p>Create a class, then share its code. Students appear here as they join.</p>
              <ButtonLink to={`${paths.teacher.classes}#create-class`}>Create a class</ButtonLink>
            </div>
          </div>
        ) : (
          <ul role="list" aria-labelledby="home-classes-heading" className={styles.classList}>
            {shown.map((item) => (
              <li key={item.id}>
                <Link to={paths.teacher.classDetail(item.id)} className={styles.classRow}>
                  <span className={styles.className}>{item.name}</span>
                  <span className={styles.classMeta}>{formatYearLevel(item.yearLevel)}</span>
                  <span className={styles.classMeta}>
                    <UsersRound aria-hidden="true" /> {formatCount(item.studentCount, 'student')}
                  </span>
                  <ArrowRight aria-hidden="true" className={styles.rowArrow} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
