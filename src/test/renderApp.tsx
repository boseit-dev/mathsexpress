import { render } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { createRoutes } from '@/app/routes';
import { createAppDependencies } from '@/data';
import type { AppDependencies } from '@/data/repositories';

/** A fixed "now" for tests: Wednesday 28 October 2026, 3:30 pm in Sydney. */
export const TEST_NOW = new Date(2026, 9, 28, 15, 30);

/** Renders the whole app at `path` with sample data, optionally replacing dependencies. */
export function renderApp(path: string, overrides: Partial<AppDependencies> = {}) {
  const dependencies = { ...createAppDependencies(() => TEST_NOW), ...overrides };
  const router = createMemoryRouter(createRoutes(dependencies), { initialEntries: [path] });
  const view = render(<RouterProvider router={router} />);
  return { router, ...view };
}
