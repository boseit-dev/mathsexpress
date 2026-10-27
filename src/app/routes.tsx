import type { RouteObject } from 'react-router';
import { NotFoundPage } from './pages/NotFoundPage';

export function createRoutes(): RouteObject[] {
  return [{ path: '*', element: <NotFoundPage /> }];
}
