import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/renderWithRouter';
import { Button } from './Button';
import { ButtonLink } from './ButtonLink';

describe('Button', () => {
  it('is a plain button by default so it never submits a form by accident', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
  });

  it('calls its click handler', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Try again</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('ButtonLink', () => {
  it('renders a link to the given path', () => {
    renderWithRouter(<ButtonLink to="/student/learn">Continue learning</ButtonLink>);
    expect(screen.getByRole('link', { name: 'Continue learning' })).toHaveAttribute(
      'href',
      '/student/learn',
    );
  });
});
