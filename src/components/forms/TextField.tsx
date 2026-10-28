import { useId, type ComponentPropsWithoutRef } from 'react';
import { cx } from '@/lib/cx';
import styles from './Field.module.css';

export interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'id'> {
  label: string;
  name: string;
  /** Guidance shown under the label, e.g. the password rules. */
  hint?: string;
  /** An error for this field. The input is marked invalid and the message is read with it. */
  error?: string | null;
}

/** A labelled text input whose hint and error are announced together with it. */
export function TextField({ label, hint, error, className, ...inputProps }: TextFieldProps) {
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
      <input
        id={id}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
