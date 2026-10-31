import { useState } from 'react';
import { CheckCircle2, CircleHelp, RotateCcw } from 'lucide-react';
import { checkNotebookAnswer, type NotebookLesson } from './notebookLessons';
import styles from './TeachingChapter.module.css';
import base from './TextbookPage.module.css';

/** Reusable, concept-first five-part reader for original NSW starter lessons. */
export function StructuredNotebookChapter({ lesson }: { lesson: NotebookLesson }) {
  const [guidedAnswer, setGuidedAnswer] = useState('');
  const [guidedChecked, setGuidedChecked] = useState<boolean | undefined>();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean | undefined>>({});
  const [hints, setHints] = useState<readonly number[]>([]);
  const correct = lesson.practice.filter((_, index) => checked[index]).length;
  return (
    <div className={styles.chapter}>
      <section id="concept" className={styles.section} aria-labelledby="starter-concept">
        <p className={styles.stepLabel}>01 / DISCOVER THE IDEA</p>
        <h2 id="starter-concept">{lesson.title}</h2>
        <p className={styles.lead}>{lesson.concept}</p>
        <div className={styles.explorer}>
          <strong>See the pattern</strong>
          <p className={styles.visualMath}>{lesson.visual}</p>
          <div className={styles.bigIdea}>
            <strong>Why it works</strong>
            <p>{lesson.principle}</p>
          </div>
        </div>
      </section>

      <section id="method" className={styles.section} aria-labelledby="starter-method">
        <p className={styles.stepLabel}>02 / WATCH IT WORK</p>
        <h2 id="starter-method">One worked example, explained</h2>
        <div className={styles.worked}>
          <p className={styles.exampleTag}>WORKED EXAMPLE</p>
          <h3>{lesson.example}</h3>
          <ol className={styles.solutionSteps}>
            {lesson.steps.map((step, index) => (
              <li key={index}>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
        <p>Read each step and explain it in your own words before continuing.</p>
      </section>

      <section id="guided" className={styles.section} aria-labelledby="starter-guided">
        <p className={styles.stepLabel}>03 / TRY TOGETHER</p>
        <h2 id="starter-guided">Try one with support</h2>
        <p className={styles.lead}>{lesson.guided.prompt}</p>
        <form
          className={styles.guidedCard}
          onSubmit={(event) => {
            event.preventDefault();
            setGuidedChecked(checkNotebookAnswer(guidedAnswer, lesson.guided.answer));
          }}
        >
          <label htmlFor="starter-guided-answer">Your answer</label>
          <div className={styles.guidedInputRow}>
            <input
              id="starter-guided-answer"
              value={guidedAnswer}
              inputMode="decimal"
              autoComplete="off"
              placeholder="Enter a number"
              onChange={(event) => {
                setGuidedAnswer(event.target.value);
                setGuidedChecked(undefined);
              }}
            />
            <button type="submit" disabled={!guidedAnswer.trim()}>
              Check this step
            </button>
          </div>
          <details>
            <summary>Need a clue?</summary>
            <p>{lesson.guided.hint}</p>
          </details>
          {guidedChecked !== undefined && (
            <p role="status" className={guidedChecked ? styles.guidedSuccess : styles.guidedRetry}>
              {guidedChecked
                ? 'That is correct! ' + lesson.guided.explanation
                : 'Not yet. ' + lesson.guided.hint}
            </p>
          )}
        </form>
      </section>

      <section id="practice" className={styles.section} aria-labelledby="starter-practice">
        <p className={styles.stepLabel}>04 / PRACTISE</p>
        <div className={base.exerciseHeading}>
          <div>
            <h2 id="starter-practice">Try it independently</h2>
            <p>There is no timer. Check your answers and use a hint if you get stuck.</p>
          </div>
          <p className={base.score}>
            {correct} / {lesson.practice.length} correct
          </p>
        </div>
        <div className={base.exerciseList}>
          {lesson.practice.map((exercise, index) => {
            const input = answers[index] ?? '';
            const result = checked[index];
            const hintVisible = hints.includes(index);
            return (
              <form
                className={base.question}
                key={index}
                onSubmit={(event) => {
                  event.preventDefault();
                  setChecked((before) => ({
                    ...before,
                    [index]: checkNotebookAnswer(input, exercise.answer),
                  }));
                }}
              >
                <div className={base.questionTop}>
                  <span className={base.questionNumber}>{index + 1}.</span>
                  <strong>{exercise.prompt}</strong>
                  {result && <CheckCircle2 aria-label="Correct" className={base.correctIcon} />}
                </div>
                <label className={base.answerLabel} htmlFor={'starter-answer-' + String(index)}>
                  Your answer
                </label>
                <div className={base.answerRow}>
                  <input
                    id={'starter-answer-' + String(index)}
                    className={base.answerInput}
                    inputMode="decimal"
                    type="text"
                    autoComplete="off"
                    value={input}
                    onChange={(event) => {
                      setAnswers((before) => ({ ...before, [index]: event.target.value }));
                      setChecked((before) => ({ ...before, [index]: undefined }));
                    }}
                  />
                  <button type="submit" className={base.checkButton} disabled={!input.trim()}>
                    Check
                  </button>
                  <button
                    type="button"
                    className={base.hintButton}
                    aria-expanded={hintVisible}
                    onClick={() => {
                      setHints((before) =>
                        before.includes(index)
                          ? before.filter((item) => item !== index)
                          : [...before, index],
                      );
                    }}
                  >
                    <CircleHelp aria-hidden="true" /> Hint
                  </button>
                </div>
                {hintVisible && <p className={base.hintText}>{exercise.hint}</p>}
                {result !== undefined && (
                  <p role="status" className={result ? base.correctText : base.retryText}>
                    {result ? 'Correct! ' + exercise.explanation : 'Try again. ' + exercise.hint}
                  </p>
                )}
              </form>
            );
          })}
        </div>
        <div className={base.exerciseFooter}>
          <p>These textbook answers are local to this page and are not saved to your account.</p>
          <button
            type="button"
            className={base.hintButton}
            onClick={() => {
              setGuidedAnswer('');
              setGuidedChecked(undefined);
              setAnswers({});
              setChecked({});
              setHints([]);
            }}
          >
            <RotateCcw aria-hidden="true" /> Start again
          </button>
        </div>
      </section>

      <section id="recap" className={styles.recap} aria-labelledby="starter-recap">
        <p className={styles.stepLabel}>05 / REMEMBER THIS</p>
        <h2 id="starter-recap">Your quick summary</h2>
        <ol>
          {lesson.recap.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ol>
        <p>Return to the worked example whenever you need to review the method.</p>
      </section>
    </div>
  );
}
