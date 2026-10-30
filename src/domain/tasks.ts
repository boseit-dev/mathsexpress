import { calendarDaysBetween, formatShortDate, formatWeekday } from '@/lib/dates';
import type { YearLevel } from './student';

/** Kinds of learning content. Only lessons can be assigned today; the rest are reserved. */
export type ContentKind = 'lesson' | 'practice' | 'worksheet' | 'test';

/** Content kinds a teacher can choose when setting a task. */
export const ASSIGNABLE_KINDS: readonly ContentKind[] = ['lesson'];

/** Something in the catalogue a teacher can assign and a student can learn. */
export interface LearningItem {
  id: string;
  kind: ContentKind;
  title: string;
  strand: string;
  topic: string;
  yearLevel: YearLevel;
  questionCount: number;
  estimatedMinutes: number;
}

export type TaskState = 'draft' | 'published';
export type TaskAudience = 'class' | 'students';
/** How one student is doing with a task. Only work the server marked counts. */
export type TaskProgress = 'not_started' | 'in_progress' | 'completed';

/** A task as its teacher sees it, with how many of its students have done it. */
export interface TeacherTask {
  id: string;
  classId: string;
  className: string;
  title: string;
  instructions: string | null;
  contentId: string;
  contentTitle: string;
  contentKind: ContentKind;
  state: TaskState;
  audience: TaskAudience;
  dueAt: string;
  createdAt: string;
  publishedAt: string | null;
  assignedCount: number;
  completedCount: number;
  inProgressCount: number;
}

/** One student's result on a task. */
export interface TaskStudentResult {
  studentId: string;
  firstName: string;
  lastName: string;
  progress: TaskProgress;
  completedAt: string | null;
  lastActivityAt: string | null;
  questionsSolved: number;
  firstTryCorrect: number;
  questionCount: number;
}

/** A task as the student it is set for sees it. */
export interface StudentTask {
  id: string;
  classId: string;
  className: string;
  title: string;
  instructions: string | null;
  contentId: string;
  contentTitle: string;
  contentKind: ContentKind;
  topic: string;
  questionCount: number;
  estimatedMinutes: number;
  dueAt: string;
  publishedAt: string;
  progress: TaskProgress;
  completedAt: string | null;
  questionsSolved: number;
}

/** What a teacher fills in to set a task. */
export interface NewTask {
  classId: string;
  title: string;
  instructions: string;
  contentId: string;
  /** ISO 8601. */
  dueAt: string;
  /** Null for the whole class. */
  studentIds: string[] | null;
  publish: boolean;
  /** Makes a resent form harmless: the server creates the task only once per request. */
  requestId: string;
}

/** The result of marking one answer on the server. */
export interface AnswerResult {
  correct: boolean;
  /** The question was already solved in this attempt, so nothing changed. */
  alreadySolved: boolean;
  /** Every question in the attempt is now solved. */
  completed: boolean;
  /** Coins earned by this answer finishing the lesson; 0 otherwise or after the daily limit. */
  coinsAwarded: number;
}

export const TASK_TITLE_MAX = 80;
export const TASK_INSTRUCTIONS_MAX = 500;

export type DueTone = 'overdue' | 'soon' | 'upcoming' | 'done';

/** The due date in everyday words: "Due tomorrow", "Overdue by 2 days", "Completed 3 Nov". */
export function describeTaskDue(
  task: { dueAt: string; completedAt?: string | null },
  now: Date,
): { label: string; tone: DueTone } {
  if (task.completedAt) {
    return { label: `Completed ${formatShortDate(new Date(task.completedAt))}`, tone: 'done' };
  }
  const dueAt = new Date(task.dueAt);
  const days = calendarDaysBetween(now, dueAt);
  if (dueAt < now) {
    if (days === 0) return { label: 'Overdue · was due today', tone: 'overdue' };
    if (days === -1) return { label: 'Overdue · was due yesterday', tone: 'overdue' };
    return { label: `Overdue by ${-days} days`, tone: 'overdue' };
  }
  if (days === 0) return { label: 'Due today', tone: 'soon' };
  if (days === 1) return { label: 'Due tomorrow', tone: 'soon' };
  if (days < 7) return { label: `Due ${formatWeekday(dueAt)}`, tone: 'upcoming' };
  return { label: `Due ${formatShortDate(dueAt)}`, tone: 'upcoming' };
}

export function isTaskOverdue(task: { dueAt: string }, now: Date): boolean {
  return new Date(task.dueAt) < now;
}

/** Students still to finish a published task. */
export function outstandingCount(task: TeacherTask): number {
  return task.assignedCount - task.completedCount;
}

/** Percentage of assigned students who completed the task, or null when nobody is assigned. */
export function completionPercent(task: TeacherTask): number | null {
  if (task.assignedCount === 0) return null;
  return Math.round((task.completedCount / task.assignedCount) * 100);
}

/** Open tasks first by due date, then finished ones, most recent first. */
export function sortStudentTasks(tasks: readonly StudentTask[]): StudentTask[] {
  return [...tasks].sort((a, b) => {
    const aDone = a.progress === 'completed';
    const bDone = b.progress === 'completed';
    if (aDone !== bDone) return aDone ? 1 : -1;
    if (aDone) return (b.completedAt ?? '').localeCompare(a.completedAt ?? '');
    return a.dueAt.localeCompare(b.dueAt);
  });
}

/** Open (not completed) tasks, and how many of them are past their due date. */
export function countOpenTasks(
  tasks: readonly StudentTask[],
  now: Date,
): { open: number; overdue: number } {
  const open = tasks.filter((task) => task.progress !== 'completed');
  return { open: open.length, overdue: open.filter((task) => isTaskOverdue(task, now)).length };
}

/** The task to carry on with: one already started, otherwise the next one due. */
export function selectContinueTask(tasks: readonly StudentTask[]): StudentTask | null {
  const open = sortStudentTasks(tasks).filter((task) => task.progress !== 'completed');
  return open.find((task) => task.progress === 'in_progress') ?? open[0] ?? null;
}
