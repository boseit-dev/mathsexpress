import { Outlet } from 'react-router';
import { teacherNavigation } from '@/config/navigation';
import { paths } from '@/config/paths';
import { getFullName } from '@/domain/people';
import { AccountMenu } from '../AccountMenu';
import { AppShell } from '../AppShell';
import { useTeacherLayoutData } from './teacherLayoutLoader';

/** Frame for every teacher page: top navigation Home | Classes | Tasks | Reports | More. */
export function TeacherLayout() {
  const teacher = useTeacherLayoutData();

  return (
    <AppShell
      homePath={paths.teacher.home}
      navigation={teacherNavigation}
      navigationLabel="Teacher"
      account={<AccountMenu name={getFullName(teacher)} roleLabel="Teacher" />}
    >
      <Outlet context={teacher} />
    </AppShell>
  );
}
