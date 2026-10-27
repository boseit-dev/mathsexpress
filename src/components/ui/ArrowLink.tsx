import { ArrowRight } from 'lucide-react';
import { Link, type LinkProps } from 'react-router';
import { cx } from '@/lib/cx';
import styles from './ArrowLink.module.css';

/** A compact text link with a trailing arrow, used for "View all"-style links. */
export function ArrowLink({ children, className, ...props }: LinkProps) {
  return (
    <Link className={cx(styles.link, className)} {...props}>
      {children}
      <ArrowRight className={styles.icon} />
    </Link>
  );
}
