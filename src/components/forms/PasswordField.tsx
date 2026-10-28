import { useId, useState } from 'react';
import { Button } from '@/components/ui/Button';
import fieldStyles from './Field.module.css';
import styles from './PasswordField.module.css';

interface PasswordFieldProps {
  label: string;
  name: string;
  autoComplete: 'current-password' | 'new-password';
  hint?: string;
  error?: string | null;
}

/** A password input with a Show/Hide button, so people can check what they typed. */
export function PasswordField({ label, name, autoComplete, hint, error }: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={fieldStyles.field}>
      <label htmlFor={id} className={fieldStyles.label}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className={fieldStyles.hint}>
          {hint}
        </p>
      )}
      <div className={fieldStyles.inputRow}>
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          className={fieldStyles.control}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        />
        <Button
          variant="secondary"
          className={styles.toggle}
          aria-pressed={visible}
          aria-controls={id}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => {
            setVisible((current) => !current);
          }}
        >
          {visible ? 'Hide' : 'Show'}
        </Button>
      </div>
      {error && (
        <p id={errorId} className={fieldStyles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
