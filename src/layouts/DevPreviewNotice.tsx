import { appConfig } from '@/config/app';
import styles from './DevPreviewNotice.module.css';

/** States plainly which parts of the preview are real and which are sample data. */
export function DevPreviewNotice() {
  if (!appConfig.usesSampleData) return null;

  return (
    <aside className={styles.notice} aria-label="Development preview">
      <div className={styles.inner}>
        <p>
          <strong>Development preview</strong> · v{appConfig.version} · Your account and classes are
          real. Panels marked “Sample data” show examples until those features are built.
        </p>
      </div>
    </aside>
  );
}
