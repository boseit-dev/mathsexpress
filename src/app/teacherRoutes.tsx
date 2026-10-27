import type { RouteObject } from 'react-router';
import { paths } from '@/config/paths';
import type { AppDependencies } from '@/data/repositories';
import { TeacherLayout } from '@/layouts/teacher/TeacherLayout';
import { createTeacherLayoutLoader } from '@/layouts/teacher/teacherLayoutLoader';
import { LoadingScreen } from './pages/LoadingScreen';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlannedSectionPage } from './pages/PlannedSectionPage';
import { RouteErrorPage } from './pages/RouteErrorPage';

function planned(title: string, summary: string, { isHome = false } = {}) {
  const homePath = isHome ? undefined : paths.teacher.home;
  return <PlannedSectionPage title={title} summary={summary} homePath={homePath} />;
}

export function createTeacherRoutes({ teacherRepository }: AppDependencies): RouteObject {
  return {
    path: paths.teacher.home,
    loader: createTeacherLayoutLoader(teacherRepository),
    element: <TeacherLayout />,
    hydrateFallbackElement: <LoadingScreen />,
    children: [
      {
        // Page errors render inside the layout, so the navigation stays usable.
        errorElement: <RouteErrorPage homePath={paths.teacher.home} />,
        children: [
          {
            index: true,
            element: planned(
              'Teacher home',
              'An overview of your classes, upcoming tasks and students who need help.',
              { isHome: true },
            ),
          },
          {
            path: paths.teacher.classes,
            element: planned(
              'Classes',
              'Create classes, invite students and set each student’s year level.',
            ),
          },
          {
            path: paths.teacher.tasks,
            element: planned(
              'Tasks',
              'Build tasks from curriculum skills, assign them with due dates and track completion.',
            ),
          },
          {
            path: paths.teacher.reports,
            element: planned('Reports', 'Progress and accuracy for each class, student and topic.'),
          },
          {
            path: paths.teacher.more,
            element: planned('More', 'Your profile, school settings and help.'),
          },
          { path: '*', element: <NotFoundPage homePath={paths.teacher.home} /> },
        ],
      },
    ],
  };
}
