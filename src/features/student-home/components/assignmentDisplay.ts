import {
  BellRing,
  CalendarClock,
  Check,
  ListChecks,
  NotebookPen,
  RotateCcw,
  Target,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import type { StatusTone } from '@/components/ui/StatusBadge';
import type { AssignmentKind, AssignmentStatus, DueTone } from '@/domain/assignment';

/** How each kind of task is labelled and drawn. */
export const assignmentKindDisplay: Record<AssignmentKind, { label: string; icon: LucideIcon }> = {
  homework: { label: 'Homework', icon: NotebookPen },
  quiz: { label: 'Quiz', icon: ListChecks },
  practice: { label: 'Practice', icon: Target },
  revision: { label: 'Revision', icon: RotateCcw },
};

export const assignmentStatusDisplay: Record<
  AssignmentStatus,
  { label: string; tone: StatusTone }
> = {
  'not-started': { label: 'Not started', tone: 'neutral' },
  'in-progress': { label: 'In progress', tone: 'brand' },
  completed: { label: 'Completed', tone: 'success' },
};

export const dueToneIcon: Record<DueTone, LucideIcon> = {
  overdue: TriangleAlert,
  soon: BellRing,
  upcoming: CalendarClock,
  done: Check,
};
