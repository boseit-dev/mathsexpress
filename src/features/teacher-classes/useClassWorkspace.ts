import { useOutletContext } from 'react-router';
import type { TeacherClassData } from './teacherClassesHandlers';

/** The class and its students, for the pages inside the class workspace. */
export function useClassWorkspace(): TeacherClassData {
  return useOutletContext<TeacherClassData>();
}
