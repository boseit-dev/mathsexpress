import { Outlet } from 'react-router';
import { studentNavigation } from '@/config/navigation';
import { paths } from '@/config/paths';
import { AppShell } from '../AppShell';
import { StudentAccount } from './StudentAccount';
import { StudentBackdrop } from './StudentBackdrop';
import { useStudentLayoutData } from './studentLayoutLoader';

/** Frame for every student page: top navigation Home | Learn | Textbook | Class | More. */
export function StudentLayout() {
  const student = useStudentLayoutData();

  return (
    <AppShell
      homePath={paths.student.home}
      navigation={studentNavigation}
      navigationLabel="Student"
      account={<StudentAccount student={student} />}
      previewSwitchLink={{ label: 'View the teacher layout', to: paths.teacher.home }}
      backdrop={<StudentBackdrop />}
    >
      <Outlet context={student} />
    </AppShell>
  );
}
