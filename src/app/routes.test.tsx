import { render, screen } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { describe, expect, it } from 'vitest';
import { createRoutes } from './routes';

describe('app routes', () => {
  it('shows the not-found page for an unknown address', async () => {
    const router = createMemoryRouter(createRoutes(), { initialEntries: ['/no-such-page'] });
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  });
});
