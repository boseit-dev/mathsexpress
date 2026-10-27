import type { PersonName } from './people';

/** NSW school years: Kindergarten to Year 12. */
export type YearLevel = 'K' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ClassEnrolment {
  classId: string;
  className: string;
  /** Set by the teacher when the student joins the class. Students never choose it. */
  yearLevel: YearLevel;
  teacherName: string;
}

/** The signed-in student. Until accounts exist this comes from development sample data. */
export interface CurrentStudent extends PersonName {
  id: string;
  /** The name classmates see, for example on the class leaderboard. */
  displayName: string;
  enrolment: ClassEnrolment;
  coinBalance: number;
}

export function formatYearLevel(yearLevel: YearLevel): string {
  return yearLevel === 'K' ? 'Kindergarten' : `Year ${yearLevel}`;
}
