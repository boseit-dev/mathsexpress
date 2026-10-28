import type { PersonName } from './people';

/** The signed-in teacher. */
export interface CurrentTeacher extends PersonName {
  id: string;
}
