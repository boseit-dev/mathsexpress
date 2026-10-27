import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes its name and value to assistive technology', () => {
    render(<ProgressBar value={7} max={12} label="Task progress" valueText="7 of 12 questions" />);
    const bar = screen.getByRole('progressbar', { name: 'Task progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '7');
    expect(bar).toHaveAttribute('aria-valuemax', '12');
    expect(bar).toHaveAttribute('aria-valuetext', '7 of 12 questions');
  });

  it('defaults the spoken value to a percentage and fills to match', () => {
    render(<ProgressBar value={7} max={12} label="Task progress" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuetext', '58%');
    expect(bar.firstElementChild).toHaveStyle({ inlineSize: '58%' });
  });

  it('keeps out-of-range values inside the bar', () => {
    render(<ProgressBar value={15} max={12} label="Task progress" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '12');
    expect(bar.firstElementChild).toHaveStyle({ inlineSize: '100%' });
  });
});
