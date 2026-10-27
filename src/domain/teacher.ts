import type { PersonName } from './people';

/** The signed-in teacher. Until accounts exist this comes from development sample data. */
export interface CurrentTeacher extends PersonName {
  id: string;
  /** How students see the teacher's name, e.g. "Ms Patel". */
  displayName: string;
}
