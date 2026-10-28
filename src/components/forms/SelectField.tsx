import { useId, type ComponentPropsWithoutRef } from 'react';
import { cx } from '@/lib/cx';
import styles from './Field.module.css';

interface SelectFieldProps extends Omit<ComponentPropsWithoutRef<'select'>, 'id' | 'children'> {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
  hint?: string;
  /** An error for this field. The select is marked invalid and the message is read with it. */
  error?: string | null;
  /** Show the label to screen readers only, e.g. in a table row that already names it. */
  hideLabel?: boolean;
}

export function SelectField({
  label,
  options,
  hint,
  error,
  hideLabel,
  className,
  ...selectProps
}: SelectFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={hideLabel ? styles.visuallyHidden : styles.label}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <select
        id={id}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
