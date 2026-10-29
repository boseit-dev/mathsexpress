import type { RouteObject } from 'react-router';
import { paths } from '@/config/paths';
import type { AppDependencies } from '@/data/repositories';
import { createStudentClassAction } from '@/features/student-class/studentClassHandlers';
import { StudentClassPage } from '@/features/student-class/StudentClassPage';
import { StudentHomePage } from '@/features/student-home/StudentHomePage';
import { LearnPage } from '@/features/learning/LearnPage';
import { GuidedLessonPage } from '@/features/learning/GuidedLessonPage';
import { TextbookPage } from '@/features/textbook/TextbookPage';
import { createStudentHomeLoader } from '@/features/student-home/studentHomeLoader';
import { StudentLayout } from '@/layouts/student/StudentLayout';
import { createStudentLayoutLoader } from '@/layouts/student/studentLayoutLoader';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlannedSectionPage } from './pages/PlannedSectionPage';
import { RouteErrorPage } from './pages/RouteErrorPage';

function planned(title: string, summary: string) {
  return <PlannedSectionPage title={title} summary={summary} homePath={paths.student.home} />;
}

const PAGES_SHOWING_CLASSES: readonly string[] = [paths.student.home, paths.student.class];

export function createStudentRoutes(dependencies: AppDependencies): RouteObject {
  return {
    path: paths.student.home,
    loader: createStudentLayoutLoader(dependencies),
    // The student's classes reload when opening a page that shows them, so a teacher's changes
    // (a new year level, a removal) show there at once. Other pages don't wait for them.
    shouldRevalidate: ({ currentUrl, nextUrl, defaultShouldRevalidate }) =>
      defaultShouldRevalidate ||
      (currentUrl.pathname !== nextUrl.pathname &&
        (PAGES_SHOWING_CLASSES.includes(nextUrl.pathname) ||
          nextUrl.pathname.startsWith(paths.student.learn))),
    element: <StudentLayout shop={dependencies.shop} />,
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
            element: <LearnPage />,
          },
          {
            path: `${paths.student.learn}/:lessonId`,
            element: <GuidedLessonPage />,
          },
          { path: paths.student.textbook, element: <TextbookPage /> },
          { path: `${paths.student.textbook}/:bookId`, element: <TextbookPage /> },
          { path: `${paths.student.textbook}/:bookId/:chapterId`, element: <TextbookPage /> },
          {
            // Uses the student and classes the layout loads.
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
