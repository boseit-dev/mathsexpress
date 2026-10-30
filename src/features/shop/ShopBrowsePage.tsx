import { useId, useState } from 'react';
import { RotateCcw, Search, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { SelectField } from '@/components/forms/SelectField';
import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';
import {
  CATEGORY_LABELS,
  COIN_RULES,
  COSMETIC_CATEGORIES,
  DEFAULT_FILTERS,
  PRICE_BANDS,
  RARITIES,
  RARITY_LABELS,
  filterShopItems,
  isWornByDefault,
  resolveLook,
  shopProductState,
  type CosmeticCategory,
  type Rarity,
  type ShopFilters,
  type ShopProduct,
  type ShopSort,
} from '@/domain/shop';
import { useSlidingIndicator } from '@/hooks/useSlidingIndicator';
import { formatCount } from '@/lib/format';
import { LookStage } from './LookStage';
import { ShopItemCard } from './ShopItemCard';
import { TryOnDialog } from './TryOnDialog';
import { useShop } from './useShop';
import styles from './ShopBrowsePage.module.css';

const SORTS: readonly { value: ShopSort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'cheapest', label: 'Cheapest first' },
  { value: 'expensive', label: 'Most expensive first' },
  { value: 'name', label: 'Name (A–Z)' },
];

function readFilters(params: URLSearchParams): ShopFilters {
  const category = params.get('category');
  const rarity = params.get('rarity');
  const sort = params.get('sort');
  const price = params.get('price');
  return {
    category: COSMETIC_CATEGORIES.includes(category as CosmeticCategory)
      ? (category as CosmeticCategory)
      : 'all',
    search: params.get('q') ?? '',
    rarity: RARITIES.includes(rarity as Rarity) ? (rarity as Rarity) : 'all',
    price: PRICE_BANDS.some((band) => band.id === price) ? (price ?? 'all') : 'all',
    sort: SORTS.some((option) => option.value === sort) ? (sort as ShopSort) : 'featured',
    ownedOnly: params.get('owned') === '1',
    affordableOnly: params.get('afford') === '1',
  };
}

function writeFilters(filters: ShopFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.search) params.set('q', filters.search);
  if (filters.rarity !== 'all') params.set('rarity', filters.rarity);
  if (filters.price !== 'all') params.set('price', filters.price);
  if (filters.sort !== 'featured') params.set('sort', filters.sort);
  if (filters.ownedOnly) params.set('owned', '1');
  if (filters.affordableOnly) params.set('afford', '1');
  return params;
}

/** Browse every item: category tabs, search, filters and sorting, with a live preview. */
export function ShopBrowsePage() {
  const shop = useShop();
  const { state, trying, pending } = shop;
  const [params, setParams] = useSearchParams();
  // Filters live here so typing stays instant; the address keeps a copy for sharing and reloads.
  const [filters, setFilters] = useState(() => readFilters(params));
  const [dialog, setDialog] = useState<{ item: ShopProduct; intent: 'try' | 'buy' } | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const searchId = useId();
  const { listRef, indicatorRef } = useSlidingIndicator<HTMLUListElement>(
    filters.category,
    '[aria-pressed="true"]',
  );

  function update(patch: Partial<ShopFilters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    setParams(writeFilters(next), { replace: true, preventScrollReset: true });
  }

  const shown = filterShopItems(state, filters);
  const look = resolveLook(state.equipped, trying);
  const tryingItems = Object.values(trying)
    .map((id) => state.items.find((item) => item.id === id))
    .filter((item): item is ShopProduct => item !== undefined);
  const filtered =
    filters.search !== '' ||
    filters.rarity !== 'all' ||
    filters.price !== 'all' ||
    filters.ownedOnly ||
    filters.affordableOnly;

  function open(item: ShopProduct, intent: 'try' | 'buy') {
    setMessage('');
    setError('');
    if (state.equipped[item.category] !== item.id) shop.tryOn(item);
    setDialog({ item, intent });
  }

  async function equip(item: ShopProduct, on: boolean) {
    setMessage('');
    setError('');
    const problem = await shop.equip(item.category, on ? item.id : null);
    if (problem === undefined) return;
    if (problem) {
      setError(problem);
      return;
    }
    shop.stopTrying(item.category);
    setMessage(on ? `${item.name} is equipped.` : `${item.name} is off. You still own it.`);
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.side} aria-label="Your look">
        <LookStage
          look={look}
          items={state.items}
          name={shop.student.displayName}
          caption={tryingItems.length > 0 ? 'Trying on' : 'Your look'}
        >
          {tryingItems.length > 0 && (
            <div className={styles.trying}>
              <p>
                Trying on {tryingItems.map((item) => item.name).join(', ')}. Nothing is saved until
                you buy or equip it.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  shop.stopTrying();
                }}
              >
                <RotateCcw aria-hidden="true" /> Back to my look
              </Button>
            </div>
          )}
        </LookStage>
        <div className={styles.earn}>
          <Sparkles aria-hidden="true" />
          <p>
            Finish a lesson for {COIN_RULES.lessonComplete} coins, plus{' '}
            {COIN_RULES.lessonFirstTryBonus} for each question right first time.{' '}
            <Link to={paths.student.learn}>Go to Learn</Link>
          </p>
        </div>
      </aside>

      <section className={styles.main} aria-labelledby={`${searchId}-heading`}>
        <h2 id={`${searchId}-heading`} className={styles.heading}>
          Browse items
        </h2>
        <ul className={styles.categories} ref={listRef} aria-label="Categories">
          {(['all', ...COSMETIC_CATEGORIES] as const).map((category) => {
            const count =
              category === 'all'
                ? state.items.length
                : state.items.filter((item) => item.category === category).length;
            return (
              <li key={category}>
                <button
                  type="button"
                  className={styles.category}
                  aria-pressed={filters.category === category}
                  onClick={() => {
                    update({ category });
                  }}
                >
                  {category === 'all' ? 'All' : CATEGORY_LABELS[category].many}
                  <span className={styles.count}>{count}</span>
                </button>
              </li>
            );
          })}
          <li ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
        </ul>

        <div className={styles.filters}>
          <div className={styles.search}>
            <label htmlFor={`${searchId}-search`}>Search items</label>
            <div className={styles.searchBox}>
              <Search aria-hidden="true" />
              <input
                id={`${searchId}-search`}
                type="search"
                value={filters.search}
                autoComplete="off"
                placeholder="Try “space” or “gold”"
                onChange={(event) => {
                  update({ search: event.target.value });
                }}
              />
            </div>
          </div>
          <SelectField
            label="Rarity"
            name="rarity"
            value={filters.rarity}
            options={[
              { value: 'all', label: 'Any rarity' },
              ...RARITIES.map((rarity) => ({ value: rarity, label: RARITY_LABELS[rarity] })),
            ]}
            onChange={(event) => {
              update({ rarity: event.target.value as Rarity | 'all' });
            }}
          />
          <SelectField
            label="Price"
            name="price"
            value={filters.price}
            options={[
              { value: 'all', label: 'Any price' },
              ...PRICE_BANDS.map((band) => ({ value: band.id, label: band.label })),
            ]}
            onChange={(event) => {
              update({ price: event.target.value });
            }}
          />
          <SelectField
            label="Sort by"
            name="sort"
            value={filters.sort}
            options={SORTS}
            onChange={(event) => {
              update({ sort: event.target.value as ShopSort });
            }}
          />
          <div className={styles.toggles}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={filters.affordableOnly}
                onChange={(event) => {
                  update({ affordableOnly: event.target.checked, ownedOnly: false });
                }}
              />
              I can afford
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={filters.ownedOnly}
                onChange={(event) => {
                  update({ ownedOnly: event.target.checked, affordableOnly: false });
                }}
              />
              I own
            </label>
          </div>
        </div>

        <div className={styles.summaryRow}>
          <p className={styles.summary} aria-live="polite">
            {shown.length === state.items.length
              ? `Showing all ${formatCount(shown.length, 'item')}`
              : `Showing ${shown.length} of ${formatCount(state.items.length, 'item')}`}
          </p>
          {(filtered || filters.category !== 'all' || filters.sort !== 'featured') && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => {
                update(DEFAULT_FILTERS);
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        <div aria-live="polite" className={styles.live}>
          {message && <p className={styles.message}>{message}</p>}
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {shown.length > 0 ? (
          <ul className={styles.grid} aria-label="Shop items">
            {shown.map((item) => (
              <li key={item.id}>
                <ShopItemCard
                  item={item}
                  status={shopProductState(state, item)}
                  isDefault={isWornByDefault(state, item)}
                  balance={state.balance}
                  wearer={state.equipped}
                  trying={trying[item.category] === item.id}
                  busy={pending !== null}
                  onOpen={open}
                  onEquip={(target, on) => {
                    void equip(target, on);
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <p>
              <strong>No items match.</strong>{' '}
              {filters.affordableOnly
                ? 'Finish a lesson to earn more coins, or clear the filters to browse everything.'
                : 'Try another search or clear the filters.'}
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                update({ ...DEFAULT_FILTERS, category: filters.category });
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>

      {dialog && (
        <TryOnDialog
          key={dialog.item.id}
          item={dialog.item}
          startWith={dialog.intent === 'buy' ? 'confirm' : 'view'}
          onClose={() => {
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}
