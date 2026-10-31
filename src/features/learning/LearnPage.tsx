import { ArrowRight, BookOpenCheck, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Mascot } from '@/components/mascot/Mascot';
import { cx } from '@/lib/cx';
import { paths } from '@/config/paths';
import { lessonsForYear } from '@/domain/learning';
import { formatYearLevel } from '@/domain/student';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import styles from './Learning.module.css';

/** Published lessons are visible only for year levels a teacher has assigned in a joined class. */
export function LearnPage() {
  const student = useCurrentStudent();
  const [search, setSearch] = useState('');
  useDocumentTitle('Learn');
  useRefreshWhenVisible();
  const classes = student.classes;
  const assignedYears = [...new Set(classes.map((item) => item.yearLevel))];
  const lessons = assignedYears.flatMap((year) => lessonsForYear(year));
  const uniqueLessons = [...new Map(lessons.map((lesson) => [lesson.id, lesson])).values()];
  const query = search.trim().toLowerCase();
  const matchingLessons = uniqueLessons.filter((lesson) =>
    [lesson.title, lesson.strand, lesson.introduction].some((text) =>
      text.toLowerCase().includes(query),
    ),
  );

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.eyebrow}>
          <GraduationCap aria-hidden="true" size={18} /> Your learning space
        </div>
        <h1>Learn</h1>
        <p>
          Learn maths with confidence. Clear explanations, worked examples and practice that helps
          you understand each step.
        </p>
      </header>
      {classes.length === 0 ? (
        <section className={styles.empty} aria-labelledby="no-class-heading">
          <Mascot animation="peek" size={130} cycles={2} />
          <h2 id="no-class-heading">Join a class to get started</h2>
          <p>Your teacher will set your year level when you join. You cannot change it yourself.</p>
          <Link className={styles.primaryLink} to={paths.student.class}>
            Join a class <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <>
          <section className={styles.yearPanel} aria-label="Your teacher-assigned years">
            <div>
              <span className={styles.miniLabel}>YOUR LEARNING LEVEL</span>
              <p className={styles.yearTitle}>{assignedYears.map(formatYearLevel).join(' · ')}</p>
              <p className={styles.muted}>
                Set by your teacher. Your available lessons match your classes.
              </p>
            </div>
            <div className={styles.yearIcon}>
              <BookOpenCheck size={28} aria-hidden="true" />
            </div>
          </section>
          {assignedYears.includes(9) && (
            <div className={styles.textbookBridge}>
              <div>
                <strong>Read it in your textbook</strong>
                <p>Revise linear equations with worked examples before practising.</p>
              </div>
              <Link to={paths.student.textbookChapter('year-9', 'solving-linear-equations')}>
                Open Year 9 chapter <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          )}
          <section aria-labelledby="topics-heading">
            <div className={styles.sectionHeader}>
              <div>
                <h2 id="topics-heading">Explore topics</h2>
                <p>Only lessons that are ready to learn are listed here.</p>
              </div>
              <span className={styles.count}>
                {matchingLessons.length} of {uniqueLessons.length} available
              </span>
            </div>
            {uniqueLessons.length > 0 && (
              <div className={styles.lessonSearch}>
                <label htmlFor="lesson-search">Find a lesson</label>
                <input
                  id="lesson-search"
                  type="search"
                  placeholder="Search topics or strands"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                />
                {search && (
                  <button type="button" onClick={() => {
                      setSearch('');
                    }}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
            {uniqueLessons.length === 0 ? (
              <div className={styles.empty}>
                <Mascot animation="reading" size={120} cycles={2} />
                <h3>Lessons for your year are being prepared</h3>
                <p>
                  There is no published lesson for your assigned year yet. Your class and year level
                  are saved.
                </p>
              </div>
            ) : matchingLessons.length === 0 ? (
              <div className={styles.empty} role="status">
                <h3>No lessons found</h3>
                <p>Try a different word or clear your search.</p>
                <button
                  type="button"
                  className={styles.primaryLink}
                  onClick={() => {
                    setSearch('');
                  }}
                >
                  Show all lessons
                </button>
              </div>
            ) : (
              <div className={styles.lessonGrid}>
                {matchingLessons.map((lesson) => (
                  <article className={styles.lessonCard} key={lesson.id}>
                    <div className={styles.cardArt} aria-hidden="true">
                      <span className={styles.equationArt}>3x + 5 = 20</span>
                      <span className={styles.artCircle}>x = ?</span>
                      {/* Reads quietly; on hover or keyboard focus it stands and points at the topic. */}
                      <Mascot className={styles.cardMascot} pose="reading" size={104} />
                      <Mascot
                        className={cx(styles.cardMascot, styles.cardMascotPointing)}
                        pose="pointing"
                        view="front-left"
                        size={104}
                      />
                    </div>
                    <div className={styles.cardBody}>
                      <span className={styles.miniLabel}>
                        {lesson.strand} · {formatYearLevel(lesson.yearLevel)}
                      </span>
                      <h3>{lesson.title}</h3>
                      <p>{lesson.introduction}</p>
                      <div className={styles.cardFooter}>
                        <span>
                          {lesson.questions.length} questions · {lesson.estimatedMinutes} min
                        </span>
                        <Link className={styles.primaryLink} to={paths.student.lesson(lesson.id)}>
                          Start lesson <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
