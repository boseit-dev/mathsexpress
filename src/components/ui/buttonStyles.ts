import { cx } from '@/lib/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'inverse';
export type ButtonSize = 'medium' | 'large';

export interface ButtonStyleProps {
  /** `inverse` is for buttons placed on the dark brand colour. */
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** Shared by Button and ButtonLink so links that look like buttons stay identical. */
export function buttonClassName(
  { variant = 'primary', size = 'medium' }: ButtonStyleProps,
  className?: string,
): string {
  return cx(styles.button, styles[variant], styles[size], className);
}
