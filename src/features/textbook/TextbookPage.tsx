import { BookOpen, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { paths } from '@/config/paths';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import { findTextbook, findTextbookChapter, textbookBooks, type TextbookBook } from './catalogue';
import { TextbookReader } from './TextbookReader';
import styles from './TextbookPage.module.css';

function BookCover({ book }: { book: TextbookBook }) {
  return (
    <div
      className={styles.cover}
      data-palette={textbookBooks.findIndex((item) => item.id === book.id) % 5}
      aria-hidden="true"
    >
      <span>MathsExpress</span>
      <span className={styles.coverYear}>{book.year === 'K' ? 'K' : book.year}</span>
      <span className={styles.coverCourse}>
        {book.course.replace(/^Year \d+ /, '').replace(/^Kindergarten /, '')}
      </span>
      <span className={styles.coverMark}>＋ ○ △</span>
    </div>
  );
}

type LibraryFilter = 'all' | 'my-year' | 'with-lessons';

function hasPublishedMaths(book: TextbookBook): boolean {
  return book.chapters.some(
    (chapter) => chapter.status === 'ready' && chapter.id !== 'getting-started',
  );
}

function LibraryView() {
  const student = useCurrentStudent();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<LibraryFilter>('all');
  const ownYears = new Set(student.classes.map((membership) => membership.yearLevel));
  const matching = textbookBooks.filter((book) => {
    const queryMatches = `${book.course} ${book.stage}`
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    const filterMatches =
      filter === 'all' ||
      (filter === 'my-year' && ownYears.has(book.year)) ||
      (filter === 'with-lessons' && hasPublishedMaths(book));
    return queryMatches && filterMatches;
  });
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
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
      <div className={styles.libraryFilters} role="group" aria-label="Filter textbooks">
        <button
          type="button"
          className={styles.filterButton}
          aria-pressed={filter === 'all'}
          onClick={() => {
            setFilter('all');
          }}
        >
          All books
        </button>
        <button
          type="button"
          className={styles.filterButton}
          aria-pressed={filter === 'my-year'}
          onClick={() => {
            setFilter('my-year');
          }}
        >
          My year
        </button>
        <button
          type="button"
          className={styles.filterButton}
          aria-pressed={filter === 'with-lessons'}
          onClick={() => {
            setFilter('with-lessons');
          }}
        >
          Ready to learn
        </button>
      </div>
      <p className={styles.resultsCount} role="status">
        Showing {matching.length} of {textbookBooks.length} books
      </p>
      {matching.length === 0 && (
        <div className={styles.emptyResults}>
          <p>
            {filter === 'my-year' && ownYears.size === 0
              ? 'Join a class to see your teacher-assigned year.'
              : 'No books match these filters.'}
          </p>
          <button
            type="button"
            className={styles.resetFilters}
            onClick={() => {
              setSearch('');
              setFilter('all');
            }}
          >
            Show all books
          </button>
        </div>
      )}
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
                    {ownYears.has(book.year) ? 'Your assigned year · ' : ''}
                    {hasPublishedMaths(book) ? 'Lesson available · ' : 'Outline only · '}
                    Open book <ChevronRight aria-hidden="true" />
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
  const published = book.chapters.filter(
    (chapter) => chapter.status === 'ready' && chapter.id !== 'getting-started',
  );
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
            {published.length === 0
              ? 'This book has an outline and a getting-started guide. Its maths lessons are still in preparation.'
              : `${published.length} maths ${published.length === 1 ? 'chapter is' : 'chapters are'} ready. Other chapters are still in preparation.`}
          </p>
          {published[0] && (
            <Link
              className={styles.startChapter}
              to={paths.student.textbookChapter(book.id, published[0].id)}
            >
              Start reading {published[0].title} <ChevronRight aria-hidden="true" />
            </Link>
          )}
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
  return <TextbookReader key={book.id + '/' + chapter.id} book={book} chapter={chapter} />;
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
