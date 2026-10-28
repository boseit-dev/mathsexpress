import { Outlet, useLocation } from 'react-router';
import { studentNavigation } from '@/config/navigation';
import { paths } from '@/config/paths';
import { getFullName } from '@/domain/people';
import { SidePanelToolbar } from '@/features/side-panels/SidePanelToolbar';
import { AccountMenu } from '../AccountMenu';
import { AppShell } from '../AppShell';
import { useStudentLayoutData } from './studentLayoutLoader';

/** Frame for every student page: top navigation Home | Learn | Textbook | Class | More. */
export function StudentLayout() {
  const student = useStudentLayoutData();
  const { pathname } = useLocation();

  return (
    <AppShell
      homePath={paths.student.home}
      navigation={studentNavigation}
      navigationLabel="Student"
      account={<AccountMenu name={getFullName(student)} roleLabel="Student" />}
    >
      <Outlet context={student} />
      <SidePanelToolbar key={pathname} student={student} />
    </AppShell>
  );
}
