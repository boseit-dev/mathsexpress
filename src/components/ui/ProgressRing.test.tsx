import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressRing } from './ProgressRing';

describe('ProgressRing', () => {
  it('exposes its name and value and shows the percentage', () => {
    render(<ProgressRing value={7} max={12} label="Task progress" valueText="7 of 12 questions" />);
    const ring = screen.getByRole('progressbar', { name: 'Task progress' });
    expect(ring).toHaveAttribute('aria-valuenow', '7');
    expect(ring).toHaveAttribute('aria-valuetext', '7 of 12 questions');
    expect(ring).toHaveTextContent('58%');
  });

  it('draws no arc at zero and clamps values above the maximum', () => {
    const { container, rerender } = render(<ProgressRing value={0} max={10} label="Progress" />);
    expect(container.querySelectorAll('circle')).toHaveLength(1);
    rerender(<ProgressRing value={15} max={10} label="Progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10');
    expect(screen.getByRole('progressbar')).toHaveTextContent('100%');
  });
});
