import { calendarDaysBetween, formatShortDate, formatWeekday } from '@/lib/dates';

export type AssignmentKind = 'homework' | 'quiz' | 'practice' | 'revision';
export type AssignmentStatus = 'not-started' | 'in-progress' | 'completed';

/** A task a teacher has set for the student. Dates are ISO 8601 strings. */
export interface Assignment {
  id: string;
  title: string;
  kind: AssignmentKind;
  topic: string;
  dueAt: string;
  questionCount: number;
  questionsCompleted: number;
  /** The most coins the task can award. */
  coinsAvailable: number;
  coinsEarned: number;
  /** When the student last worked on it; null if never started. */
  lastActivityAt: string | null;
  /** When the student finished it; null while it is still open. */
  completedAt: string | null;
}

export type DueTone = 'overdue' | 'soon' | 'upcoming' | 'done';

export interface DueDescription {
  label: string;
  tone: DueTone;
}

export function getAssignmentStatus(assignment: Assignment): AssignmentStatus {
  if (assignment.completedAt !== null) return 'completed';
  return assignment.questionsCompleted > 0 ? 'in-progress' : 'not-started';
}

export function isOpen(assignment: Assignment): boolean {
  return getAssignmentStatus(assignment) !== 'completed';
}

export function isOverdue(assignment: Assignment, now: Date): boolean {
  return isOpen(assignment) && new Date(assignment.dueAt) < now;
}

/** The due date in the words a student would use: "Due tomorrow", "Overdue by 2 days". */
export function describeDue(assignment: Assignment, now: Date): DueDescription {
  if (assignment.completedAt !== null) {
    return {
      label: `Completed ${formatShortDate(new Date(assignment.completedAt))}`,
      tone: 'done',
    };
  }

  const dueAt = new Date(assignment.dueAt);
  const daysUntilDue = calendarDaysBetween(now, dueAt);

  if (dueAt < now) {
    if (daysUntilDue === 0) return { label: 'Overdue · was due today', tone: 'overdue' };
    if (daysUntilDue === -1) return { label: 'Overdue · was due yesterday', tone: 'overdue' };
    return { label: `Overdue by ${-daysUntilDue} days`, tone: 'overdue' };
  }
  if (daysUntilDue === 0) return { label: 'Due today', tone: 'soon' };
  if (daysUntilDue === 1) return { label: 'Due tomorrow', tone: 'soon' };
  if (daysUntilDue < 7) return { label: `Due ${formatWeekday(dueAt)}`, tone: 'upcoming' };
  return { label: `Due ${formatShortDate(dueAt)}`, tone: 'upcoming' };
}

function toTimestamp(isoDate: string | null): number {
  return isoDate === null ? 0 : Date.parse(isoDate);
}

function byDueDate(a: Assignment, b: Assignment): number {
  return toTimestamp(a.dueAt) - toTimestamp(b.dueAt);
}

function byMostRecentlyCompleted(a: Assignment, b: Assignment): number {
  return toTimestamp(b.completedAt) - toTimestamp(a.completedAt);
}

function byMostRecentActivity(a: Assignment, b: Assignment): number {
  return toTimestamp(b.lastActivityAt) - toTimestamp(a.lastActivityAt);
}

/** Open tasks soonest-due first (so overdue ones lead), then recently completed ones. */
export function selectHomeAssignments(assignments: readonly Assignment[], limit: number) {
  const open = assignments.filter(isOpen).sort(byDueDate);
  const completed = assignments.filter((assignment) => !isOpen(assignment));
  return [...open, ...completed.sort(byMostRecentlyCompleted)].slice(0, limit);
}

/**
 * The task "Continue learning" points to: the one the student most recently worked on, or else
 * the open task due soonest. Null when nothing is open.
 */
export function selectContinueAssignment(assignments: readonly Assignment[]): Assignment | null {
  const inProgress = assignments
    .filter((assignment) => getAssignmentStatus(assignment) === 'in-progress')
    .sort(byMostRecentActivity);
  return inProgress[0] ?? assignments.filter(isOpen).sort(byDueDate)[0] ?? null;
}

export function countOpenAssignments(assignments: readonly Assignment[], now: Date) {
  const open = assignments.filter(isOpen);
  return {
    open: open.length,
    overdue: open.filter((assignment) => isOverdue(assignment, now)).length,
  };
}
