import { BrandMark } from '@/layouts/BrandMark';
import styles from './SetupRequiredPage.module.css';

/** Shown instead of the app when it has no Supabase connection configured (development only). */
export function SetupRequiredPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <BrandMark className={styles.mark} />
        <h1>MathsExpress needs its database connection</h1>
        <p>
          The app could not find its Supabase settings. To run it locally, start the local stack and
          write the settings file:
        </p>
        <ol className={styles.steps}>
          <li>
            <code className={styles.code}>supabase start</code>
          </li>
          <li>
            <code className={styles.code}>npm run env:local</code>
          </li>
          <li>
            Restart <code className={styles.code}>npm run dev</code>
          </li>
        </ol>
        <p>See docs/local-development.md for details.</p>
      </div>
    </main>
  );
}
