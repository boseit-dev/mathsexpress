import { redirect, type RouteObject } from 'react-router';
import { paths } from '@/config/paths';
import type { AppDependencies } from '@/data/repositories';
import { StandalonePage } from '@/layouts/StandalonePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouteErrorPage } from './pages/RouteErrorPage';
import { createStudentRoutes } from './studentRoutes';
import { createTeacherRoutes } from './teacherRoutes';

/** The app's route table. Dependencies are passed in so tests can supply their own data. */
export function createRoutes(dependencies: AppDependencies): RouteObject[] {
  return [
    {
      // Catches anything the layouts can't, e.g. a failure loading the signed-in person.
      errorElement: (
        <StandalonePage>
          <RouteErrorPage />
        </StandalonePage>
      ),
      children: [
        // Until sign-in exists everyone starts on the student home; later this will send
        // each person to their own role's home page.
        { index: true, loader: () => redirect(paths.student.home) },
        createStudentRoutes(dependencies),
        createTeacherRoutes(dependencies),
        {
          path: '*',
          element: (
            <StandalonePage>
              <NotFoundPage />
            </StandalonePage>
          ),
        },
      ],
    },
  ];
}
