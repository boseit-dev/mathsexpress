import type { AssignmentKind } from '@/domain/assignment';
import styles from './TaskArt.module.css';

/** Original header artwork for a task card, one small scene per kind of task. Decorative. */
export function TaskArt({ kind }: { kind: AssignmentKind }) {
  return (
    <svg
      viewBox="0 0 240 112"
      preserveAspectRatio="xMidYMid meet"
      className={styles.art}
      aria-hidden="true"
      focusable="false"
    >
      {kind === 'homework' && (
        <>
          <circle className={styles.soft} cx="58" cy="82" r="16" />
          <rect className={styles.paper} x="82" y="16" width="72" height="84" rx="8" />
          <path className={styles.line} d="M96 40h44M96 56h44M96 72h28" />
          <g transform="rotate(35 160 62)">
            <rect className={styles.secondary} x="152" y="22" width="16" height="58" rx="3" />
            <path className={styles.coin} d="M152 80h16l-8 16z" />
          </g>
        </>
      )}
      {kind === 'quiz' && (
        <>
          <rect className={styles.box} x="78" y="20" width="18" height="18" rx="4" />
          <rect className={styles.box} x="78" y="47" width="18" height="18" rx="4" />
          <rect className={styles.box} x="78" y="74" width="18" height="18" rx="4" />
          <path className={styles.tick} d="M82 29l4 4 7-8M82 56l4 4 7-8" />
          <path className={styles.line} d="M108 29h52M108 56h40M108 83h48" />
          <circle className={styles.coin} cx="178" cy="30" r="9" />
        </>
      )}
      {kind === 'practice' && (
        <>
          <circle className={styles.white} cx="120" cy="58" r="40" />
          <circle className={styles.soft} cx="120" cy="58" r="28" />
          <circle className={styles.white} cx="120" cy="58" r="16" />
          <circle className={styles.primary} cx="120" cy="58" r="7" />
          <path className={styles.arrow} d="M172 18l-48 36M160 18h12v12" />
          <circle className={styles.secondary} cx="58" cy="80" r="10" />
        </>
      )}
      {kind === 'revision' && (
        <>
          <path className={styles.arrow} d="M146 40a30 30 0 1 0 4 28M146 24v16h-16" />
          <path className={styles.dash} d="M70 92h100" />
          <path className={styles.secondary} d="M178 84l14-24 14 24z" />
          <circle className={styles.coin} cx="200" cy="30" r="9" />
        </>
      )}
    </svg>
  );
}
