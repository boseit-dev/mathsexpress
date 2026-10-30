import { useEffect, useState } from 'react';
import { Coins, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { StudentAvatar } from '@/components/cosmetics/StudentAvatar';
import type { ShopRepository } from '@/data/repositories';
import type { ShopState } from '@/domain/shop';
import { paths } from '@/config/paths';
import { formatNumber } from '@/lib/format';
import styles from './ShopPreview.module.css';

/** The student's real look and wallet, for the side panel. Never sample balances. */
export function ShopPreview({ shop, name }: { shop: ShopRepository; name: string }) {
  const [state, setState] = useState<ShopState | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    shop
      .getState()
      .then((result) => {
        if (live) {
          setState(result);
          setError(false);
        }
      })
      .catch(() => {
        if (live) setError(true);
      });
    return () => {
      live = false;
    };
  }, [shop]);
  const bought = state
    ? state.items.filter((item) => item.price > 0 && state.owned.includes(item.id))
    : [];
  return (
    <section className={styles.preview} aria-label="Your coin shop">
      <div className={styles.iconRow}>
        <ShoppingBag aria-hidden="true" />
        <h3>My Coin Shop</h3>
      </div>
      {error ? (
        <p>Couldn't load your balance. Open the shop to retry.</p>
      ) : state ? (
        <div className={styles.summary}>
          <StudentAvatar name={name} look={state.equipped} size="large" decorative />
          <div>
            <p className={styles.balance}>
              <Coins aria-hidden="true" /> {formatNumber(state.balance)} coins
            </p>
            <p>
              {bought.length === 0
                ? `${state.items.length} items to discover, from free to legendary.`
                : `You’ve bought ${bought.length} of ${state.items.length} items.`}
            </p>
          </div>
        </div>
      ) : (
        <p role="status">Loading your coins…</p>
      )}
      <div className={styles.links}>
        <Link to={paths.student.shop}>Open the shop</Link>
        <Link to={paths.student.shopCollection}>My collection</Link>
      </div>
    </section>
  );
}
