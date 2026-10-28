import { useId } from 'react';
import styles from './ChoiceCards.module.css';

interface Choice {
  value: string;
  label: string;
  description: string;
}

interface ChoiceCardsProps {
  legend: string;
  name: string;
  choices: readonly Choice[];
  defaultValue?: string;
  error?: string | null;
}

/** A radio group shown as cards. Native radios, so keyboard and screen readers work as usual. */
export function ChoiceCards({ legend, name, choices, defaultValue, error }: ChoiceCardsProps) {
  const errorId = useId();

  return (
    <fieldset
      className={styles.group}
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {choices.map((choice) => (
          <label key={choice.value} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={choice.value}
              defaultChecked={choice.value === defaultValue}
              className={styles.input}
            />
            <span className={styles.text}>
              <span className={styles.optionLabel}>{choice.label}</span>
              <span className={styles.description}>{choice.description}</span>
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
