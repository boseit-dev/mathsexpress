import type { ReactNode } from 'react';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './FormMessage.module.css';

interface FormMessageProps {
  tone: 'error' | 'success';
  children: ReactNode;
}

/** The result of submitting a form. Errors are announced immediately; successes politely. */
export function FormMessage({ tone, children }: FormMessageProps) {
  const Icon = tone === 'error' ? TriangleAlert : CircleCheck;
  return (
    <div className={cx(styles.message, styles[tone])} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon />
      <div>{children}</div>
    </div>
  );
}
