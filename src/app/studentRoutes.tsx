import type { RouteObject } from 'react-router';
import { paths } from '@/config/paths';
import type { AppDependencies } from '@/data/repositories';
import { createStudentClassAction } from '@/features/student-class/studentClassHandlers';
import { StudentClassPage } from '@/features/student-class/StudentClassPage';
import { StudentHomePage } from '@/features/student-home/StudentHomePage';
import { LearnPage } from '@/features/learning/LearnPage';
import { GuidedLessonPage } from '@/features/learning/GuidedLessonPage';
import { createStudentTasksLoader } from '@/features/student-tasks/studentTasksLoader';
import { StudentTasksPage } from '@/features/student-tasks/StudentTasksPage';
import { createLessonLoader } from '@/features/learning/lessonLoader';
import { TextbookPage } from '@/features/textbook/TextbookPage';
import { CoinHistoryPage } from '@/features/shop/CoinHistoryPage';
import { CollectionPage } from '@/features/shop/CollectionPage';
import { ShopBrowsePage } from '@/features/shop/ShopBrowsePage';
import { ShopLayout } from '@/features/shop/ShopLayout';
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
            loader: createLessonLoader(dependencies),
            element: <GuidedLessonPage shop={dependencies.shop} progress={dependencies.progress} />,
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
            loader: createStudentTasksLoader(dependencies),
            element: <StudentTasksPage />,
          },
          {
            path: paths.student.shop,
            element: <ShopLayout shop={dependencies.shop} />,
            children: [
              { index: true, element: <ShopBrowsePage /> },
              { path: paths.student.shopCollection, element: <CollectionPage /> },
              { path: paths.student.shopHistory, element: <CoinHistoryPage /> },
            ],
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
