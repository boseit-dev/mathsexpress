import { formatNumber } from '@/lib/format';
import { cx } from '@/lib/cx';
import { CoinIcon } from './CoinIcon';
import { VisuallyHidden } from './VisuallyHidden';
import styles from './CoinAmount.module.css';

interface CoinAmountProps {
  amount: number;
  /** Shown before the number, e.g. "+" for coins earned. */
  prefix?: string;
  className?: string;
}

/** A coin icon and amount, read by screen readers as e.g. "340 coins". */
export function CoinAmount({ amount, prefix = '', className }: CoinAmountProps) {
  return (
    <span className={cx(styles.amount, className)}>
      <CoinIcon className={styles.icon} />
      {prefix}
      {formatNumber(amount)}
      <VisuallyHidden>{amount === 1 ? ' coin' : ' coins'}</VisuallyHidden>
    </span>
  );
}
