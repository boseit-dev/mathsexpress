import { Outlet } from 'react-router';
import { MAIN_CONTENT_ID } from '@/app/mainContentFocus';
import { appConfig } from '@/config/app';
import { paths } from '@/config/paths';
import { BrandLogo } from './BrandLogo';
import { StudentBackdrop } from './student/StudentBackdrop';
import styles from './AuthLayout.module.css';

/** The frame for signing in, registering and recovering an account: one focused card. */
export function AuthLayout() {
  return (
    <div className={styles.page}>
      <StudentBackdrop />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
        <div className={styles.card}>
          <BrandLogo to={paths.root} />
          <Outlet />
        </div>
        <p className={styles.notice}>
          MathsExpress {appConfig.version} · Development preview. Accounts here are stored in a
          local test database.
        </p>
      </main>
    </div>
  );
}
