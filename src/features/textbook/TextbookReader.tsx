import { BookOpenText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { paths } from '@/config/paths';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import type { TextbookBook, TextbookChapter } from './catalogue';
import { LinearEquationsChapter } from './LinearEquationsChapter';
import styles from './TextbookReader.module.css';

interface Props {
  book: TextbookBook;
  chapter: TextbookChapter;
}

/** A MathsExpress study notebook, not a tabbed question bank. */
export function TextbookReader({ book, chapter }: Props) {
  const student = useCurrentStudent();
  const isPilot = book.id === 'year-9' && chapter.id === 'solving-linear-equations';
  const chapterIndex = book.chapters.findIndex((item) => item.id === chapter.id);
  const previous = book.chapters[chapterIndex - 1];
  const next = book.chapters[chapterIndex + 1];
  const canPractise = student.classes.some((classroom) => classroom.yearLevel === 9);

  return (
    <article className={styles.notebook}>
      <div className={styles.topLine}>
        <Link className={styles.back} to={paths.student.textbookBook(book.id)}>
          <ChevronLeft aria-hidden="true" /> {book.course} contents
        </Link>
        <span className={styles.brandTag}>
          <BookOpenText aria-hidden="true" /> MATHSEXPRESS STUDY NOTEBOOK
        </span>
      </div>

      <header className={styles.hero}>
        <p className={styles.eyebrow}>
          {book.stage} · {book.syllabus}
        </p>
        <h1>{chapter.title}</h1>
        <p className={styles.description}>
          {isPilot
            ? 'Discover why equations work, watch each step change the balance, and build confidence before answering questions.'
            : chapter.id === 'getting-started'
              ? 'A friendly guide to studying with your MathsExpress book.'
              : 'This is a syllabus topic outline. The teaching chapter has not been published yet.'}
        </p>
        {isPilot && (
          <div className={styles.objectives} aria-label="In this chapter you will learn">
            <strong>By the end, you can:</strong>
            <span>Explain what an equation means</span>
            <span>Undo operations in the right order</span>
            <span>Check that your solution works</span>
          </div>
        )}
      </header>

      {isPilot && (
        <nav className={styles.journey} aria-label="Jump to chapter section">
          <a href="#concept">01 · Discover</a>
          <a href="#method">02 · Learn</a>
          <a href="#guided">03 · Try together</a>
          <a href="#practice">04 · Practise</a>
          <a href="#recap">05 · Remember</a>
        </nav>
      )}

      <div className={styles.readingSurface}>
        {isPilot ? (
          <LinearEquationsChapter />
        ) : chapter.id === 'getting-started' ? (
          <section className={styles.notice}>
            <h2>How to learn from this book</h2>
            <p>
              Start by reading a topic's explanation. Explore its examples, work through a
              question with guidance, then try the independent exercises when you feel ready.
            </p>
            <p>
              NSW syllabus stages guide these outlines. Your teacher decides how and when topics
              are taught; the order in these books is not an official year-by-year requirement.
            </p>
            <a href={book.syllabusUrl} target="_blank" rel="noopener noreferrer">
              Check the official syllabus
            </a>
          </section>
        ) : (
          <section className={styles.notice}>
            <p className={styles.eyebrow}>NOT PUBLISHED YET</p>
            <h2>Lesson in preparation</h2>
            <p>
              This topic is included in your syllabus outline, but its teaching explanation,
              worked examples and exercises have not been reviewed or published.
            </p>
            <p>
              We only mark original, checked lessons as ready. You can browse another topic or
              read the official syllabus while this lesson is being written.
            </p>
            <a href={book.syllabusUrl} target="_blank" rel="noopener noreferrer">
              View the NSW syllabus
            </a>
          </section>
        )}
      </div>

      {isPilot && canPractise && (
        <div className={styles.learnLink}>
          <div>
            <strong>Want your practice recorded?</strong>
            <p>The notebook's answers stay on this page. Saved lesson progress lives in Learn.</p>
          </div>
          <Link to={paths.student.lesson('linear-equations-basics')}>
            Practise this topic in Learn <ChevronRight aria-hidden="true" />
          </Link>
        </div>
      )}

      <details className={styles.otherTopics}>
        <summary>Explore other topics in {book.course}</summary>
        <ul>
          {book.chapters.map((item) => (
            <li key={item.id}>
              <Link
                to={paths.student.textbookChapter(book.id, item.id)}
                aria-current={item.id === chapter.id ? 'page' : undefined}
              >
                {item.title}
              </Link>
              <span>{item.status === 'ready' ? 'Ready' : 'In preparation'}</span>
            </li>
          ))}
        </ul>
      </details>

      <nav className={styles.chapterNav} aria-label="Move between chapters">
        {previous ? (
          <Link to={paths.student.textbookChapter(book.id, previous.id)}>
            <ChevronLeft aria-hidden="true" /> Previous: {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={paths.student.textbookChapter(book.id, next.id)}>
            Next: {next.title} <ChevronRight aria-hidden="true" />
          </Link>
        )}
      </nav>
    </article>
  );
}
