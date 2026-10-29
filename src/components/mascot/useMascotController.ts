import { useCallback, useEffect, useState } from 'react';
import { mascotAnimations, type AnimationName } from './animations';

/** Reactions shorter than this stay on screen long enough to be noticed with reduced motion. */
const MIN_REACTION_MS = 1400;

interface ControllerState {
  current: AnimationName;
  rest: AnimationName;
  /** How many times the resting animation plays before settling; undefined loops. */
  restCycles: number | undefined;
  reactionCycles?: number;
  /** How long the current reaction stays before returning to rest. */
  reactionMs: number;
  /** Bumped on every play, so replaying the same reaction restarts it. */
  replayKey: number;
  reacting: boolean;
}

export interface MascotController {
  /** Spread onto `<Mascot />`. */
  bind: { animation: AnimationName; replayKey: number; cycles: number | undefined };
  /**
   * Plays a reaction, then returns to the resting animation. Playing a looping animation makes
   * it the new resting state.
   */
  play: (name: AnimationName, options?: { cycles?: number }) => void;
  /** Changes what the mascot does between reactions, optionally settling after a few cycles. */
  setRest: (name: AnimationName, options?: { cycles?: number }) => void;
  current: AnimationName;
}

/**
 * A small state machine for the mascot: one resting animation, and short reactions on top of
 * it for real events (a correct answer, a hint). Reactions replace each other instead of
 * queueing, so the mascot always shows the latest event and never lags behind the page.
 */
export function useMascotController(
  initialRest: AnimationName = 'idle',
  options: { restCycles?: number } = {},
): MascotController {
  const [state, setState] = useState<ControllerState>({
    current: initialRest,
    rest: initialRest,
    restCycles: options.restCycles,
    reactionMs: 0,
    replayKey: 0,
    reacting: false,
  });

  // The return to rest is scheduled by an effect (not inside play) so it is cancelled when the
  // component unmounts and rescheduled if React remounts it, as Strict Mode does in development.
  useEffect(() => {
    if (!state.reacting) return;
    const timer = setTimeout(() => {
      setState((s) => ({ ...s, current: s.rest, reacting: false }));
    }, state.reactionMs);
    return () => {
      clearTimeout(timer);
    };
  }, [state.reacting, state.reactionMs, state.replayKey]);

  const play = useCallback((name: AnimationName, playOptions: { cycles?: number } = {}) => {
    const def = mascotAnimations[name];
    if (def.loop && playOptions.cycles === undefined) {
      setState((s) => ({
        ...s,
        current: name,
        rest: name,
        restCycles: undefined,
        replayKey: s.replayKey + 1,
        reacting: false,
      }));
      return;
    }
    const cycles = playOptions.cycles ?? 1;
    const length = Math.max(def.cycleMs * cycles, MIN_REACTION_MS);
    setState((s) => ({
      ...s,
      current: name,
      reactionCycles: cycles,
      reactionMs: length,
      replayKey: s.replayKey + 1,
      reacting: true,
    }));
  }, []);

  const setRest = useCallback((name: AnimationName, restOptions: { cycles?: number } = {}) => {
    setState((s) =>
      s.rest === name && s.restCycles === restOptions.cycles
        ? s
        : {
            ...s,
            rest: name,
            restCycles: restOptions.cycles,
            current: s.reacting ? s.current : name,
          },
    );
  }, []);

  return {
    bind: {
      animation: state.current,
      replayKey: state.replayKey,
      cycles: state.reacting ? state.reactionCycles : state.restCycles,
    },
    play,
    setRest,
    current: state.current,
  };
}
