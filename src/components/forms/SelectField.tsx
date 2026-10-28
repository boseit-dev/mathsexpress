import { useId, type ComponentPropsWithoutRef } from 'react';
import { cx } from '@/lib/cx';
import styles from './Field.module.css';

interface SelectFieldProps extends Omit<ComponentPropsWithoutRef<'select'>, 'id' | 'children'> {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
  hint?: string;
  /** Show the label to screen readers only, e.g. in a table row that already names it. */
  hideLabel?: boolean;
}

export function SelectField({
  label,
  options,
  hint,
  hideLabel,
  className,
  ...selectProps
}: SelectFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

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
      <select id={id} className={styles.control} aria-describedby={hintId} {...selectProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
