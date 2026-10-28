import { render } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { createRoutes } from '@/app/routes';
import type { AppDependencies } from '@/data/repositories';
import {
  createFakeDependencies,
  createFakeState,
  testStudent,
  testTeacher,
  type FakeState,
} from './fakeDependencies';

export { TEST_NOW } from './fakeDependencies';

interface RenderAppOptions {
  /** Who is signed in when the app opens. Defaults to the test student. */
  signedInAs?: 'student' | 'teacher' | null;
  /** The fake world; pass one in to inspect or arrange it. */
  state?: FakeState;
  /** Replace individual services, e.g. to simulate a failure. */
  overrides?: Partial<AppDependencies>;
}

/** Renders the whole app at `path` with in-memory services. */
export function renderApp(
  path: string,
  { signedInAs = 'student', state = createFakeState(), overrides = {} }: RenderAppOptions = {},
) {
  state.signedInEmail =
    signedInAs === 'student'
      ? testStudent.email
      : signedInAs === 'teacher'
        ? testTeacher.email
        : null;
  const dependencies = { ...createFakeDependencies(state), ...overrides };
  const router = createMemoryRouter(createRoutes(dependencies), { initialEntries: [path] });
  const view = render(<RouterProvider router={router} />);
  return { router, state, dependencies, ...view };
}
