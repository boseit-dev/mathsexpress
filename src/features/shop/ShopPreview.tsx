import { useEffect, useState } from 'react';
import { Coins, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import type { ShopRepository } from '@/data/repositories';
import type { ShopState } from '@/domain/shop';
import { paths } from '@/config/paths';
import { formatNumber } from '@/lib/format';
import styles from './ShopPreview.module.css';

/** Real wallet preview: sample balances and disabled fake purchases are never shown. */
export function ShopPreview({ shop }: { shop: ShopRepository }) {
  const [state, setState] = useState<ShopState | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    shop.getState().then((result) => {
      if (live) { setState(result); setError(false); }
    }).catch(() => {
      if (live) setError(true);
    });
    return () => { live = false; };
  }, [shop]);
  return (
    <section className={styles.preview} aria-label="Your real coin shop">
      <div className={styles.iconRow}>
        <ShoppingBag aria-hidden="true" />
        <h3>My Coin Shop</h3>
      </div>
      {error ? <p>Couldn't load your balance. Open the shop to retry.</p> : state ? (
        <>
          <p className={styles.balance}><Coins aria-hidden="true" /> {formatNumber(state.balance)} coins</p>
          <p>{state.owned.length} owned cosmetics. Buy themes and avatar frames with your earned coins.</p>
        </>
      ) : <p role="status">Loading your coins…</p>}
      <Link to={paths.student.shop}>Open the full shop</Link>
    </section>
  );
}
