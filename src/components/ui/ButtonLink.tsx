import { Link, type LinkProps } from 'react-router';
import { buttonClassName, type ButtonStyleProps } from './buttonStyles';

export type ButtonLinkProps = LinkProps & ButtonStyleProps;

/** A navigation link styled as a button. Use Button for actions on the current page. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, size }, className)} {...props} />;
}
