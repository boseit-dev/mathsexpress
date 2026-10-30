import type { RouteObject } from 'react-router';
import type { AppDependencies } from '@/data/repositories';
import { paths } from '@/config/paths';
import { MascotPreviewPage } from '@/features/mascot/MascotPreviewPage';
import { StandalonePage } from '@/layouts/StandalonePage';
import { createAuthRoutes } from './auth/authRoutes';
import { startPageRedirect } from './auth/guards';
import { LoadingScreen } from './pages/LoadingScreen';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouteErrorPage } from './pages/RouteErrorPage';
import { RootLayout } from './RootLayout';
import { createStudentRoutes } from './studentRoutes';
import { createTeacherRoutes } from './teacherRoutes';
import { withLoadingFallbacks } from './withLoadingFallbacks';

/** The app's route table. Dependencies are passed in so tests can supply their own. */
export function createRoutes(dependencies: AppDependencies): RouteObject[] {
  return withLoadingFallbacks([
    {
      element: <RootLayout auth={dependencies.auth} />,
      // Catches anything the layouts can't, e.g. a failure loading the signed-in person.
      errorElement: (
        <StandalonePage>
          <RouteErrorPage />
        </StandalonePage>
      ),
      children: [
        // Sends each person to sign in, to finish setting up, or to their role's home page.
        {
          index: true,
          loader: () => startPageRedirect(dependencies),
          element: <LoadingScreen />,
        },
        ...createAuthRoutes(dependencies),
        createStudentRoutes(dependencies),
        createTeacherRoutes(dependencies),
        {
          path: paths.mascot,
          element: (
            <StandalonePage>
              <MascotPreviewPage />
            </StandalonePage>
          ),
        },
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
  ]);
}
