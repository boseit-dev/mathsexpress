import { useState } from 'react';
import { CheckCircle2, CircleHelp, RotateCcw } from 'lucide-react';
import { linearEquationExercises, isEquationAnswerCorrect } from './pilotEquations';
import base from './TextbookPage.module.css';
import styles from './TeachingChapter.module.css';

/** Original, concept-first teaching. Exercise answers are deliberately session-only. */
export function LinearEquationsChapter() {
  const [addedNumber, setAddedNumber] = useState(5);
  const [guidedAnswer, setGuidedAnswer] = useState('');
  const [guidedChecked, setGuidedChecked] = useState<boolean | undefined>(undefined);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean | undefined>>({});
  const [hints, setHints] = useState<readonly string[]>([]);
  const completed = linearEquationExercises.filter((item) => results[item.id]).length;

  return (
    <div className={styles.chapter}>
      <section id="concept" className={styles.section} aria-labelledby="concept-heading">
        <p className={styles.stepLabel}>01 / DISCOVER THE IDEA</p>
        <h2 id="concept-heading">1. Understanding equations</h2>
        <p className={styles.lead}>
          Imagine two sides of a balance scale. When they are level, both sides weigh the same.
          An equation works in exactly the same way: the equals sign means the two expressions
          have the same value.
        </p>
        <p>
          A <strong>variable</strong>, such as x, stands for a number we do not know yet. Solving
          an equation means finding the number that makes both sides equal.
        </p>
        <div className={styles.bigIdea}>
          <strong>The big idea</strong>
          <p>If you change one side of an equation, you must make the same change to the other side.</p>
        </div>
        <div className={styles.explorer}>
          <div className={styles.explorerHeading}>
            <div>
              <strong>Explore the balance</strong>
              <p>Change the number being added to x. Notice how x changes to keep the total at 12.</p>
            </div>
            <span className={styles.exploreMark} aria-hidden="true">↔</span>
          </div>
          <label htmlFor="equation-slider">Number added to x: <strong>{addedNumber}</strong></label>
          <input
            id="equation-slider"
            type="range"
            min="1"
            max="10"
            value={addedNumber}
            onChange={(event) => {
              setAddedNumber(Number(event.target.value));
            }}
          />
          <div className={styles.balance} aria-label="Balanced equation">
            <div className={styles.balanceSide}>
              <span>LEFT SIDE</span>
              <strong>x + {addedNumber}</strong>
            </div>
            <span className={styles.equal} aria-hidden="true">=</span>
            <div className={styles.balanceSide}>
              <span>RIGHT SIDE</span>
              <strong>12</strong>
            </div>
          </div>
          <div className={styles.discovery}>
            <strong>What happens?</strong>
            <p>
              Subtract {addedNumber} from <em>both</em> sides to leave x on its own:
              x = 12 − {addedNumber} = <strong>{12 - addedNumber}</strong>.
            </p>
            <p>The check is {12 - addedNumber} + {addedNumber} = 12. Both sides agree.</p>
          </div>
        </div>
      </section>

      <section id="method" className={styles.section} aria-labelledby="method-heading">
        <p className={styles.stepLabel}>02 / LEARN THE METHOD</p>
        <h2 id="method-heading">Undo the operations, one at a time</h2>
        <p className={styles.lead}>
          Think of solving equations like unwrapping a present. Work backwards through the
          operations until x is by itself. Each line below shows <strong>what</strong> to do and
          <strong> why</strong>.
        </p>

        <div className={styles.worked}>
          <p className={styles.exampleTag}>WORKED EXAMPLE A · TWO-STEP EQUATION</p>
          <h3>Solve 3x + 5 = 20</h3>
          <ol className={styles.solutionSteps}>
            <li>
              <strong>3x + 5 = 20</strong>
              <p>The 5 is added after x has been multiplied by 3. Undo the addition first.</p>
            </li>
            <li>
              <strong>3x = 15</strong>
              <p>Subtract 5 from both sides. Now the only operation on x is multiplying by 3.</p>
            </li>
            <li>
              <strong>x = 5</strong>
              <p>Divide both sides by 3. The variable is now on its own.</p>
            </li>
            <li>
              <strong>Check: 3 × 5 + 5 = 20 ✓</strong>
              <p>Put 5 back into the original equation. It works, so the solution is correct.</p>
            </li>
          </ol>
        </div>
        <div className={styles.exampleGrid}>
          <div className={styles.miniWorked}>
            <p className={styles.exampleTag}>WORKED EXAMPLE B · NEGATIVES</p>
            <h3>Solve −2x + 9 = 17</h3>
            <p>Subtract 9 from both sides: −2x = 8.</p>
            <p>Divide both sides by <strong>−2</strong>: x = −4.</p>
            <p>Check: −2 × (−4) + 9 = 17.</p>
          </div>
          <div className={styles.miniWorked}>
            <p className={styles.exampleTag}>WORKED EXAMPLE C · BRACKETS</p>
            <h3>Solve 5(x − 2) = 25</h3>
            <p>Divide both sides by 5: x − 2 = 5.</p>
            <p>Add 2 to both sides: x = 7.</p>
            <p>Check: 5 × (7 − 2) = 25.</p>
          </div>
        </div>
        <div className={styles.mistake}>
          <strong>Common mistake: changing only one side</strong>
          <p>
            If 2x + 4 = 14, you cannot just remove the 4 from the left. You must also
            subtract 4 from the right: 2x = 10, so x = 5.
          </p>
        </div>
      </section>

      <section id="guided" className={styles.section} aria-labelledby="guided-heading">
        <p className={styles.stepLabel}>03 / TRY IT TOGETHER</p>
        <h2 id="guided-heading">Your turn, with support</h2>
        <p className={styles.lead}>
          Look at <strong>4x − 5 = 19</strong>. Before you find x, first undo the subtraction.
          What does <strong>4x</strong> equal after adding 5 to both sides?
        </p>
        <form
          className={styles.guidedCard}
          onSubmit={(event) => {
            event.preventDefault();
            setGuidedChecked(isEquationAnswerCorrect(guidedAnswer, 24));
          }}
        >
          <label htmlFor="guided-step">First step: 4x =</label>
          <div className={styles.guidedInputRow}>
            <input
              id="guided-step"
              inputMode="decimal"
              autoComplete="off"
              value={guidedAnswer}
              onChange={(event) => {
                setGuidedAnswer(event.target.value);
                setGuidedChecked(undefined);
              }}
            />
            <button type="submit" disabled={!guidedAnswer.trim()}>Check this step</button>
          </div>
          <details>
            <summary>Need a clue?</summary>
            <p>The inverse of subtracting 5 is adding 5. Add 5 to 19 as well.</p>
          </details>
          {guidedChecked !== undefined && (
            <p role="status" className={guidedChecked ? styles.guidedSuccess : styles.guidedRetry}>
              {guidedChecked
                ? 'Exactly! 4x = 24. Now divide both sides by 4 to find x = 6.'
                : 'Not yet. Focus on undoing −5 first: what is 19 + 5?'}
            </p>
          )}
        </form>
      </section>

      <section id="practice" className={styles.section} aria-labelledby="exercise-heading">
        <p className={styles.stepLabel}>04 / PRACTISE INDEPENDENTLY</p>
        <div className={base.exerciseHeading}>
          <div>
            <h2 id="exercise-heading">Exercise 1A</h2>
            <p>Use what you have learnt. You can check each answer, retry and open a hint.</p>
          </div>
          <p className={base.score}>{completed} / {linearEquationExercises.length} correct</p>
        </div>
        <div className={base.exerciseList}>
          {linearEquationExercises.map((exercise, index) => {
            const answer = answers[exercise.id] ?? '';
            const checked = results[exercise.id];
            const hintVisible = hints.includes(exercise.id);
            return (
              <form
                key={exercise.id}
                className={base.question}
                onSubmit={(event) => {
                  event.preventDefault();
                  setResults((previous) => ({
                    ...previous,
                    [exercise.id]: isEquationAnswerCorrect(answer, exercise.answer),
                  }));
                }}
              >
                <div className={base.questionTop}>
                  <span className={base.questionNumber}>{index + 1}.</span>
                  <strong className={base.expression}>{exercise.prompt}</strong>
                  {checked && <CheckCircle2 aria-label="Correct" className={base.correctIcon} />}
                </div>
                <label className={base.answerLabel} htmlFor={`answer-${exercise.id}`}>
                  Your answer: x =
                </label>
                <div className={base.answerRow}>
                  <input
                    id={`answer-${exercise.id}`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="e.g. −4"
                    value={answer}
                    className={base.answerInput}
                    onChange={(event) => {
                      setAnswers((previous) => ({
                        ...previous,
                        [exercise.id]: event.target.value,
                      }));
                      setResults((previous) => ({ ...previous, [exercise.id]: undefined }));
                    }}
                  />
                  <button className={base.checkButton} type="submit" disabled={!answer.trim()}>
                    Check
                  </button>
                  <button
                    className={base.hintButton}
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
                {hintVisible && <p className={base.hintText}>{exercise.hint}</p>}
                {checked !== undefined && (
                  <p className={checked ? base.correctText : base.retryText} role="status">
                    {checked
                      ? `Correct! ${exercise.method}`
                      : 'Not quite. Try again or open the hint.'}
                  </p>
                )}
              </form>
            );
          })}
        </div>
        <div className={base.exerciseFooter}>
          <p>Answers in this preview stay on this page and are not saved to your account yet.</p>
          <button
            className={base.hintButton}
            type="button"
            onClick={() => {
              setAnswers({});
              setResults({});
              setHints([]);
              setGuidedAnswer('');
              setGuidedChecked(undefined);
            }}
          >
            <RotateCcw aria-hidden="true" /> Start again
          </button>
        </div>
      </section>

      <section id="recap" className={styles.recap} aria-labelledby="recap-heading">
        <p className={styles.stepLabel}>05 / TAKE THIS WITH YOU</p>
        <h2 id="recap-heading">The four things to remember</h2>
        <ol>
          <li>Equal means both sides have the same value.</li>
          <li>Undo operations in reverse order.</li>
          <li>Do exactly the same thing to both sides.</li>
          <li>Substitute your answer into the original equation to check.</li>
        </ol>
        <p>You can return to the explanations above whenever you need them.</p>
      </section>
    </div>
  );
}
