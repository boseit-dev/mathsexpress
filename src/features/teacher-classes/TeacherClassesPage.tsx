import { Mascot } from '@/components/mascot/Mascot';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { CreateClassPanel } from './components/CreateClassPanel';
import { TeacherClassCard } from './components/TeacherClassCard';
import { useTeacherClassesData } from './teacherClassesHandlers';
import styles from './TeacherClassesPage.module.css';

/** The teacher's classes, and creating a new one. */
export function TeacherClassesPage() {
  const classes = useTeacherClassesData();
  useDocumentTitle('Classes');

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
              <Mascot pose="certificate" size={120} />
              <div className={styles.emptyText}>
                <p className={styles.emptyTitle}>You haven’t created a class yet</p>
                <p>
                  Create your first class to get a code. Students enter the code on their Class page
                  to join.
                </p>
              </div>
            </div>
          ) : (
            <ul className={styles.cards}>
              {classes.map((teacherClass) => (
                <li key={teacherClass.id}>
                  <TeacherClassCard teacherClass={teacherClass} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <CreateClassPanel />
      </div>
    </div>
  );
}
