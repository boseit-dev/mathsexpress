import type { StatusTone } from '@/components/ui/StatusBadge';
import type { ContentKind, TaskProgress } from '@/domain/tasks';

/** How a student's progress on a task is shown, and what its button says. */
export const progressDisplay: Record<
  TaskProgress,
  { label: string; tone: StatusTone; action: string }
> = {
  not_started: { label: 'Not started', tone: 'neutral', action: 'Start' },
  in_progress: { label: 'In progress', tone: 'brand', action: 'Continue' },
  completed: { label: 'Completed', tone: 'success', action: 'Review' },
};

export const contentKindLabel: Record<ContentKind, string> = {
  lesson: 'Lesson',
  practice: 'Practice',
  worksheet: 'Worksheet',
  test: 'Test',
};

/** "4 of 5" style counts, used in tables and summaries. */
export function ofCount(part: number, whole: number): string {
  return `${part} of ${whole}`;
}

/** First-try accuracy as a whole percentage, or null before any answer. */
export function accuracyPercent(firstTryCorrect: number, answered: number): number | null {
  if (answered === 0) return null;
  return Math.round((firstTryCorrect / answered) * 100);
}
