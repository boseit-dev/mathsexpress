import { useId } from 'react';
import styles from './CheckboxField.module.css';

interface CheckboxFieldProps {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}

export function CheckboxField({ label, name, defaultChecked, hint }: CheckboxFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={styles.field}>
      <input
        id={id}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className={styles.input}
        aria-describedby={hintId}
      />
      <span className={styles.text}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {hint && (
          <span id={hintId} className={styles.hint}>
            {hint}
          </span>
        )}
      </span>
    </div>
  );
}
