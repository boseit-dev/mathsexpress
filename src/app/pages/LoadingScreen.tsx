import { BrandMark } from '@/layouts/BrandMark';
import styles from './LoadingScreen.module.css';

/** Shown while the first page's data loads. Deliberately static: no spinner animation. */
export function LoadingScreen() {
  return (
    <div className={styles.loading} role="status">
      <BrandMark className={styles.mark} />
      <p>Loading MathsExpress…</p>
    </div>
  );
}
