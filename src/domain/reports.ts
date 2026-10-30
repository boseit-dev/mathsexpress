import type { YearLevel } from './student';

/** One student's learning in a class over a period, from saved, server-marked work only. */
export interface StudentProgressSummary {
  studentId: string;
  firstName: string;
  lastName: string;
  yearLevel: YearLevel;
  lessonsCompleted: number;
  questionsAnswered: number;
  firstTryCorrect: number;
  hintsUsed: number;
  tasksAssigned: number;
  tasksCompleted: number;
  /** Null when the student has not worked in the period. */
  lastActiveAt: string | null;
}

/** One go at a lesson. */
export interface StudentAttemptResult {
  attemptId: string;
  contentId: string;
  contentTitle: string;
  strand: string;
  topic: string;
  startedAt: string;
  lastActivityAt: string;
  completedAt: string | null;
  questionCount: number;
  questionsAnswered: number;
  firstTryCorrect: number;
  hintsUsed: number;
}

/** How far a class has got with one lesson. */
export interface TopicProgress {
  contentId: string;
  contentTitle: string;
  strand: string;
  topic: string;
  classSize: number;
  studentsStarted: number;
  studentsCompleted: number;
  questionsAnswered: number;
  firstTryCorrect: number;
}

/** A lesson a student finished, for the teacher's recent activity. */
export interface RecentCompletion {
  studentId: string;
  firstName: string;
  lastName: string;
  classId: string;
  className: string;
  contentTitle: string;
  completedAt: string;
  questionCount: number;
  firstTryCorrect: number;
}

export const REPORT_PERIODS = {
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '90d': { label: 'Last 90 days', days: 90 },
  all: { label: 'All time', days: null },
} as const;

export type ReportPeriod = keyof typeof REPORT_PERIODS;

export function isReportPeriod(value: string | null): value is ReportPeriod {
  return value !== null && Object.hasOwn(REPORT_PERIODS, value);
}

/** The start of a period, or null for all time. */
export function periodStart(period: ReportPeriod, now: Date): Date | null {
  const { days } = REPORT_PERIODS[period];
  return days === null ? null : new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

/** Class-wide totals over the students' summaries. */
export function summariseClass(rows: readonly StudentProgressSummary[]) {
  const active = rows.filter((row) => row.questionsAnswered > 0).length;
  const answered = rows.reduce((sum, row) => sum + row.questionsAnswered, 0);
  const firstTry = rows.reduce((sum, row) => sum + row.firstTryCorrect, 0);
  const lessons = rows.reduce((sum, row) => sum + row.lessonsCompleted, 0);
  const assigned = rows.reduce((sum, row) => sum + row.tasksAssigned, 0);
  const completed = rows.reduce((sum, row) => sum + row.tasksCompleted, 0);
  return {
    students: rows.length,
    active,
    lessonsCompleted: lessons,
    questionsAnswered: answered,
    firstTryCorrect: firstTry,
    tasksAssigned: assigned,
    tasksCompleted: completed,
  };
}
