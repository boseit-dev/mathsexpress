import type { YearLevel } from '@/domain/student';
import styles from './YearCrest.module.css';

/** A class's year level as a small badge. Decorative: the year level is always also in text. */
export function YearCrest({ yearLevel }: { yearLevel: YearLevel }) {
  return (
    <span className={styles.crest} aria-hidden="true">
      <span className={styles.label}>{yearLevel === 'K' ? 'Kindy' : 'Year'}</span>
      <span className={styles.value}>{yearLevel}</span>
    </span>
  );
}
