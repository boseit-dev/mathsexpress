import { Avatar } from '@/components/ui/Avatar';
import { CoinAmount } from '@/components/ui/CoinAmount';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { getFullName } from '@/domain/people';
import type { CurrentStudent } from '@/domain/student';
import styles from './StudentAccount.module.css';

/** Coin balance and avatar shown at the end of the student header. */
export function StudentAccount({ student }: { student: CurrentStudent }) {
  return (
    <div className={styles.account}>
      <p className={styles.coins}>
        <VisuallyHidden>Coin balance: </VisuallyHidden>
        <CoinAmount amount={student.coinBalance} />
      </p>
      <Avatar name={getFullName(student)} />
    </div>
  );
}
