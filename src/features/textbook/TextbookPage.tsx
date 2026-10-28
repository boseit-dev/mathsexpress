import { BookOpen, BookOpenCheck, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { paths } from '@/config/paths';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import { findTextbook, findTextbookChapter, textbookBooks, type TextbookBook } from './catalogue';
import { LinearEquationsChapter } from './LinearEquationsChapter';
import styles from './TextbookPage.module.css';

function BookCover({ book }: { book: TextbookBook }) {
  return (
    <div className={styles.cover} aria-hidden="true">
      <span>MathsExpress</span>
      <span className={styles.coverYear}>{book.year === 'K' ? 'K' : book.year}</span>
      <span className={styles.coverCourse}>
        {book.course.replace(/^Year \d+ /, '').replace(/^Kindergarten /, '')}
      </span>
      <span className={styles.coverMark}>＋ ○ △</span>
    </div>
  );
}

function LibraryView() {
  const student = useCurrentStudent();
  const [search, setSearch] = useState('');
  const ownYears = new Set(student.classes.map((membership) => membership.yearLevel));
  const matching = textbookBooks.filter((book) =>
    `${book.course} ${book.stage}`.toLowerCase().includes(search.toLowerCase().trim()),
  );
  const groups = [
    {
      title: 'Primary · Kindergarten to Year 6',
      list: matching.filter(
        (book) => book.year === 'K' || (typeof book.year === 'number' && book.year <= 6),
      ),
    },
    {
      title: 'Secondary · Years 7 to 10',
      list: matching.filter(
        (book) => typeof book.year === 'number' && book.year >= 7 && book.year <= 10,
      ),
    },
    {
      title: 'Senior · Years 11 and 12',
      list: matching.filter((book) => typeof book.year === 'number' && book.year >= 11),
    },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.libraryHeader}>
        <div>
          <p className={styles.kicker}>YOUR MATHEMATICS LIBRARY</p>
          <h1>Textbook</h1>
          <p>Explore original MathsExpress books, chapter guides and exercises.</p>
          <p className={styles.note}>
            The books are organised for NSW study. Your year level is still set by your teacher;
            browsing another book does not change it.
          </p>
        </div>
        <BookOpen className={styles.libraryIcon} aria-hidden="true" />
      </header>
      <label className={styles.searchLabel} htmlFor="book-search">
        <Search aria-hidden="true" /> Find a textbook
      </label>
      <input
        id="book-search"
        className={styles.searchInput}
        type="search"
        placeholder="Search year or course"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {matching.length === 0 && <p role="status">No textbooks match that search.</p>}
      {groups.map((group) =>
        group.list.length > 0 ? (
          <section key={group.title} className={styles.libraryGroup} aria-label={group.title}>
            <h2>{group.title}</h2>
            <div className={styles.bookGrid}>
              {group.list.map((book) => (
                <Link
                  className={styles.bookCard}
                  to={paths.student.textbookBook(book.id)}
                  key={book.id}
                >
                  <BookCover book={book} />
                  <span className={styles.bookTitle}>{book.course}</span>
                  <span className={styles.bookDetail}>
                    {book.stage} ·{' '}
                    {book.syllabus.includes('2022') ? '2022 syllabus' : '2024 syllabus'}
                  </span>
                  <span className={styles.bookStatus}>
                    {ownYears.has(book.year) ? 'Your assigned year · ' : ''}Open book{' '}
                    <ChevronRight aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null,
      )}
      <p className={styles.libraryNote}>
        Book catalogues are available now. Only the chapters marked “Ready” are published.
        Unfinished chapters do not contain generated or unverified answers.
      </p>
    </div>
  );
}

function BookDetail({ book }: { book: TextbookBook }) {
  return (
    <div className={styles.page}>
      <Link className={styles.backLink} to={paths.student.textbook}>
        <ChevronLeft aria-hidden="true" /> All textbooks
      </Link>
      <div className={styles.bookIntro}>
        <BookCover book={book} />
        <div className={styles.bookIntroText}>
          <p className={styles.kicker}>MATHSEXPRESS DIGITAL TEXTBOOK</p>
          <h1>{book.course}</h1>
          <p>
            {book.stage} · {book.syllabus}
          </p>
          <p>
            Every chapter is written for MathsExpress. Published content includes explanations,
            worked examples and practice exercises. Other chapters are still being prepared.
          </p>
          <a href={book.syllabusUrl} target="_blank" rel="noopener noreferrer">
            View the official NSW syllabus
          </a>
        </div>
      </div>
      <section className={styles.contents} aria-labelledby="contents-heading">
        <h2 id="contents-heading">Contents</h2>
        <ol className={styles.chapterList}>
          {book.chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <Link
                to={paths.student.textbookChapter(book.id, chapter.id)}
                className={styles.chapterLink}
              >
                <span className={styles.chapterNumber}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.chapterName}>{chapter.title}</span>
                <span className={chapter.status === 'ready' ? styles.ready : styles.planned}>
                  {chapter.status === 'ready' ? 'Ready' : 'In preparation'}
                </span>
                <ChevronRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ChapterView({ book, chapterId }: { book: TextbookBook; chapterId: string }) {
  const chapter = findTextbookChapter(book, chapterId);
  if (!chapter) return <MissingBook />;
  return (
    <div className={styles.page}>
      <Link className={styles.backLink} to={paths.student.textbookBook(book.id)}>
        <ChevronLeft aria-hidden="true" /> {book.course} contents
      </Link>
      <div className={styles.chapterIntro}>
        <p className={styles.kicker}>
          {book.course.toUpperCase()} · {book.stage.toUpperCase()}
        </p>
        <h1>{chapter.title}</h1>
        <p>{book.syllabus}</p>
      </div>
      {chapter.id === 'solving-linear-equations' && book.id === 'year-9' ? (
        <LinearEquationsChapter />
      ) : chapter.id === 'getting-started' ? (
        <section className={styles.lessonBlock}>
          <h2>How to use this book</h2>
          <p>
            Choose a chapter from the contents page. Read the explanation, follow the worked
            example, then try the questions yourself. Open a hint when you need help.
          </p>
          <p>
            Our books use the NSW syllabus as their reference, but chapter sequencing is chosen by
            MathsExpress and requires academic review before publication.
          </p>
          <a href={book.syllabusUrl} target="_blank" rel="noopener noreferrer">
            Check the official syllabus
          </a>
        </section>
      ) : (
        <section className={styles.lessonBlock}>
          <BookOpenCheck aria-hidden="true" className={styles.placeholderIcon} />
          <h2>Chapter in preparation</h2>
          <p>
            This chapter is listed in the contents, but its explanations and exercises have not yet
            been reviewed or published. We will not display unverified maths content.
          </p>
          <Link to={paths.student.textbookBook(book.id)}>Return to the contents</Link>
        </section>
      )}
    </div>
  );
}

function MissingBook() {
  return (
    <div className={styles.page}>
      <h1>Textbook page not found</h1>
      <p>This book or chapter is not in the library.</p>
      <Link to={paths.student.textbook}>Browse all textbooks</Link>
    </div>
  );
}

export function TextbookPage() {
  const { bookId, chapterId } = useParams();
  const book = findTextbook(bookId);
  const chapter = book ? findTextbookChapter(book, chapterId) : undefined;
  useDocumentTitle(chapter?.title ?? book?.course ?? 'Textbook');

  if (!bookId) return <LibraryView />;
  if (!book) return <MissingBook />;
  if (chapterId) return <ChapterView book={book} chapterId={chapterId} />;
  return <BookDetail book={book} />;
}
