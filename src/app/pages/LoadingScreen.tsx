import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BrandMark } from '@/layouts/BrandMark';
import styles from './LoadingScreen.module.css';

/**
 * After this long, offer a reload. Requests give up after 15 seconds and show the error page, so
 * this only matters if something else stops the page from loading.
 */
export const SLOW_LOAD_MS = 20_000;

/** Shown while the first page's data loads. Deliberately static: no spinner animation. */
export function LoadingScreen() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlow(true);
    }, SLOW_LOAD_MS);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.loading} role="status">
      <BrandMark className={styles.mark} />
      <p>Loading MathsExpress…</p>
      {slow && (
        <div className={styles.slow}>
          <p>This is taking longer than usual. Check your internet connection, then reload.</p>
          <Button
            variant="secondary"
            onClick={() => {
              window.location.reload();
            }}
          >
            <RefreshCw />
            Reload
          </Button>
        </div>
      )}
    </div>
  );
}
