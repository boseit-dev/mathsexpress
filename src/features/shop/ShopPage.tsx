import { useEffect, useState } from 'react';
import {
  ArrowRight, Check, CircleUserRound, Coins, Gift, History, PackageCheck,
  Palette, ShoppingBag, Sparkles,
} from 'lucide-react';
import { Link } from 'react-router';
import type { ShopRepository } from '@/data/repositories';
import { paths } from '@/config/paths';
import { shopProductState, type CosmeticCategory, type ShopProduct, type ShopState } from '@/domain/shop';
import { errorCodeOf, errorMessages } from '@/domain/errors';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatNumber } from '@/lib/format';
import styles from './ShopPage.module.css';

type CategoryFilter = 'all' | CosmeticCategory;
type ShopTab = 'browse' | 'locker' | 'history';

function shopLabel(category: CosmeticCategory) {
  return category === 'theme' ? 'Dashboard theme' : 'Avatar frame';
}

function publishAppearance(state: ShopState) {
  window.dispatchEvent(new CustomEvent<ShopState>('mathsexpress:shop-updated', { detail: state }));
}

function ProductCard({
  item, state, busy, confirmId, onConfirm, onBuy, onEquip,
}: {
  item: ShopProduct;
  state: ShopState;
  busy: boolean;
  confirmId: string | null;
  onConfirm: (id: string | null) => void;
  onBuy: (id: string) => void;
  onEquip: (category: CosmeticCategory, id: string | null) => void;
}) {
  const status = shopProductState(state, item);
  const confirming = confirmId === item.id;
  return (
    <article className={styles.card} data-category={item.category}>
      <div className={styles.art} data-item={item.id} aria-hidden="true">
        {item.category === 'theme' ? <Palette /> : <CircleUserRound />}
        <span>{item.category === 'theme' ? 'Aa 1+2=3' : '★'}</span>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.categoryLabel}>{shopLabel(item.category)}</span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className={styles.cardFooter}>
          <span className={styles.price}><Coins aria-hidden="true" /> {formatNumber(item.price)}</span>
          {status === 'equipped' ? (
            <button className={styles.secondaryButton} disabled={busy} onClick={() => onEquip(item.category, null)} type="button">
              <Check aria-hidden="true" /> Equipped · Remove
            </button>
          ) : status === 'owned' ? (
            <button className={styles.primaryButton} disabled={busy} onClick={() => onEquip(item.category, item.id)} type="button">
              Equip
            </button>
          ) : confirming ? (
            <div className={styles.confirmRow}>
              <button type="button" className={styles.primaryButton} disabled={busy} onClick={() => onBuy(item.id)}>
                Confirm buy
              </button>
              <button type="button" className={styles.secondaryButton} disabled={busy} onClick={() => onConfirm(null)}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.primaryButton}
              disabled={busy || status === 'locked'}
              onClick={() => onConfirm(item.id)}
            >
              {status === 'locked'
                ? `Need ${formatNumber(item.price - state.balance)} more`
                : 'Buy item'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/** No demo balance: all purchases/equipment come from the authenticated server. */
export function ShopPage({ shop }: { shop: ShopRepository }) {
  useDocumentTitle('Shop');
  const [state, setState] = useState<ShopState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [tab, setTab] = useState<ShopTab>('browse');

  useEffect(() => {
    let live = true;
    shop.getState().then((next) => {
      if (live) { setState(next); setError(''); }
    }).catch((reason: unknown) => {
      if (live) setError(errorMessages[errorCodeOf(reason)]);
    }).finally(() => {
      if (live) setLoading(false);
    });
    return () => { live = false; };
  }, [shop]);

  async function refresh() {
    setLoading(true);
    try {
      const next = await shop.getState();
      setState(next);
      setError('');
    } catch (reason) {
      setError(errorMessages[errorCodeOf(reason)]);
    } finally {
      setLoading(false);
    }
  }

  async function buy(itemId: string) {
    if (busy || !state) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const next = await shop.buy(itemId);
      setState(next);
      setConfirmId(null);
      const item = next.items.find((entry) => entry.id === itemId);
      setMessage(`Purchased ${item?.name ?? 'your item'}! It's now in your locker.`);
      publishAppearance(next);
    } catch (reason) {
      setError(errorMessages[errorCodeOf(reason)]);
    } finally {
      setBusy(false);
    }
  }

  async function equip(category: CosmeticCategory, itemId: string | null) {
    if (busy || !state) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const next = await shop.equip(category, itemId);
      setState(next);
      setMessage(itemId ? 'Your new look is equipped!' : 'Back to the default look.');
      publishAppearance(next);
    } catch (reason) {
      setError(errorMessages[errorCodeOf(reason)]);
    } finally {
      setBusy(false);
    }
  }

  const products = state?.items.filter((item) =>
    (filter === 'all' || item.category === filter) &&
    (tab !== 'locker' || state.owned.includes(item.id)),
  ) ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>MATHSEXPRESS · REWARD YOUR PROGRESS</p>
          <h1>Coin Shop</h1>
          <p>Make your study space your own. Earn coins through maths, then unlock looks you can keep.</p>
        </div>
        <div className={styles.wallet} aria-live="polite">
          <Coins aria-hidden="true" />
          <span>
            <small>Your coin balance</small>
            <strong>{state ? formatNumber(state.balance) : loading ? 'Loading…' : 'Unavailable'}</strong>
          </span>
        </div>
      </header>
      <nav className={styles.tabBar} aria-label="Shop sections">
        {([
          ['browse', ShoppingBag, 'Shop items'],
          ['locker', PackageCheck, 'My locker'],
          ['history', History, 'Coin history'],
        ] as const).map(([id, Icon, label]) => (
          <button
            key={id} type="button" className={styles.tab}
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => { setTab(id); setConfirmId(null); }}
          >
            <Icon aria-hidden="true" /> {label}
          </button>
        ))}
      </nav>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {message && <p className={styles.success} role="status">{message}</p>}
      {loading && !state && <p role="status">Loading your shop and purchases…</p>}
      {!state && !loading && (
        <button className={styles.primaryButton} type="button" onClick={() => { void refresh(); }}>
          Try loading the shop again
        </button>
      )}
      {state && tab !== 'history' && (
        <>
          <div className={styles.filters} role="group" aria-label="Filter item categories">
            {([
              ['all', 'All items'], ['theme', 'Themes'], ['frame', 'Avatar frames'],
            ] as const).map(([id, label]) => (
              <button key={id} className={styles.filter} type="button"
                aria-pressed={filter === id} onClick={() => setFilter(id)}>
                {label}
              </button>
            ))}
          </div>
          {tab === 'locker' && (
            <div className={styles.lockerIntro}>
              <Gift aria-hidden="true" />
              <p>Owned cosmetics stay in your account. Pick one theme and one frame to wear.</p>
            </div>
          )}
          <div className={styles.grid}>
            {products.map((item) => (
              <ProductCard key={item.id} item={item} state={state} busy={busy}
                confirmId={confirmId} onConfirm={setConfirmId} onBuy={(id) => { void buy(id); }}
                onEquip={(category, id) => { void equip(category, id); }} />
            ))}
          </div>
          {products.length === 0 && (
            <div className={styles.empty}>
              <p>{tab === 'locker' ? 'Your locker is empty. Visit the Shop items tab to unlock your first look.' : 'No items match this filter.'}</p>
              <button type="button" className={styles.secondaryButton}
                onClick={() => { setFilter('all'); setTab('browse'); }}>
                Explore the shop <ArrowRight aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}
      {state && tab === 'history' && (
        <section className={styles.history}>
          <h2>Recent coin activity</h2>
          <ul>
            {state.transactions.map((entry) => (
              <li key={entry.id}>
                <span>
                  <strong>
                    {entry.reason === 'welcome' ? 'Welcome gift' :
                      entry.reason === 'correct_answer' ? 'Correct maths answer' :
                      state.items.find((item) => item.id === entry.itemId)?.name ?? 'Shop purchase'}
                  </strong>
                  <small>{new Date(entry.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
                </span>
                <b data-positive={entry.delta > 0}>{entry.delta > 0 ? '+' : ''}{entry.delta} coins</b>
              </li>
            ))}
          </ul>
          <p>Showing the latest 20 transactions. Purchases and rewards are saved to your account.</p>
        </section>
      )}
      <aside className={styles.earn}>
        <Sparkles aria-hidden="true" />
        <div>
          <strong>How do I earn more coins?</strong>
          <p>Start with 100 welcome coins. Earn 20 coins the first time you correctly solve each published Year 9 guided lesson question. New ways to earn will be added when other lessons are ready.</p>
          <Link to={paths.student.learn}>Go to Learn <ArrowRight aria-hidden="true" /></Link>
        </div>
      </aside>
    </div>
  );
}
