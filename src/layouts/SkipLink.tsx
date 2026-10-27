import styles from './SkipLink.module.css';

/** Lets keyboard users jump past the header straight to the page content. */
export function SkipLink({ targetId }: { targetId: string }) {
  return (
    <a href={`#${targetId}`} className={styles.skipLink}>
      Skip to main content
    </a>
  );
}
