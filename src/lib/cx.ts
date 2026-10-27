/** Joins CSS class names, skipping empty values: `cx('card', isActive && 'active')`. */
export function cx(...classNames: (string | false | null | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}
