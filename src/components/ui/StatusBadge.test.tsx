import { render, screen } from '@testing-library/react';
import { Check } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('states the status in words beside its icon', () => {
    render(
      <StatusBadge tone="success" icon={Check}>
        Completed
      </StatusBadge>,
    );
    const badge = screen.getByText('Completed');
    expect(badge.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
