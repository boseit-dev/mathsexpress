import type { StatusTone } from '@/components/ui/StatusBadge';
import type { AssignmentKind, AssignmentStatus } from '@/domain/assignment';

export const assignmentKindLabel: Record<AssignmentKind, string> = {
  homework: 'Homework',
  quiz: 'Quiz',
  practice: 'Practice',
  revision: 'Revision',
};

export const assignmentStatusDisplay: Record<
  AssignmentStatus,
  { label: string; tone: StatusTone; action: string }
> = {
  'not-started': { label: 'Not started', tone: 'neutral', action: 'Start' },
  'in-progress': { label: 'In progress', tone: 'brand', action: 'Continue' },
  completed: { label: 'Completed', tone: 'success', action: 'Review' },
};
