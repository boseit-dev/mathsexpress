import { useId, type ComponentPropsWithoutRef } from 'react';
import { cx } from '@/lib/cx';
import styles from './Field.module.css';

export interface TextAreaFieldProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'id'> {
  label: string;
  name: string;
  hint?: string;
  error?: string | null;
}

/** A labelled multi-line text box whose hint and error are announced with it. */
export function TextAreaField({ label, hint, error, className, ...props }: TextAreaFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <textarea
        id={id}
        className={cx(styles.control, styles.textarea)}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
