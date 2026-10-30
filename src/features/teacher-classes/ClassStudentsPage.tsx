import { StudentRoster } from './components/StudentRoster';
import { useClassWorkspace } from './useClassWorkspace';

/** Everyone in the class, with year levels and removal. */
export function ClassStudentsPage() {
  const { teacherClass, students, looks } = useClassWorkspace();
  return <StudentRoster teacherClass={teacherClass} students={students} looks={looks} />;
}
