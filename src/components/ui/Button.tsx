import type { ComponentPropsWithoutRef } from 'react';
import { buttonClassName, type ButtonStyleProps } from './buttonStyles';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonStyleProps;

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClassName({ variant, size }, className)} {...props} />
  );
}
