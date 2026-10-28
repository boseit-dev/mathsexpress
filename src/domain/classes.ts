import type { YearLevel } from './student';

/** A class a student belongs to, as the student sees it (no join code, no classmates). */
export interface StudentClassMembership {
  classId: string;
  className: string;
  classYearLevel: YearLevel;
  /** The student's own year level in this class. Only the teacher can change it. */
  yearLevel: YearLevel;
  teacherName: string;
  studentsCanLeave: boolean;
  joinedAt: string;
}

/** A class as its teacher sees it. */
export interface TeacherClass {
  id: string;
  name: string;
  yearLevel: YearLevel;
  joinCode: string;
  joiningEnabled: boolean;
  studentsCanLeave: boolean;
  studentCount: number;
  createdAt: string;
}

export interface ClassSettings {
  name: string;
  yearLevel: YearLevel;
  joiningEnabled: boolean;
  studentsCanLeave: boolean;
}

/** A student in a teacher's class: names and year level only, never contact details. */
export interface ClassStudent {
  studentId: string;
  firstName: string;
  lastName: string;
  yearLevel: YearLevel;
  joinedAt: string;
}

export const JOIN_CODE_LENGTH = 8;

// Letters and digits that cannot be mistaken for each other (no I, L, O, 0 or 1).
const JOIN_CODE_PATTERN = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/;

/** What a student typed, tidied: upper case, without spaces or hyphens. */
export function normalizeJoinCode(input: string): string {
  return input.replace(/[\s-]/g, '').toUpperCase();
}

export function isValidJoinCode(code: string): boolean {
  return JOIN_CODE_PATTERN.test(normalizeJoinCode(code));
}

/** Shows a code in two groups so it is easy to read aloud: "ABCD-EFGH". */
export function formatJoinCode(code: string): string {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}
