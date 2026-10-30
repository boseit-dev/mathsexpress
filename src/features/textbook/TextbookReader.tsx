import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ListChecks,
  NotebookText,
  RotateCcw,
  Search,
  SidebarClose,
  SidebarOpen,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { paths } from '@/config/paths';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import type { TextbookBook, TextbookChapter } from './catalogue';
import { LinearEquationsChapter } from './LinearEquationsChapter';
import styles from './TextbookReader.module.css';

type ReaderTab = 'lesson' | 'questions' | 'activity' | 'revision';

const tabs = [
  { id: 'lesson', label: 'Lesson', icon: BookOpen },
  { id: 'questions', label: 'Questions', icon: ListChecks },
  { id: 'activity', label: 'My activity', icon: NotebookText },
  { id: 'revision', label: 'Revision', icon: RotateCcw },
] as const;

interface Props {
  book: TextbookBook;
  chapter: TextbookChapter;
}

export function TextbookReader({ book, chapter }: Props) {
  const student = useCurrentStudent();
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState<ReaderTab>('lesson');
  const isPilot = book.id === 'year-9' && chapter.id === 'solving-linear-equations';
  const chapterIndex = book.chapters.findIndex((item) => item.id === chapter.id);
  const previous = book.chapters[chapterIndex - 1];
  const next = book.chapters[chapterIndex + 1];
  const canPractice = student.classes.some((membership) => membership.yearLevel === 9);

  const groups = useMemo(() => {
    const matching = book.chapters.filter((item) =>
      item.title.toLowerCase().includes(search.trim().toLowerCase()),
    );
    const results = new Map<string, TextbookChapter[]>();
    for (const item of matching) {
      const group = item.strand ?? 'Start here';
      results.set(group, [...(results.get(group) ?? []), item]);
    }
    return Array.from(results.entries());
  }, [book, search]);

  return (
    <div className={styles.reader} data-sidebar-open={sidebarOpen}>
      <div className={styles.readerTop}>
        <Link to={paths.student.textbookBook(book.id)} className={styles.back}>
          <ChevronLeft aria-hidden="true" /> {book.course}
        </Link>
        <button
          className={styles.sidebarToggle}
          type="button"
          onClick={() => setSidebarOpen((value) => !value)}
          aria-label={sidebarOpen ? 'Hide textbook contents' : 'Show textbook contents'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <SidebarClose aria-hidden="true" /> : <SidebarOpen aria-hidden="true" />}
          {sidebarOpen ? 'Hide contents' : 'Show contents'}
        </button>
      </div>
      <div className={styles.readerGrid}>
        {sidebarOpen && (
          <aside className={styles.sidebar} aria-label="Textbook topics">
            <div className={styles.sidebarHeading}>
              <p className={styles.eyebrow}>YOUR TEXTBOOK</p>
              <h2>{book.course}</h2>
              <p>{book.stage}</p>
            </div>
            <label className={styles.searchLabel} htmlFor="textbook-topic-search">
              <Search aria-hidden="true" /> Search topics
            </label>
            <input
              id="textbook-topic-search"
              className={styles.search}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a topic"
            />
            <nav aria-label="Choose a textbook chapter" className={styles.chapterLinks}>
              {groups.length === 0 && <p className={styles.noTopics}>No matching topics.</p>}
              {groups.map(([heading, chapters]) => (
                <section key={heading} className={styles.topicGroup}>
                  <h3>{heading}</h3>
                  <ol>
                    {chapters.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={paths.student.textbookChapter(book.id, item.id)}
                          className={styles.topicLink}
                          aria-current={item.id === chapter.id ? 'page' : undefined}
                        >
                          <span className={styles.topicName}>{item.title}</span>
                          <span
                            className={
                              item.status === 'ready' ? styles.readyDot : styles.plannedDot
                            }
                          >
                            {item.status === 'ready' ? 'Ready' : 'Planned'}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </nav>
            <p className={styles.sidebarNote}>
              These are stage and course focus areas. Only topics marked Ready contain finished
              lessons.
            </p>
          </aside>
        )}
        <div className={styles.mainColumn}>
          <header className={styles.lessonHeader}>
            <div>
              <p className={styles.eyebrow}>
                {book.stage} · {book.syllabus}
              </p>
              <h1>{chapter.title}</h1>
              <p className={styles.topicStatus}>
                {chapter.status === 'ready'
                  ? 'Lesson available'
                  : 'Topic outline · Lesson in preparation'}
              </p>
            </div>
          </header>
          {isPilot && (
            <div className={styles.tabs} role="tablist" aria-label="Textbook section">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  role="tab"
                  id={'tab-' + id}
                  aria-controls={id === 'questions' ? 'panel-lesson' : 'panel-' + id}
                  aria-selected={tab === id}
                  className={styles.tab}
                  onClick={() => setTab(id)}
                >
                  <Icon aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          )}
          <div className={styles.paper}>
            <div
              role={isPilot ? 'tabpanel' : undefined}
              id={isPilot ? 'panel-lesson' : undefined}
              aria-labelledby={
                isPilot ? (tab === 'questions' ? 'tab-questions' : 'tab-lesson') : undefined
              }
              hidden={isPilot && tab !== 'lesson' && tab !== 'questions'}
              className={styles.readingContent}
            >
              {isPilot ? (
                <LinearEquationsChapter view={tab === 'questions' ? 'questions' : 'all'} />
              ) : chapter.id === 'getting-started' ? (
                <section className={styles.readerNotice}>
                  <h2>How to use this MathsExpress textbook</h2>
                  <p>
                    Find a topic in the contents, read the explanation, follow original worked
                    examples and practise at your own pace.
                  </p>
                  <p>
                    NSW stages guide these book outlines. Your teacher decides which concepts to
                    teach and when.
                  </p>
                  <a href={book.syllabusUrl} target="_blank" rel="noopener noreferrer">
                    View the official NSW syllabus
                  </a>
                </section>
              ) : (
                <section className={styles.readerNotice}>
                  <CircleHelp aria-hidden="true" />
                  <h2>Lesson in preparation</h2>
                  <p>
                    This focus area is part of the book's topic outline, but an original
                    explanation, worked examples and reviewed questions have not been published yet.
                  </p>
                  <p>
                    We do not label unfinished maths content as complete. You can browse another
                    topic or open the official syllabus.
                  </p>
                  <a href={book.syllabusUrl} target="_blank" rel="noopener noreferrer">
                    View the NSW syllabus
                  </a>
                </section>
              )}
            </div>
            {isPilot && (
              <>
                <section
                  role="tabpanel"
                  id="panel-activity"
                  aria-labelledby="tab-activity"
                  hidden={tab !== 'activity'}
                  className={styles.readerNotice}
                >
                  <h2>My activity</h2>
                  <p>
                    Textbook question answers currently stay in this browser session; they are not
                    saved to your account or included in your teacher's reports.
                  </p>
                  <p>For saved learning progress, use the published guided lesson in Learn.</p>
                  {canPractice && (
                    <Link to={paths.student.lesson('linear-equations-basics')}>
                      Open guided lesson <ChevronRight aria-hidden="true" />
                    </Link>
                  )}
                </section>
                <section
                  role="tabpanel"
                  id="panel-revision"
                  aria-labelledby="tab-revision"
                  hidden={tab !== 'revision'}
                  className={styles.readerNotice}
                >
                  <p className={styles.eyebrow}>QUICK REVISION</p>
                  <h2>Solving linear equations</h2>
                  <p>
                    An equation is balanced when its two sides have the same value. To solve it, use
                    inverse operations on both sides.
                  </p>
                  <ol>
                    <li>Combine like terms when necessary.</li>
                    <li>Undo addition or subtraction.</li>
                    <li>Undo multiplication or division.</li>
                    <li>Substitute your answer to check it.</li>
                  </ol>
                  <details>
                    <summary>Example: Solve 4x − 7 = 21</summary>
                    <p>
                      Add 7 to both sides: 4x = 28. Divide both sides by 4: x = 7. Check: 4 × 7 − 7
                      = 21.
                    </p>
                  </details>
                </section>
              </>
            )}
          </div>
          {isPilot && canPractice && (
            <Link to={paths.student.lesson('linear-equations-basics')} className={styles.practice}>
              Practise this topic in Learn <ChevronRight aria-hidden="true" />
            </Link>
          )}
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
        </div>
      </div>
    </div>
  );
}
