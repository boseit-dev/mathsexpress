import { useOutletContext } from 'react-router';
import type { CurrentStudent } from '@/domain/student';

/** The signed-in student, provided by StudentLayout to every student page. */
export function useCurrentStudent(): CurrentStudent {
  return useOutletContext<CurrentStudent>();
}
