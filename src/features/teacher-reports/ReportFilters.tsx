import { Form, useSubmit } from 'react-router';
import { getFullName } from '@/domain/people';
import { REPORT_PERIODS, type ReportPeriod, type StudentProgressSummary } from '@/domain/reports';
import styles from './ReportFilters.module.css';

interface ReportFiltersProps {
  classes?: readonly { id: string; name: string }[];
  classId?: string;
  period: ReportPeriod;
  students: readonly StudentProgressSummary[];
  studentId: string | null;
}

/** Report filters kept in the address, applied as soon as one changes. */
export function ReportFilters({
  classes,
  classId,
  period,
  students,
  studentId,
}: ReportFiltersProps) {
  const submit = useSubmit();
  return (
    <Form
      method="get"
      className={styles.filters}
      aria-label="Report filters"
      onChange={(event) => {
        void submit(event.currentTarget, { replace: true });
      }}
    >
      {classes && (
        <label className={styles.filter}>
          <span>Class</span>
          <select name="class" defaultValue={classId}>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className={styles.filter}>
        <span>Period</span>
        <select name="period" defaultValue={period}>
          {Object.entries(REPORT_PERIODS).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.filter}>
        <span>Student</span>
        <select name="student" defaultValue={studentId ?? ''} key={classId}>
          <option value="">All students</option>
          {students.map((student) => (
            <option key={student.studentId} value={student.studentId}>
              {getFullName(student)}
            </option>
          ))}
        </select>
      </label>
      <noscript>
        <button type="submit">Show report</button>
      </noscript>
    </Form>
  );
}
