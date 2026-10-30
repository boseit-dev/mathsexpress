import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProgressRepository } from '@/data/repositories';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'failed';

/**
 * Saves a lesson attempt to the student's account as they answer. The attempt starts with the
 * first answer (so opening a lesson saves nothing), answers are sent in order, and the server
 * marks each one. Saving never blocks practice: if it fails, the student keeps going and the next
 * answer tries again.
 */
export function useLessonProgress(progress: ProgressRepository, lessonId: string) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [completed, setCompleted] = useState(false);
  // Coins the server paid when this attempt was finished: null until then.
  const [lessonCoins, setLessonCoins] = useState<number | null>(null);
  const attempt = useRef<Promise<string> | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  // Bumped when the student practises again, so late replies from the old attempt are ignored.
  const generation = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const save = useCallback(
    (questionId: string, answer: string, hintsUsed: number) => {
      const round = generation.current;
      setStatus('saving');
      queue.current = queue.current
        .catch(() => undefined)
        .then(async () => {
          attempt.current ??= progress.startAttempt(lessonId);
          let attemptId: string;
          try {
            attemptId = await attempt.current;
          } catch (error) {
            attempt.current = null;
            throw error;
          }
          return progress.recordAnswer(attemptId, questionId, answer, hintsUsed);
        })
        .then((result) => {
          if (!mounted.current || round !== generation.current) return;
          setStatus('saved');
          if (result.completed) setCompleted(true);
          if (result.completed && !result.alreadySolved) setLessonCoins(result.coinsAwarded);
        })
        .catch(() => {
          if (!mounted.current || round !== generation.current) return;
          setStatus('failed');
        });
    },
    [progress, lessonId],
  );

  const restart = useCallback(() => {
    generation.current += 1;
    attempt.current = null;
    setStatus('idle');
    setCompleted(false);
    setLessonCoins(null);
  }, []);

  return { save, restart, status, completed, lessonCoins };
}
