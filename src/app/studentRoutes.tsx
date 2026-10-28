import type { RouteObject } from 'react-router';
import { paths } from '@/config/paths';
import type { AppDependencies } from '@/data/repositories';
import { createStudentClassAction } from '@/features/student-class/studentClassAction';
import { StudentClassPage } from '@/features/student-class/StudentClassPage';
import { StudentHomePage } from '@/features/student-home/StudentHomePage';
import { createStudentHomeLoader } from '@/features/student-home/studentHomeLoader';
import { StudentLayout } from '@/layouts/student/StudentLayout';
import { createStudentLayoutLoader } from '@/layouts/student/studentLayoutLoader';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlannedSectionPage } from './pages/PlannedSectionPage';
import { RouteErrorPage } from './pages/RouteErrorPage';

function planned(title: string, summary: string) {
  return <PlannedSectionPage title={title} summary={summary} homePath={paths.student.home} />;
}

export function createStudentRoutes(dependencies: AppDependencies): RouteObject {
  return {
    path: paths.student.home,
    loader: createStudentLayoutLoader(dependencies),
    element: <StudentLayout />,
    children: [
      {
        // Page errors render inside the layout, so the navigation stays usable.
        errorElement: <RouteErrorPage homePath={paths.student.home} />,
        children: [
          {
            index: true,
            loader: createStudentHomeLoader(dependencies),
            element: <StudentHomePage />,
          },
          {
            path: paths.student.learn,
            element: planned(
              'Learn',
              'Practise NSW curriculum skills for your year level, with questions that adapt as you improve.',
            ),
          },
          {
            path: paths.student.textbook,
            element: planned(
              'Textbook',
              'The MathsExpress textbook for your year, with worked examples for every topic.',
            ),
          },
          {
            // Uses the classes the layout loads, so it has no loader of its own.
            path: paths.student.class,
            action: createStudentClassAction(dependencies),
            element: <StudentClassPage />,
          },
          {
            path: paths.student.tasks,
            element: planned(
              'Your tasks',
              'Every task your teacher has set, with due dates, progress and results.',
            ),
          },
          {
            path: paths.student.shop,
            element: planned(
              'Coin shop',
              'Spend your coins on themes, avatar frames and power-ups.',
            ),
          },
          {
            path: paths.student.more,
            element: planned('More', 'Your profile, achievements, settings and help.'),
          },
          { path: '*', element: <NotFoundPage homePath={paths.student.home} /> },
        ],
      },
    ],
  };
}
