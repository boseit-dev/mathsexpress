import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { History, Shirt, ShoppingBag } from 'lucide-react';
import { Outlet } from 'react-router';
import { CoinIcon } from '@/components/ui/CoinIcon';
import { Button } from '@/components/ui/Button';
import { TabNav } from '@/components/ui/TabNav';
import { paths } from '@/config/paths';
import type { ShopRepository } from '@/data/repositories';
import { errorCodeOf, errorMessages } from '@/domain/errors';
import type { CosmeticCategory, Look, ShopProduct, ShopState } from '@/domain/shop';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCurrentStudent } from '@/layouts/student/useCurrentStudent';
import { formatNumber } from '@/lib/format';
import { ShopDecor } from './ShopDecor';
import type { ShopContextValue, ShopResult } from './useShop';
import styles from './ShopLayout.module.css';

const TABS = [
  { label: 'Shop', to: paths.student.shop, icon: ShoppingBag, end: true },
  { label: 'My collection', to: paths.student.shopCollection, icon: Shirt },
  { label: 'Coin history', to: paths.student.shopHistory, icon: History },
] as const;

/** Tells the header avatar and dashboard theme that the student's look changed. */
function publishAppearance(state: ShopState) {
  window.dispatchEvent(new CustomEvent<ShopState>('mathsexpress:shop-updated', { detail: state }));
}

/**
 * The shop's frame: the coin balance, the Shop | My collection | Coin history tabs, and the
 * wallet every page shares. All prices, balances and ownership come from the server.
 */
export function ShopLayout({ shop }: { shop: ShopRepository }) {
  useDocumentTitle('Shop');
  const student = useCurrentStudent();
  const [state, setState] = useState<ShopState | null>(null);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [pending, setPending] = useState<string | null>(null);
  const [trying, setTrying] = useState<Look>({});
  // A second click while a request is running must never send a second request. A ref, so the
  // check sees a request started in the same moment, before React re-renders.
  const busy = useRef(false);

  useEffect(() => {
    let live = true;
    shop
      .getState()
      .then((next) => {
        if (!live) return;
        setState(next);
        setLoadError('');
      })
      .catch((reason: unknown) => {
        if (live) setLoadError(errorMessages[errorCodeOf(reason)]);
      });
    return () => {
      live = false;
    };
  }, [shop, attempt]);

  // Trying on a dashboard theme recolours the whole page until the student stops trying it
  // (Cancel, Back to my look, equipping it) or leaves the shop; then their own theme returns.
  const previewTheme = trying.theme;
  const ownTheme = state?.equipped.theme;
  useEffect(() => {
    if (!previewTheme) return undefined;
    const root = document.documentElement;
    root.dataset.shopTheme = previewTheme;
    return () => {
      if (ownTheme) root.dataset.shopTheme = ownTheme;
      else root.removeAttribute('data-shop-theme');
    };
  }, [previewTheme, ownTheme]);

  const run = useCallback(
    async (key: string, request: () => Promise<ShopState>): Promise<ShopResult> => {
      if (busy.current) return undefined;
      busy.current = true;
      setPending(key);
      try {
        const next = await request();
        setState(next);
        publishAppearance(next);
        return null;
      } catch (reason) {
        const code = errorCodeOf(reason);
        // Already owned (say, bought in another tab): show the server's real inventory.
        if (code === 'shop_already_owned') {
          await shop
            .getState()
            .then(setState)
            .catch(() => undefined);
        }
        return errorMessages[code];
      } finally {
        busy.current = false;
        setPending(null);
      }
    },
    [shop],
  );

  const actions = useMemo(
    () => ({
      tryOn: (item: ShopProduct) => {
        setTrying((current) => ({ ...current, [item.category]: item.id }));
      },
      stopTrying: (category?: CosmeticCategory) => {
        setTrying((current) =>
          category
            ? Object.fromEntries(Object.entries(current).filter(([key]) => key !== category))
            : {},
        );
      },
      buy: (item: ShopProduct) => run(item.id, () => shop.buy(item.id)),
      equip: (category: CosmeticCategory, itemId: string | null) =>
        run(itemId ?? `off-${category}`, () => shop.equip(category, itemId)),
      resetLook: () => run('reset', () => shop.resetLook()),
    }),
    [run, shop],
  );

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <ShopDecor />
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Earned with maths · Cosmetic only</p>
          <h1>Shop</h1>
          <p className={styles.intro}>
            Spend the coins you earn in lessons on avatars, accessories, backgrounds and more. Try
            anything on for free.
          </p>
        </div>
        <p className={styles.wallet} aria-live="polite">
          <CoinIcon className={styles.coin} />
          <span className={styles.walletText}>
            <span className={styles.walletLabel}>Your coins</span>
            <strong key={state?.balance} className={styles.balance}>
              {state ? formatNumber(state.balance) : '…'}
            </strong>
          </span>
        </p>
      </header>

      <div className={styles.bar}>
        <TabNav label="Shop sections" items={TABS} />
        {state && (
          <span className={styles.miniBalance} aria-hidden="true">
            <CoinIcon className={styles.miniCoin} />
            {formatNumber(state.balance)}
          </span>
        )}
      </div>

      {state ? (
        <Outlet
          context={{ student, state, pending, trying, ...actions } satisfies ShopContextValue}
        />
      ) : loadError ? (
        <div className={styles.problem} role="alert">
          <p>{loadError} Your coins and items are safe.</p>
          <Button
            variant="secondary"
            onClick={() => {
              setLoadError('');
              setAttempt((value) => value + 1);
            }}
          >
            Try again
          </Button>
        </div>
      ) : (
        <p className={styles.loading} role="status">
          Loading your shop…
        </p>
      )}
    </div>
  );
}
