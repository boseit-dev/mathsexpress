import { StrictMode, useEffect } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mascotAnimations } from './animations';
import { useMascotController } from './useMascotController';

describe('useMascotController', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('plays a reaction once, then returns to rest', () => {
    const { result } = renderHook(() => useMascotController('idle'));
    expect(result.current.bind).toMatchObject({ animation: 'idle', cycles: undefined });

    act(() => {
      result.current.play('correct');
    });
    expect(result.current.bind).toMatchObject({ animation: 'correct', cycles: 1 });

    act(() => {
      vi.advanceTimersByTime(Math.max(mascotAnimations.correct.cycleMs, 1400));
    });
    expect(result.current.current).toBe('idle');
  });

  it('restarts a reaction that is played again', () => {
    const { result } = renderHook(() => useMascotController());
    act(() => {
      result.current.play('incorrect');
    });
    const first = result.current.bind.replayKey;
    act(() => {
      result.current.play('incorrect');
    });
    expect(result.current.bind.replayKey).toBeGreaterThan(first);
  });

  it('lets the newest event replace the current reaction', () => {
    const { result } = renderHook(() => useMascotController());
    act(() => {
      result.current.play('incorrect');
      result.current.play('correct');
    });
    expect(result.current.current).toBe('correct');
    act(() => {
      vi.advanceTimersByTime(Math.max(mascotAnimations.correct.cycleMs, 1400));
    });
    expect(result.current.current).toBe('idle');
  });

  it('keeps a reaction playing when the resting state changes, then rests in the new one', () => {
    const { result } = renderHook(() => useMascotController());
    act(() => {
      result.current.play('idea');
      result.current.setRest('thinking', { cycles: 2 });
    });
    expect(result.current.current).toBe('idea');
    act(() => {
      vi.advanceTimersByTime(mascotAnimations.idea.cycleMs);
    });
    expect(result.current.bind).toMatchObject({ animation: 'thinking', cycles: 2 });
  });

  it('makes a looping animation the new resting state', () => {
    const { result } = renderHook(() => useMascotController());
    act(() => {
      result.current.play('reading');
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current.current).toBe('reading');
  });

  it('still returns to rest after a reaction started on mount in Strict Mode', () => {
    const { result } = renderHook(
      () => {
        const mascot = useMascotController();
        const { play } = mascot;
        useEffect(() => {
          play('wave');
        }, [play]);
        return mascot;
      },
      { wrapper: StrictMode },
    );
    expect(result.current.current).toBe('wave');
    act(() => {
      vi.advanceTimersByTime(mascotAnimations.wave.cycleMs);
    });
    expect(result.current.current).toBe('idle');
  });
});
