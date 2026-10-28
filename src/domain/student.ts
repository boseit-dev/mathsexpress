import type { StudentClassMembership } from './classes';
import type { PersonName } from './people';

/** NSW school years: Kindergarten to Year 12. */
export type YearLevel = 'K' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const YEAR_LEVELS: readonly YearLevel[] = ['K', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** The signed-in student, with the classes they belong to. */
export interface CurrentStudent extends PersonName {
  id: string;
  /** The name classmates see, for example on the class leaderboard ("Mia C."). */
  displayName: string;
  classes: StudentClassMembership[];
}

export function formatYearLevel(yearLevel: YearLevel): string {
  return yearLevel === 'K' ? 'Kindergarten' : `Year ${yearLevel}`;
}

/** The database stores Kindergarten as 0 and Years 1 to 12 as 1 to 12. */
export function yearLevelToNumber(yearLevel: YearLevel): number {
  return yearLevel === 'K' ? 0 : yearLevel;
}

export function yearLevelFromNumber(value: number): YearLevel {
  const yearLevel = YEAR_LEVELS[value];
  if (yearLevel === undefined || !Number.isInteger(value)) {
    throw new RangeError(`${value} is not a year level`);
  }
  return yearLevel;
}

/** The class shown first, e.g. on the home page: the one the student joined first. */
export function getPrimaryClass(student: CurrentStudent): StudentClassMembership | null {
  return student.classes[0] ?? null;
}
