import { Avatar } from '@/components/ui/Avatar';
import { avatarParts, resolveLook, type Look } from '@/domain/shop';
import { cx } from '@/lib/cx';
import { AvatarPortrait } from './AvatarPortrait';
import styles from './StudentAvatar.module.css';

interface StudentAvatarProps {
  name: string;
  /** The student's equipped items. Leave out (for example, for teachers) to show initials. */
  look?: Look | null;
  size?: 'small' | 'medium' | 'large';
  /** Set when the name is already shown next to the avatar, so it isn't read twice. */
  decorative?: boolean;
  className?: string;
}

/** A student's avatar wearing their equipped look, or their initials when there is no look. */
export function StudentAvatar({
  name,
  look,
  size = 'medium',
  decorative = false,
  className,
}: StudentAvatarProps) {
  if (!look) {
    return (
      <Avatar
        name={name}
        size={size === 'large' ? 'medium' : size}
        decorative={decorative}
        className={className}
      />
    );
  }
  return (
    <span className={cx(styles.avatar, styles[size], className)}>
      <AvatarPortrait
        look={avatarParts(resolveLook(look))}
        label={decorative ? undefined : name}
        still
      />
    </span>
  );
}
