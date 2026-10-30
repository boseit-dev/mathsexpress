import { Check, Eye, Lock } from 'lucide-react';
import { ItemArt } from '@/components/cosmetics/ItemArt';
import { Button } from '@/components/ui/Button';
import { CoinAmount } from '@/components/ui/CoinAmount';
import { CATEGORY_LABELS, type Look, type ProductStatus, type ShopProduct } from '@/domain/shop';
import { formatNumber } from '@/lib/format';
import { RarityLabel } from './RarityLabel';
import styles from './ShopItemCard.module.css';

interface ShopItemCardProps {
  item: ShopProduct;
  status: ProductStatus;
  /** Worn because it is the default look, so there is nothing to take off. */
  isDefault: boolean;
  balance: number;
  /** The student's own look, so frames and effects are previewed on their avatar. */
  wearer: Look;
  trying: boolean;
  /** Another change is being saved; buttons that save wait for it. */
  busy: boolean;
  onOpen: (item: ShopProduct, intent: 'try' | 'buy') => void;
  onEquip: (item: ShopProduct, equip: boolean) => void;
}

/** One item in the shop grid. Trying on is free; buying always asks to confirm first. */
export function ShopItemCard({
  item,
  status,
  isDefault,
  balance,
  wearer,
  trying,
  busy,
  onOpen,
  onEquip,
}: ShopItemCardProps) {
  const free = item.price === 0;
  return (
    <article
      className={styles.card}
      data-rarity={item.rarity}
      data-status={status}
      aria-label={item.name}
    >
      <button
        type="button"
        className={styles.artButton}
        onClick={() => {
          onOpen(item, 'try');
        }}
        aria-label={`Preview ${item.name}`}
      >
        <ItemArt item={item} wearer={wearer} />
        {status === 'equipped' && (
          <span className={styles.flag}>
            <Check aria-hidden="true" /> {isDefault ? 'Default' : 'Equipped'}
          </span>
        )}
        {trying && status !== 'equipped' && <span className={styles.flag}>Trying on</span>}
      </button>
      <div className={styles.body}>
        <div className={styles.meta}>
          <RarityLabel rarity={item.rarity} />
          <span className={styles.category}>{CATEGORY_LABELS[item.category].one}</span>
        </div>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.price}>
          {status === 'equipped' || status === 'owned' ? (
            <span className={styles.owned}>{free ? 'Free starter item' : 'Owned'}</span>
          ) : status === 'locked' ? (
            <>
              <CoinAmount amount={item.price} />
              <span className={styles.need}>
                <Lock aria-hidden="true" /> {formatNumber(item.price - balance)} more
              </span>
            </>
          ) : (
            <CoinAmount amount={item.price} />
          )}
        </p>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            className={styles.tryButton}
            onClick={() => {
              onOpen(item, 'try');
            }}
            aria-label={`Try on ${item.name}`}
          >
            <Eye aria-hidden="true" /> Try on
          </Button>
          {status === 'available' && (
            <Button
              disabled={busy}
              onClick={() => {
                onOpen(item, 'buy');
              }}
              aria-label={`Buy ${item.name}`}
            >
              Buy
            </Button>
          )}
          {status === 'owned' && (
            <Button
              disabled={busy}
              onClick={() => {
                onEquip(item, true);
              }}
              aria-label={`Equip ${item.name}`}
            >
              Equip
            </Button>
          )}
          {status === 'equipped' && !isDefault && (
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => {
                onEquip(item, false);
              }}
              aria-label={`Unequip ${item.name}`}
            >
              Unequip
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
