import {
  BookOpen,
  ChartColumn,
  ClipboardList,
  Ellipsis,
  GraduationCap,
  House,
  School,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { paths } from './paths';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Only mark this item current on its exact address (used for section home pages). */
  end?: boolean;
}

export const studentNavigation: readonly NavItem[] = [
  { label: 'Home', to: paths.student.home, icon: House, end: true },
  { label: 'Learn', to: paths.student.learn, icon: GraduationCap },
  { label: 'Textbook', to: paths.student.textbook, icon: BookOpen },
  { label: 'Class', to: paths.student.class, icon: Users },
  { label: 'More', to: paths.student.more, icon: Ellipsis },
];

export const teacherNavigation: readonly NavItem[] = [
  { label: 'Home', to: paths.teacher.home, icon: House, end: true },
  { label: 'Classes', to: paths.teacher.classes, icon: School },
  { label: 'Tasks', to: paths.teacher.tasks, icon: ClipboardList },
  { label: 'Reports', to: paths.teacher.reports, icon: ChartColumn },
  { label: 'More', to: paths.teacher.more, icon: Ellipsis },
];
