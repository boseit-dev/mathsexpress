import { toPercent } from '@/lib/math';

export interface LearningProgress {
  topicsCompleted: number;
  /** Topics in the course for the student's year level. */
  topicsInCourse: number;
  questionsAnswered: number;
  questionsCorrect: number;
  questionsAnsweredThisWeek: number;
  /** Consecutive days, up to today, with at least one question answered. */
  streakDays: number;
  bestStreakDays: number;
}

/** Percentage of answers that were correct, or null before any question has been answered. */
export function getAccuracyPercent(progress: LearningProgress): number | null {
  if (progress.questionsAnswered === 0) return null;
  return toPercent(progress.questionsCorrect, progress.questionsAnswered);
}
