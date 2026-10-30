import { ArrowRight, ChartColumn, ClipboardList, Plus, School, UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import { Mascot } from '@/components/mascot/Mascot';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { paths } from '@/config/paths';
import { getFullName } from '@/domain/people';
import { formatYearLevel } from '@/domain/student';
import { describeTaskDue, isTaskOverdue, outstandingCount } from '@/domain/tasks';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentTeacher } from '@/layouts/teacher/useCurrentTeacher';
import { formatLongDate, formatShortDate, getGreeting } from '@/lib/dates';
import { formatCount } from '@/lib/format';
import { accuracyPercent, ofCount } from '@/features/tasks/taskDisplay';
import { useTeacherHomeData } from './teacherHomeLoader';
import styles from './TeacherHomePage.module.css';

/** How many classes the home page lists before "All classes". */
const HOME_CLASS_LIMIT = 6;

/** The teacher's day at a glance: their classes and the next things to do. */
export function TeacherHomePage() {
  const teacher = useCurrentTeacher();
  const { classes, tasks, activity, now } = useTeacherHomeData();
  useDocumentTitle('Home');
  const studentCount = classes.reduce((sum, item) => sum + item.studentCount, 0);
  const shown = classes.slice(0, HOME_CLASS_LIMIT);
  const published = tasks.filter((task) => task.state === 'published');
  const upcoming = published
    .filter((task) => !isTaskOverdue(task, now))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .slice(0, 4);
  // Past due with students still to finish, then drafts waiting to be published.
  const followUp = [
    ...published
      .filter((task) => isTaskOverdue(task, now) && outstandingCount(task) > 0)
      .sort((a, b) => b.dueAt.localeCompare(a.dueAt))
      .map((task) => ({
        task,
        text: `${formatCount(outstandingCount(task), 'student')} still to finish · ${describeTaskDue(task, now).label.toLowerCase()}`,
      })),
    ...tasks
      .filter((task) => task.state === 'draft')
      .map((task) => ({ task, text: 'Draft · not published yet' })),
  ].slice(0, 5);

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
          <Link to={paths.teacher.newTask()} className={styles.action}>
            <span className={styles.actionIcon}>
              <ClipboardList aria-hidden="true" />
            </span>
            <span>
              <strong>Create a task</strong>
              <span>Set a lesson with a due date.</span>
            </span>
          </Link>
        )}
        {classes.length > 0 && (
          <Link to={paths.teacher.reports} className={styles.action}>
            <span className={styles.actionIcon}>
              <ChartColumn aria-hidden="true" />
            </span>
            <span>
              <strong>View progress</strong>
              <span>Class and student reports.</span>
            </span>
          </Link>
        )}
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

      {tasks.length > 0 && (
        <div className={styles.taskColumns}>
          <section aria-labelledby="home-upcoming-heading" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 id="home-upcoming-heading">Coming up</h2>
              <Link to={paths.teacher.tasks} className={styles.more}>
                All tasks <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className={styles.quiet}>No published tasks are due soon.</p>
            ) : (
              <ul role="list" aria-labelledby="home-upcoming-heading" className={styles.classList}>
                {upcoming.map((task) => (
                  <li key={task.id}>
                    <Link to={paths.teacher.taskDetail(task.id)} className={styles.taskRow}>
                      <span className={styles.className}>{task.title}</span>
                      <span className={styles.classMeta}>
                        {task.className} · {describeTaskDue(task, now).label}
                      </span>
                      <span className={styles.classMeta}>
                        {ofCount(task.completedCount, task.assignedCount)} done
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section aria-labelledby="home-follow-up-heading" className={styles.section}>
            <h2 id="home-follow-up-heading">To follow up</h2>
            {followUp.length === 0 ? (
              <p className={styles.quiet}>
                Nothing to follow up. Lessons are marked automatically as students finish them.
              </p>
            ) : (
              <ul role="list" aria-labelledby="home-follow-up-heading" className={styles.classList}>
                {followUp.map(({ task, text }) => (
                  <li key={task.id}>
                    <Link to={paths.teacher.taskDetail(task.id)} className={styles.taskRow}>
                      <span className={styles.className}>{task.title}</span>
                      <span className={styles.classMeta}>
                        {task.className} · {text}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {activity.length > 0 && (
        <section aria-labelledby="home-activity-heading" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 id="home-activity-heading">Recent activity</h2>
            <Link to={paths.teacher.reports} className={styles.more}>
              Reports <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ul role="list" aria-labelledby="home-activity-heading" className={styles.classList}>
            {activity.map((item) => (
              <li key={`${item.studentId}-${item.completedAt}`} className={styles.taskRow}>
                <span>
                  <strong>{getFullName(item)}</strong> finished {item.contentTitle}
                </span>
                <span className={styles.classMeta}>
                  {item.className} · {formatShortDate(new Date(item.completedAt))} · right first
                  time {accuracyPercent(item.firstTryCorrect, item.questionCount)}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

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
