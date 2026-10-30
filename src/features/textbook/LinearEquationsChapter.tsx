import { useState } from 'react';
import { CheckCircle2, CircleHelp, RotateCcw } from 'lucide-react';
import { linearEquationExercises, isEquationAnswerCorrect } from './pilotEquations';
import styles from './TextbookPage.module.css';

/** A full original pilot chapter. The book does not claim to save answers to an account. */
export function LinearEquationsChapter({ view = 'all' }: { view?: 'all' | 'questions' }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean | undefined>>({});
  const [hints, setHints] = useState<readonly string[]>([]);
  const completed = linearEquationExercises.filter((item) => results[item.id]).length;

  return (
    <div className={styles.chapterBody}>
      {view === 'all' && <section className={styles.lessonBlock} aria-labelledby="concept-heading">
        <h2 id="concept-heading">1. Understanding equations</h2>
        <p>
          An equation says two expressions have the same value. To find an unknown number, keep both
          sides equal by performing the same operation on each side.
        </p>
        <div className={styles.example}>
          <strong>Worked example 1</strong>
          <p>Solve 3x + 5 = 20.</p>
          <ol>
            <li>Subtract 5 from both sides: 3x = 15.</li>
            <li>Divide both sides by 3: x = 5.</li>
            <li>Check: 3 × 5 + 5 = 20, so the answer is correct.</li>
          </ol>
        </div>
      </section>}

      <section className={styles.lessonBlock} aria-labelledby="exercise-heading">
        <div className={styles.exerciseHeading}>
          <div>
            <p className={styles.kicker}>PRACTISE</p>
            <h2 id="exercise-heading">Exercise 1A</h2>
          </div>
          <p className={styles.score}>
            {completed} / {linearEquationExercises.length} correct
          </p>
        </div>
        <p>Find the value of x. Use the hint if you need a starting point.</p>
        <div className={styles.exerciseList}>
          {linearEquationExercises.map((exercise, index) => {
            const answer = answers[exercise.id] ?? '';
            const checked = results[exercise.id];
            const hintVisible = hints.includes(exercise.id);
            return (
              <form
                key={exercise.id}
                className={styles.question}
                onSubmit={(event) => {
                  event.preventDefault();
                  setResults((previous) => ({
                    ...previous,
                    [exercise.id]: isEquationAnswerCorrect(answer, exercise.answer),
                  }));
                }}
              >
                <div className={styles.questionTop}>
                  <span className={styles.questionNumber}>{index + 1}.</span>
                  <strong className={styles.expression}>{exercise.prompt}</strong>
                  {checked && <CheckCircle2 aria-label="Correct" className={styles.correctIcon} />}
                </div>
                <label className={styles.answerLabel} htmlFor={`answer-${exercise.id}`}>
                  Your answer: x =
                </label>
                <div className={styles.answerRow}>
                  <input
                    id={`answer-${exercise.id}`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="e.g. −4"
                    value={answer}
                    className={styles.answerInput}
                    onChange={(event) => {
                      setAnswers((previous) => ({
                        ...previous,
                        [exercise.id]: event.target.value,
                      }));
                      setResults((previous) => ({ ...previous, [exercise.id]: undefined }));
                    }}
                  />
                  <button className={styles.checkButton} type="submit" disabled={!answer.trim()}>
                    Check
                  </button>
                  <button
                    className={styles.hintButton}
                    type="button"
                    aria-expanded={hintVisible}
                    onClick={() => {
                      setHints((previous) =>
                        previous.includes(exercise.id)
                          ? previous.filter((id) => id !== exercise.id)
                          : [...previous, exercise.id],
                      );
                    }}
                  >
                    <CircleHelp aria-hidden="true" /> Hint
                  </button>
                </div>
                {hintVisible && <p className={styles.hintText}>{exercise.hint}</p>}
                {checked !== undefined && (
                  <p className={checked ? styles.correctText : styles.retryText} role="status">
                    {checked
                      ? `Correct! ${exercise.method}`
                      : 'Not quite. Try again or open the hint.'}
                  </p>
                )}
              </form>
            );
          })}
        </div>
        <div className={styles.exerciseFooter}>
          <p>Answers in this preview stay on this page and are not saved to your account yet.</p>
          <button
            className={styles.hintButton}
            type="button"
            onClick={() => {
              setAnswers({});
              setResults({});
              setHints([]);
            }}
          >
            <RotateCcw aria-hidden="true" /> Start again
          </button>
        </div>
      </section>
    </div>
  );
}
