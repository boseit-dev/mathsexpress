import { createBrowserRouter } from 'react-router';
import { createAppDependencies } from '@/data';
import { createRoutes } from './routes';

export const router = createBrowserRouter(createRoutes(createAppDependencies()));
