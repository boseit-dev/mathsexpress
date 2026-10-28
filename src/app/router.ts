import { createBrowserRouter } from 'react-router';
import type { AppDependencies } from '@/data/repositories';
import { createRoutes } from './routes';

export function createAppRouter(dependencies: AppDependencies) {
  return createBrowserRouter(createRoutes(dependencies));
}
