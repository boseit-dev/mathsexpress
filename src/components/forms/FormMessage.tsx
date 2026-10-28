import type { ReactNode, Ref } from 'react';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './FormMessage.module.css';

interface FormMessageProps {
  tone: 'error' | 'success';
  children: ReactNode;
  /** With tabIndex -1, lets a page move focus here when the control that was used goes away. */
  ref?: Ref<HTMLDivElement>;
  tabIndex?: number;
}

/** The result of submitting a form. Errors are announced immediately; successes politely. */
export function FormMessage({ tone, children, ref, tabIndex }: FormMessageProps) {
  const Icon = tone === 'error' ? TriangleAlert : CircleCheck;
  return (
    <div
      ref={ref}
      tabIndex={tabIndex}
      className={cx(styles.message, styles[tone])}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <Icon />
      <div>{children}</div>
    </div>
  );
}
