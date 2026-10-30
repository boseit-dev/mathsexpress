import { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, Lock, X } from 'lucide-react';
import { ItemArt } from '@/components/cosmetics/ItemArt';
import { Button } from '@/components/ui/Button';
import { CoinAmount } from '@/components/ui/CoinAmount';
import {
  CATEGORY_LABELS,
  COIN_RULES,
  isWornByDefault,
  resolveLook,
  shopProductState,
  type ShopProduct,
} from '@/domain/shop';
import { formatNumber } from '@/lib/format';
import { LookStage } from './LookStage';
import { PurchaseCelebration } from './PurchaseCelebration';
import { RarityLabel } from './RarityLabel';
import { useShop } from './useShop';
import styles from './TryOnDialog.module.css';

type Step = 'view' | 'confirm' | 'bought';

interface TryOnDialogProps {
  item: ShopProduct;
  /** Open straight on the purchase confirmation, from a card's Buy button. */
  startWith: 'view' | 'confirm';
  onClose: () => void;
}

/**
 * The Try On preview. The item is shown on the student's avatar together with anything else they
 * are trying on. Nothing is charged until the purchase is confirmed, and Cancel puts the
 * student's own look back.
 */
export function TryOnDialog({ item, startWith, onClose }: TryOnDialogProps) {
  const shop = useShop();
  const { state, trying, pending } = shop;
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const status = shopProductState(state, item);
  const [step, setStep] = useState<Step>(
    startWith === 'confirm' && status === 'available' ? 'confirm' : 'view',
  );
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const saving = pending !== null;

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
    return () => {
      if (element?.open) element.close();
    };
  }, []);

  function close(keepTrying: boolean) {
    if (!keepTrying) shop.stopTrying(item.category);
    onClose();
  }

  async function confirmPurchase() {
    setError('');
    const problem = await shop.buy(item);
    if (problem === undefined) return;
    if (problem) {
      setError(problem);
      setStep('view');
      return;
    }
    setStep('bought');
  }

  async function setEquipped(equip: boolean) {
    setError('');
    setNotice('');
    const problem = await shop.equip(item.category, equip ? item.id : null);
    if (problem === undefined) return;
    if (problem) {
      setError(problem);
      return;
    }
    shop.stopTrying(item.category);
    setStep('view');
    setNotice(
      equip
        ? `${item.name} is equipped. It’s saved to your account.`
        : `${item.name} is off. You still own it.`,
    );
  }

  const look = resolveLook(state.equipped, trying);
  const alsoTrying = Object.entries(trying)
    .filter(
      ([category, id]) =>
        category !== item.category && id !== state.equipped[category as keyof typeof trying],
    )
    .map(([, id]) => state.items.find((entry) => entry.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  const after = state.balance - item.price;

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        close(false);
      }}
    >
      <div className={styles.layout}>
        <div className={styles.preview}>
          {item.category === 'theme' ? (
            <div className={styles.themePreview}>
              <ItemArt item={item} />
            </div>
          ) : (
            <LookStage
              look={look}
              items={state.items}
              name={shop.student.displayName}
              caption={
                status === 'equipped' && alsoTrying.length === 0 ? 'Wearing now' : 'Trying on'
              }
            />
          )}
          {step === 'bought' && <PurchaseCelebration />}
        </div>

        <div className={styles.details}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => {
              close(true);
            }}
            aria-label="Close preview"
          >
            <X aria-hidden="true" />
          </button>
          <div className={styles.meta}>
            <RarityLabel rarity={item.rarity} />
            <span>{CATEGORY_LABELS[item.category].one}</span>
          </div>
          <h2 id={headingId} className={styles.heading}>
            {item.name}
          </h2>
          <p className={styles.description}>{item.description}</p>
          <p className={styles.price}>
            {item.price === 0 ? (
              'Free starter item'
            ) : status === 'owned' || status === 'equipped' ? (
              'You own this item'
            ) : (
              <CoinAmount amount={item.price} />
            )}
          </p>
          {item.category === 'theme' && status !== 'equipped' && (
            <p className={styles.combo}>
              The whole page is showing {item.name} while you try it on. Cancel puts your own
              colours back.
            </p>
          )}
          {alsoTrying.length > 0 && (
            <p className={styles.combo}>Also trying on: {alsoTrying.join(', ')}</p>
          )}

          <div aria-live="polite" className={styles.live}>
            {notice && <p className={styles.notice}>{notice}</p>}
            {step === 'bought' && (
              <p className={styles.success}>
                <CheckCircle2 aria-hidden="true" /> {item.name} is yours! It’s saved to your
                account.
              </p>
            )}
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          {step === 'confirm' && status === 'available' ? (
            <div className={styles.confirm}>
              <p>
                Spend <strong>{formatNumber(item.price)} coins</strong> on {item.name}? You’ll have{' '}
                {formatNumber(after)} coins left.
              </p>
              <div className={styles.buttons}>
                <Button
                  disabled={saving}
                  onClick={() => {
                    void confirmPurchase();
                  }}
                >
                  {pending === item.id ? 'Buying…' : 'Confirm purchase'}
                </Button>
                <Button
                  variant="secondary"
                  disabled={saving}
                  onClick={() => {
                    setStep('view');
                  }}
                >
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.buttons}>
              {status === 'available' && (
                <Button
                  disabled={saving}
                  onClick={() => {
                    setError('');
                    setStep('confirm');
                  }}
                >
                  Buy for {formatNumber(item.price)} coins
                </Button>
              )}
              {status === 'locked' && (
                <Button disabled>
                  <Lock aria-hidden="true" /> Need {formatNumber(item.price - state.balance)} more
                  coins
                </Button>
              )}
              {status === 'owned' && (
                <Button
                  disabled={saving}
                  onClick={() => {
                    void setEquipped(true);
                  }}
                >
                  {step === 'bought' ? 'Equip now' : 'Equip'}
                </Button>
              )}
              {status === 'equipped' && !isWornByDefault(state, item) && (
                <Button
                  variant="secondary"
                  disabled={saving}
                  onClick={() => {
                    void setEquipped(false);
                  }}
                >
                  Unequip
                </Button>
              )}
              {status === 'equipped' ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    close(true);
                  }}
                >
                  Done
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      close(true);
                    }}
                  >
                    Keep trying on
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      close(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          )}
          {status === 'locked' && (
            <p className={styles.hint}>
              Finish a lesson to earn up to{' '}
              {COIN_RULES.lessonComplete + COIN_RULES.lessonFirstTryBonus * 5} coins. Trying on is
              always free.
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}
