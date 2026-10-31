import { ArrowUpRight, ChartColumn, ClipboardList, School, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { paths } from '@/config/paths';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentTeacher } from '@/layouts/teacher/useCurrentTeacher';
import styles from './MorePages.module.css';

const teacherLinks = [
  {
    to: paths.teacher.classes,
    icon: School,
    title: 'Manage classes',
    detail: 'See students, class codes and year levels.',
  },
  {
    to: paths.teacher.newTask(),
    icon: Sparkles,
    title: 'Create an assignment',
    detail: 'Prepare guided practice for your students.',
  },
  {
    to: paths.teacher.tasks,
    icon: ClipboardList,
    title: 'Assignments',
    detail: 'Review drafts, deadlines and results.',
  },
  {
    to: paths.teacher.reports,
    icon: ChartColumn,
    title: 'Class reports',
    detail: 'Explore progress and areas for improvement.',
  },
] as const;

export function TeacherMorePage() {
  const teacher = useCurrentTeacher();
  useDocumentTitle('More');
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>TEACHER WORKSPACE</p>
        <h1>More</h1>
        <p>
          Useful shortcuts for planning lessons and supporting your classes, {teacher.firstName}.
        </p>
      </header>
      <section className={styles.tools} aria-labelledby="teacher-tools-heading">
        <div className={styles.heading}>
          <h2 id="teacher-tools-heading">Teaching tools</h2>
          <p>Work with your existing classes, assignments and reports.</p>
        </div>
        <nav className={styles.linkGrid} aria-label="Teacher tools">
          {teacherLinks.map(({ to, icon: Icon, title, detail }) => (
            <Link key={to} to={to} className={styles.toolLink}>
              <span className={styles.iconBubble}>
                <Icon aria-hidden="true" />
              </span>
              <span className={styles.toolCopy}>
                <strong>{title}</strong>
                <span>{detail}</span>
              </span>
              <ArrowUpRight className={styles.arrow} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>
      <section className={styles.help}>
        <h2>Getting started</h2>
        <p>
          Create a class, share its joining code, then assign a lesson. You can check student
          progress from Reports.
        </p>
        <p>
          Profile editing and school-wide settings are still in development. We do not show controls
          that cannot save your changes.
        </p>
      </section>
    </div>
  );
}
