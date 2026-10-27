import type { RouteObject } from 'react-router';
import { paths } from '@/config/paths';
import type { AppDependencies } from '@/data/repositories';
import { StudentLayout } from '@/layouts/student/StudentLayout';
import { createStudentLayoutLoader } from '@/layouts/student/studentLayoutLoader';
import { LoadingScreen } from './pages/LoadingScreen';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlannedSectionPage } from './pages/PlannedSectionPage';
import { RouteErrorPage } from './pages/RouteErrorPage';

function planned(title: string, summary: string, { isHome = false } = {}) {
  const homePath = isHome ? undefined : paths.student.home;
  return <PlannedSectionPage title={title} summary={summary} homePath={homePath} />;
}

export function createStudentRoutes({ studentRepository }: AppDependencies): RouteObject {
  return {
    path: paths.student.home,
    loader: createStudentLayoutLoader(studentRepository),
    element: <StudentLayout />,
    hydrateFallbackElement: <LoadingScreen />,
    children: [
      {
        // Page errors render inside the layout, so the navigation stays usable.
        errorElement: <RouteErrorPage homePath={paths.student.home} />,
        children: [
          {
            index: true,
            element: planned('Home', 'Your tasks, recommended practice, progress and rewards.', {
              isHome: true,
            }),
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
            path: paths.student.class,
            element: planned(
              'Class',
              'Your class, your teacher’s messages and how the class is going together.',
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
