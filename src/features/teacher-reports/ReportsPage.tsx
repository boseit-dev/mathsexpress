import { ChartColumn } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { IconTile } from '@/components/ui/IconTile';
import { PageHeader } from '@/components/ui/PageHeader';
import { paths } from '@/config/paths';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ClassReport } from './ClassReport';
import { ReportFilters } from './ReportFilters';
import { useReportsData } from './reportHandlers';
import styles from './ReportsPage.module.css';

/** Class-wide and individual reports from saved, server-marked lesson work. */
export function ReportsPage() {
  const { classes, report } = useReportsData();
  useDocumentTitle('Reports');
  const link = (student: string | null) => {
    const params = new URLSearchParams();
    if (report) {
      params.set('class', report.classId);
      params.set('period', report.period);
    }
    if (student) params.set('student', student);
    return `${paths.teacher.reports}?${params.toString()}`;
  };

  return (
    <div className={styles.page}>
      <PageHeader title="Reports">
        <p>
          Progress from lessons your students have actually completed. Every result was marked by
          MathsExpress, and nothing is estimated.
        </p>
      </PageHeader>
      {!report ? (
        <div className={styles.empty}>
          <IconTile icon={ChartColumn} size="large" />
          <div>
            <p className={styles.emptyTitle}>No classes to report on</p>
            <p>Create a class and set some work. Reports fill in as students answer questions.</p>
            <ButtonLink to={`${paths.teacher.classes}#create-class`} variant="secondary">
              Create a class
            </ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <ReportFilters
            classes={classes}
            classId={report.classId}
            period={report.period}
            students={report.students}
            studentId={report.student?.summary.studentId ?? null}
          />
          <ClassReport data={report} studentLink={(id) => link(id)} classLink={link(null)} />
        </>
      )}
    </div>
  );
}
