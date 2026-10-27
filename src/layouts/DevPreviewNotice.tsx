import { Link } from 'react-router';
import { appConfig } from '@/config/app';
import styles from './DevPreviewNotice.module.css';

interface DevPreviewNoticeProps {
  /** Until sign-in exists, lets reviewers switch between the student and teacher layouts. */
  switchLink: { label: string; to: string };
}

/** States plainly that the app is a development preview showing sample data, not real people. */
export function DevPreviewNotice({ switchLink }: DevPreviewNoticeProps) {
  if (!appConfig.usesSampleData) return null;

  return (
    <aside className={styles.notice} aria-label="Development preview">
      <div className={styles.inner}>
        <p>
          <strong>Development preview</strong> · v{appConfig.version} · Sample data only: these are
          not real students or teachers.
        </p>
        <Link to={switchLink.to} className={styles.link}>
          {switchLink.label}
        </Link>
      </div>
    </aside>
  );
}
