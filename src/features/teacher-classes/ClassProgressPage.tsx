import { paths } from '@/config/paths';
import { ClassReport } from '@/features/teacher-reports/ClassReport';
import { ReportFilters } from '@/features/teacher-reports/ReportFilters';
import { useClassProgressData } from '@/features/teacher-reports/reportHandlers';
import styles from './ClassProgressPage.module.css';

/** The class's saved learning, inside its workspace. */
export function ClassProgressPage() {
  const data = useClassProgressData();
  const link = (student: string | null) => {
    const params = new URLSearchParams({ period: data.period });
    if (student) params.set('student', student);
    return `${paths.teacher.classProgress(data.classId)}?${params.toString()}`;
  };
  return (
    <div className={styles.page}>
      <ReportFilters
        period={data.period}
        students={data.students}
        studentId={data.student?.summary.studentId ?? null}
      />
      <ClassReport data={data} studentLink={(id) => link(id)} classLink={link(null)} />
    </div>
  );
}
