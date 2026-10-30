import type { RouteObject } from 'react-router';
import { paths } from '@/config/paths';
import type { AppDependencies } from '@/data/repositories';
import {
  createTeacherClassAction,
  createTeacherClassesAction,
  createTeacherClassesLoader,
  createTeacherClassLoader,
} from '@/features/teacher-classes/teacherClassesHandlers';
import { TeacherClassesPage } from '@/features/teacher-classes/TeacherClassesPage';
import { ClassOverviewPage } from '@/features/teacher-classes/ClassOverviewPage';
import { ClassStudentsPage } from '@/features/teacher-classes/ClassStudentsPage';
import { TeacherClassLayout } from '@/features/teacher-classes/TeacherClassLayout';
import { createTeacherHomeLoader } from '@/features/teacher-home/teacherHomeLoader';
import { TeacherHomePage } from '@/features/teacher-home/TeacherHomePage';
import { TeacherLayout } from '@/layouts/teacher/TeacherLayout';
import { createTeacherLayoutLoader } from '@/layouts/teacher/teacherLayoutLoader';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlannedSectionPage } from './pages/PlannedSectionPage';
import { RouteErrorPage } from './pages/RouteErrorPage';

function planned(title: string, summary: string) {
  return <PlannedSectionPage title={title} summary={summary} homePath={paths.teacher.home} />;
}

export function createTeacherRoutes(dependencies: AppDependencies): RouteObject {
  const classAction = createTeacherClassAction(dependencies);
  return {
    path: paths.teacher.home,
    loader: createTeacherLayoutLoader(dependencies),
    element: <TeacherLayout />,
    children: [
      {
        // Page errors render inside the layout, so the navigation stays usable.
        errorElement: <RouteErrorPage homePath={paths.teacher.home} />,
        children: [
          {
            index: true,
            loader: createTeacherHomeLoader(dependencies),
            element: <TeacherHomePage />,
          },
          {
            path: paths.teacher.classes,
            loader: createTeacherClassesLoader(dependencies),
            action: createTeacherClassesAction(dependencies),
            element: <TeacherClassesPage />,
          },
          {
            // The class workspace. Each area posts its changes to the same class action.
            path: `${paths.teacher.classes}/:classId`,
            loader: createTeacherClassLoader(dependencies),
            action: classAction,
            element: <TeacherClassLayout />,
            children: [
              { index: true, action: classAction, element: <ClassOverviewPage /> },
              { path: 'students', action: classAction, element: <ClassStudentsPage /> },
            ],
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
