import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('shows initials and is named after the person', () => {
    render(<Avatar name="Mia Chen" />);
    expect(screen.getByRole('img', { name: 'Mia Chen' })).toHaveTextContent('MC');
  });

  it('is hidden from screen readers when decorative', () => {
    render(<Avatar name="Mia Chen" decorative />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('MC')).toHaveAttribute('aria-hidden', 'true');
  });
});
