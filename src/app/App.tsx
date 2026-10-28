import { RouterProvider } from 'react-router/dom';
import type { createAppRouter } from './router';

export function App({ router }: { router: ReturnType<typeof createAppRouter> }) {
  return <RouterProvider router={router} />;
}
