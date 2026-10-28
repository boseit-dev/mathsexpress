import type { ReactNode, Ref } from 'react';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { cx } from '@/lib/cx';
import styles from './FormMessage.module.css';

interface FormMessageProps {
  tone: 'error' | 'success';
  /**
   * The message. Render the component even when there is none yet: the live region stays in the
   * page, empty and taking no space, so screen readers announce the message when it appears.
   */
  children?: ReactNode;
  /** With tabIndex -1, lets a page move focus here when the control that was used goes away. */
  ref?: Ref<HTMLDivElement>;
  tabIndex?: number;
}

/** The result of submitting a form. Errors are announced immediately; successes politely. */
export function FormMessage({ tone, children, ref, tabIndex }: FormMessageProps) {
  const Icon = tone === 'error' ? TriangleAlert : CircleCheck;
  const hasMessage = children !== undefined && children !== null && children !== false;

  return (
    <div
      ref={ref}
      tabIndex={hasMessage ? tabIndex : undefined}
      className={hasMessage ? cx(styles.message, styles[tone]) : styles.empty}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {hasMessage && (
        <>
          <Icon />
          <div>{children}</div>
        </>
      )}
    </div>
  );
}
