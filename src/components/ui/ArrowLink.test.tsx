import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/test/renderWithRouter';
import { ArrowLink } from './ArrowLink';

describe('ArrowLink', () => {
  it('renders a link whose name is its text only', () => {
    renderWithRouter(<ArrowLink to="/student/tasks">View all</ArrowLink>);
    expect(screen.getByRole('link', { name: 'View all' })).toHaveAttribute(
      'href',
      '/student/tasks',
    );
  });
});
