import { useMemo, useState } from 'react';
import { School } from 'lucide-react';
import { IconTile } from '@/components/ui/IconTile';
import { PageHeader } from '@/components/ui/PageHeader';
import { TableToolbar } from '@/components/ui/TableToolbar';
import type { TeacherClass } from '@/domain/classes';
import { formatYearLevel, yearLevelToNumber } from '@/domain/student';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatCount } from '@/lib/format';
import { CreateClassPanel } from './components/CreateClassPanel';
import { TeacherClassCard } from './components/TeacherClassCard';
import { useTeacherClassesData } from './teacherClassesHandlers';
import styles from './TeacherClassesPage.module.css';

const SORTS = {
  name: {
    label: 'Name',
    compare: (a: TeacherClass, b: TeacherClass) =>
      a.name.localeCompare(b.name, undefined, { numeric: true }),
  },
  yearLevel: {
    label: 'Year level',
    compare: (a: TeacherClass, b: TeacherClass) =>
      yearLevelToNumber(a.yearLevel) - yearLevelToNumber(b.yearLevel) ||
      a.name.localeCompare(b.name, undefined, { numeric: true }),
  },
  students: {
    label: 'Most students',
    compare: (a: TeacherClass, b: TeacherClass) => b.studentCount - a.studentCount,
  },
  newest: {
    label: 'Newest',
    compare: (a: TeacherClass, b: TeacherClass) => b.createdAt.localeCompare(a.createdAt),
  },
} as const;

type SortKey = keyof typeof SORTS;

/** The teacher's classes, and creating a new one. */
export function TeacherClassesPage() {
  const classes = useTeacherClassesData();
  useDocumentTitle('Classes');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return classes
      .filter(
        (item) =>
          !needle ||
          item.name.toLowerCase().includes(needle) ||
          formatYearLevel(item.yearLevel).toLowerCase().includes(needle),
      )
      .sort(SORTS[sort].compare);
  }, [classes, query, sort]);

  return (
    <div className={styles.page}>
      <PageHeader title="Classes">
        <p>
          Create a class for each group you teach and share its code with your students. Open a
          class to see who has joined and set each student’s year level.
        </p>
      </PageHeader>

      <div className={styles.columns}>
        <section className={styles.list} aria-labelledby="your-classes-heading">
          <h2 id="your-classes-heading" className={styles.sectionTitle}>
            Your classes
          </h2>
          {classes.length === 0 ? (
            <div className={styles.empty}>
              <IconTile icon={School} size="large" />
              <div className={styles.emptyText}>
                <p className={styles.emptyTitle}>You haven’t created a class yet</p>
                <p>
                  Create your first class to get a code. Students enter the code on their Class page
                  to join.
                </p>
              </div>
            </div>
          ) : (
            <>
              {classes.length > 1 && (
                <TableToolbar
                  searchLabel="Search classes"
                  query={query}
                  onQueryChange={setQuery}
                  sortLabel="Sort classes by"
                  sort={sort}
                  sortOptions={Object.entries(SORTS).map(([value, { label }]) => ({
                    value,
                    label,
                  }))}
                  onSortChange={(value) => {
                    setSort(value as SortKey);
                  }}
                  summary={
                    query.trim()
                      ? `${formatCount(shown.length, 'class')} of ${classes.length} match`
                      : undefined
                  }
                />
              )}
              {shown.length === 0 ? (
                <p className={styles.noMatch}>No classes match “{query.trim()}”.</p>
              ) : (
                <ul className={styles.cards}>
                  {shown.map((teacherClass) => (
                    <li key={teacherClass.id}>
                      <TeacherClassCard teacherClass={teacherClass} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        {/* Linked from the home page's "Create a class". */}
        <div id="create-class" className={styles.create}>
          <CreateClassPanel />
        </div>
      </div>
    </div>
  );
}
