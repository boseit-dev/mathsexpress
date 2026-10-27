import { Outlet } from 'react-router';
import { Avatar } from '@/components/ui/Avatar';
import { teacherNavigation } from '@/config/navigation';
import { paths } from '@/config/paths';
import { getFullName } from '@/domain/people';
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
      account={<Avatar name={getFullName(teacher)} />}
      previewSwitchLink={{ label: 'View the student layout', to: paths.student.home }}
    >
      <Outlet context={teacher} />
    </AppShell>
  );
}
