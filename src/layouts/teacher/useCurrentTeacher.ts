import { useOutletContext } from 'react-router';
import type { CurrentTeacher } from '@/domain/teacher';

/** The signed-in teacher, for pages directly inside the teacher layout. */
export function useCurrentTeacher(): CurrentTeacher {
  return useOutletContext<CurrentTeacher>();
}
