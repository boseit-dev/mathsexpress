import { formatJoinCode } from '@/domain/classes';
import { cx } from '@/lib/cx';
import styles from './JoinCode.module.css';

interface JoinCodeProps {
  code: string;
  size?: 'small' | 'large';
}

/** A class code, in two easy-to-read groups ("ABCD-2345"). */
export function JoinCode({ code, size = 'small' }: JoinCodeProps) {
  return <span className={cx(styles.code, styles[size])}>{formatJoinCode(code)}</span>;
}
