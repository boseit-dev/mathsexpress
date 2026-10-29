import { Mascot } from '@/components/mascot/Mascot';
import styles from './NoClassesYet.module.css';

export function NoClassesYet() {
  return (
    <div className={styles.empty}>
      <Mascot animation="peek" size={120} cycles={2} />
      <div className={styles.text}>
        <p className={styles.title}>You’re not in a class yet</p>
        <p>
          Ask your teacher for your class code, then enter it under <strong>Join a class</strong>.
          Your teacher will see you in their class straight away.
        </p>
      </div>
    </div>
  );
}
