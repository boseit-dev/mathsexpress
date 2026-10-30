import { createContext, useContext } from 'react';
import type { Look } from '@/domain/shop';

/**
 * The signed-in student's equipped look, kept current by StudentLayout as they buy and equip.
 * Null until the shop has loaded, or if it can't: pages then show initials instead.
 */
export const StudentLookContext = createContext<Look | null>(null);

export function useStudentLook(): Look | null {
  return useContext(StudentLookContext);
}
