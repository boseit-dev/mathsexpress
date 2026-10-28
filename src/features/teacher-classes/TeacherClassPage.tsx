import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { LatestFormScope } from '@/app/forms/LatestFormScope';
import { PageHeader } from '@/components/ui/PageHeader';
import { paths } from '@/config/paths';
import { formatYearLevel } from '@/domain/student';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatCount } from '@/lib/format';
import { ClassSettingsPanel } from './components/ClassSettingsPanel';
import { JoinCodePanel } from './components/JoinCodePanel';
import { StudentRoster } from './components/StudentRoster';
import { useTeacherClassData } from './teacherClassesHandlers';
import styles from './TeacherClassPage.module.css';

/** One class: its students and their year levels, its join code, and its settings. */
export function TeacherClassPage() {
  const { teacherClass, students } = useTeacherClassData();
  useDocumentTitle(teacherClass.name);

  return (
    <LatestFormScope>
      <div className={styles.page}>
        <PageHeader
          title={teacherClass.name}
          before={
            <Link to={paths.teacher.classes} className={styles.back}>
              <ArrowLeft aria-hidden="true" />
              All classes
            </Link>
          }
        >
          <p>
            {formatYearLevel(teacherClass.yearLevel)} · {formatCount(students.length, 'student')}
          </p>
        </PageHeader>

        <div className={styles.columns}>
          <StudentRoster teacherClass={teacherClass} students={students} />
          <div className={styles.sidebar}>
            <JoinCodePanel teacherClass={teacherClass} />
            <ClassSettingsPanel teacherClass={teacherClass} />
          </div>
        </div>
      </div>
    </LatestFormScope>
  );
}
