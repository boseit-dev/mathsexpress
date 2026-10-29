import { Celebration } from '@/components/ui/Celebration';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';
import { checkNumericalAnswer, publishedLessons } from '@/domain/learning';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import styles from './Learning.module.css';

type Feedback = 'idle' | 'incorrect' | 'correct';

/** Real practice and marking. Account-based progress saving is a separate, upcoming phase. */
export function GuidedLessonPage() {
  const { lessonId } = useParams();
  const student = useCurrentStudent();
  const lesson = publishedLessons.find((item) => item.id === lessonId);
  const permitted = lesson && student.classes.some((item) => item.yearLevel === lesson.yearLevel);
  useDocumentTitle(lesson?.title ?? 'Lesson');
  useRefreshWhenVisible();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [hints, setHints] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [complete, setComplete] = useState(false);

  if (!lesson || !permitted) {
    return (
      <div className={styles.empty}>
        <h1>Lesson unavailable</h1>
        <p>This lesson isn’t published for your teacher-assigned year level.</p>
        <Link className={styles.primaryLink} to={paths.student.learn}>
          Back to Learn
        </Link>
      </div>
    );
  }

  const current = lesson.questions[index];
  if (!current) return null;
  const isLast = index === lesson.questions.length - 1;

  function checkAnswer() {
    if (!current || !answer.trim() || feedback === 'correct') return;
    if (checkNumericalAnswer(answer, current.solution)) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
      setMistakes((value) => value + 1);
    }
  }

  function nextQuestion() {
    if (feedback !== 'correct') return;
    if (isLast) {
      setComplete(true);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer('');
    setFeedback('idle');
    setHints(0);
  }

  function restart() {
    setIndex(0);
    setAnswer('');
    setFeedback('idle');
    setHints(0);
    setMistakes(0);
    setComplete(false);
  }

  return (
    <div className={styles.page}>
      <Link className={styles.backLink} to={paths.student.learn}>
        <ArrowLeft size={17} aria-hidden="true" /> All topics
      </Link>
      <header className={styles.lessonHeader}>
        <div className={styles.eyebrow}>GUIDED LESSON · {lesson.strand}</div>
        <h1>{lesson.title}</h1>
        <p>{lesson.introduction}</p>
      </header>
      {lesson.yearLevel === 9 && (
        <Link
          className={styles.textbookReturn}
          to={paths.student.textbookChapter('year-9', 'solving-linear-equations')}
        >
          <BookOpenCheck size={17} aria-hidden="true" />
          Read the matching textbook chapter
        </Link>
      )}
      <div className={styles.lessonColumns}>
        <section className={styles.teachingPanel} aria-labelledby="learn-concept-heading">
          <div className={styles.stepLabel}>
            <span>01</span> Understand the idea
          </div>
          <h2 id="learn-concept-heading">Let's learn</h2>
          <p>{lesson.keyIdea}</p>
          <div className={styles.exampleBox}>
            <div className={styles.stepLabel}>
              <span>02</span> Worked example
            </div>
            <ol className={styles.exampleSteps}>
              {lesson.workedExample.map((step, i) => (
                <li key={step}>
                  <span className={styles.stepNumber}>{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className={styles.practicePanel} aria-labelledby="try-it-heading">
          {complete ? (
            <div className={styles.summary} aria-live="polite">
              <Celebration />
              <CheckCircle2 size={42} aria-hidden="true" className={styles.successIcon} />
              <h2 id="try-it-heading">Lesson completed!</h2>
              <p>You solved all {lesson.questions.length} questions.</p>
              <p className={styles.muted}>
                {mistakes === 0
                  ? 'All correct on the first try.'
                  : `${mistakes} incorrect ${mistakes === 1 ? 'attempt' : 'attempts'} along the way. Your practice helped you improve.`}
              </p>
              <div className={styles.note}>
                This session is not saved to your account yet. Account-based progress saving is
                coming next.
              </div>
              <div className={styles.actions}>
                <Button onClick={restart} variant="secondary">
                  <RotateCcw size={17} aria-hidden="true" /> Practise again
                </Button>
                <Link className={styles.primaryLink} to={paths.student.learn}>
                  Back to topics <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.progressHeader}>
                <div className={styles.stepLabel}>
                  <span>03</span> Your turn
                </div>
                <span>
                  {index + 1} / {lesson.questions.length}
                </span>
              </div>
              <div
                className={styles.progressTrack}
                role="progressbar"
                aria-label="Lesson question progress"
                aria-valuenow={index}
                aria-valuemin={0}
                aria-valuemax={lesson.questions.length}
              >
                <div style={{ width: `${(index / lesson.questions.length) * 100}%` }} />
              </div>
              <h2 id="try-it-heading">Find the value of x</h2>
              <div
                key={index}
                className={styles.question}
                aria-label={`Equation: ${current.expression}`}
              >
                {current.expression}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  checkAnswer();
                }}
              >
                <label className={styles.answerLabel} htmlFor="lesson-answer">
                  Your answer
                </label>
                <div className={styles.answerRow}>
                  <span>x =</span>
                  <input
                    id="lesson-answer"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={answer}
                    disabled={feedback === 'correct'}
                    onChange={(event) => {
                      setAnswer(event.target.value);
                      setFeedback('idle');
                    }}
                    aria-describedby="answer-help"
                    placeholder="Enter a number"
                  />
                </div>
                <p id="answer-help" className={styles.muted}>
                  You can enter negative numbers, such as −3.
                </p>
                {feedback === 'incorrect' && (
                  <div className={styles.incorrect} role="status">
                    Not quite. Check your working and try again. You can use a hint below.
                  </div>
                )}
                {hints > 0 && (
                  <div className={styles.hint} role="status">
                    <Lightbulb size={18} aria-hidden="true" />{' '}
                    <span>{hints === 1 ? current.hint : current.secondHint}</span>
                  </div>
                )}
                {feedback === 'correct' && (
                  <div className={styles.correct} role="status">
                    <CheckCircle2 size={19} aria-hidden="true" /> Correct! Here's why:
                    <ol>
                      {current.explanation.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                <div className={styles.actions}>
                  {feedback !== 'correct' && (
                    <Button
                      variant="secondary"
                      disabled={hints === 2}
                      onClick={() => {
                        setHints((value) => Math.min(value + 1, 2));
                      }}
                    >
                      <Lightbulb size={17} aria-hidden="true" />{' '}
                      {hints === 0 ? 'Get a hint' : hints === 1 ? 'Another hint' : 'Hints shown'}
                    </Button>
                  )}
                  {feedback === 'correct' ? (
                    <Button onClick={nextQuestion}>
                      {isLast ? 'Finish lesson' : 'Next question'}{' '}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!answer.trim()}>
                      Check answer <ArrowRight size={17} aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </form>
              <p className={styles.sessionNote}>
                <Sparkles size={15} aria-hidden="true" /> Practice is interactive. Your progress is
                not saved to your account in this first build.
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
