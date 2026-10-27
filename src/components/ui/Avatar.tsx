import { getInitials } from '@/lib/format';
import { cx } from '@/lib/cx';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  size?: 'small' | 'medium';
  /** Set when the name is already shown next to the avatar, so it isn't read twice. */
  decorative?: boolean;
  className?: string;
}

/** A person's initials in a circle. Replaced by profile pictures once accounts exist. */
export function Avatar({ name, size = 'medium', decorative = false, className }: AvatarProps) {
  const classNames = cx(styles.avatar, styles[size], className);

  if (decorative) {
    return (
      <span className={classNames} aria-hidden="true">
        {getInitials(name)}
      </span>
    );
  }
  return (
    <span className={classNames} role="img" aria-label={name}>
      {getInitials(name)}
    </span>
  );
}
