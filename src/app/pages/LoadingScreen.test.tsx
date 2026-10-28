import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoadingScreen, SLOW_LOAD_MS } from './LoadingScreen';

describe('LoadingScreen', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('offers a reload when loading takes too long', () => {
    vi.useFakeTimers();
    render(<LoadingScreen />);
    expect(screen.queryByRole('button', { name: 'Reload' })).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(SLOW_LOAD_MS);
    });
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    expect(screen.getByText(/taking longer than usual/)).toBeInTheDocument();
  });
});
