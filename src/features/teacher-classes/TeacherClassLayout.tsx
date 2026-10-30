import { ArrowLeft, ChartColumn, ClipboardList, LayoutDashboard, UsersRound } from 'lucide-react';
import { Link, Outlet } from 'react-router';
import { LatestFormScope } from '@/app/forms/LatestFormScope';
import { PageHeader } from '@/components/ui/PageHeader';
import { TabNav, type TabItem } from '@/components/ui/TabNav';
import { paths } from '@/config/paths';
import { formatYearLevel } from '@/domain/student';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatCount } from '@/lib/format';
import { useTeacherClassData } from './teacherClassesHandlers';
import styles from './TeacherClassLayout.module.css';

/** A class's workspace: its name, and tabs for each area of work with the class. */
export function TeacherClassLayout() {
  const data = useTeacherClassData();
  const { teacherClass, students } = data;
  useDocumentTitle(teacherClass.name);

  const tabs: TabItem[] = [
    {
      label: 'Overview',
      to: paths.teacher.classDetail(teacherClass.id),
      icon: LayoutDashboard,
      end: true,
    },
    { label: 'Students', to: paths.teacher.classStudents(teacherClass.id), icon: UsersRound },
    { label: 'Tasks', to: paths.teacher.classTasks(teacherClass.id), icon: ClipboardList },
    { label: 'Progress', to: paths.teacher.classProgress(teacherClass.id), icon: ChartColumn },
  ];

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
        <TabNav label={`${teacherClass.name} sections`} items={tabs} />
        <Outlet context={data} />
      </div>
    </LatestFormScope>
  );
}
