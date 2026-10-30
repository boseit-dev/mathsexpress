import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { Link } from 'react-router';
import { ItemArt } from '@/components/cosmetics/ItemArt';
import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';
import {
  CATEGORY_LABELS,
  COSMETIC_CATEGORIES,
  isWornByDefault,
  resolveLook,
  type ShopProduct,
} from '@/domain/shop';
import { formatCount } from '@/lib/format';
import { LookStage } from './LookStage';
import { RarityLabel } from './RarityLabel';
import { useShop } from './useShop';
import styles from './CollectionPage.module.css';

/** Everything the student owns, grouped by kind, with one-click equip and a reset. */
export function CollectionPage() {
  const shop = useShop();
  const { state, pending } = shop;
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const owned = state.items.filter((item) => state.owned.includes(item.id));
  const bought = owned.filter((item) => item.price > 0).length;
  const wearing = Object.keys(state.equipped).length > 0;

  async function change(item: ShopProduct, on: boolean) {
    setMessage('');
    setError('');
    const problem = await shop.equip(item.category, on ? item.id : null);
    if (problem === undefined) return;
    if (problem) setError(problem);
    else setMessage(on ? `${item.name} is equipped.` : `${item.name} is off.`);
  }

  async function reset() {
    setMessage('');
    setError('');
    const problem = await shop.resetLook();
    if (problem === undefined) return;
    setConfirmReset(false);
    if (problem) setError(problem);
    else setMessage('Back to the default MathsExpress look. You still own all your items.');
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.side} aria-label="Your look">
        <LookStage
          look={resolveLook(state.equipped)}
          items={state.items}
          name={shop.student.displayName}
          caption="Your look"
        />
        <div className={styles.reset}>
          {confirmReset ? (
            <>
              <p>Take everything off and go back to the default look? You keep all your items.</p>
              <div className={styles.buttons}>
                <Button
                  disabled={pending !== null}
                  onClick={() => {
                    void reset();
                  }}
                >
                  Restore default look
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setConfirmReset(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="secondary"
              disabled={!wearing || pending !== null}
              onClick={() => {
                setConfirmReset(true);
              }}
            >
              <RotateCcw aria-hidden="true" /> Restore the default look
            </Button>
          )}
        </div>
      </aside>

      <section className={styles.main} aria-labelledby="collection-heading">
        <div className={styles.intro}>
          <h2 id="collection-heading">My collection</h2>
          <p>
            You own {formatCount(owned.length, 'item')} of {state.items.length}
            {bought > 0 ? `, including ${formatCount(bought, 'item')} you bought` : ''}. Choose what
            to wear: one of each kind.{' '}
            {bought === 0 && <Link to={paths.student.shop}>Browse the shop</Link>}
          </p>
        </div>
        <div aria-live="polite" className={styles.live}>
          {message && <p className={styles.message}>{message}</p>}
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {COSMETIC_CATEGORIES.map((category) => {
          const items = owned.filter((item) => item.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} className={styles.group} aria-labelledby={`owned-${category}`}>
              <h3 id={`owned-${category}`}>
                {CATEGORY_LABELS[category].many} <span>{items.length}</span>
              </h3>
              <ul className={styles.grid}>
                {items.map((item) => {
                  const equipped = state.equipped[category] === item.id;
                  const byDefault = isWornByDefault(state, item);
                  return (
                    <li key={item.id} className={styles.item} data-equipped={equipped || byDefault}>
                      <div className={styles.art} data-rarity={item.rarity}>
                        <ItemArt item={item} wearer={state.equipped} />
                      </div>
                      <div className={styles.info}>
                        <strong>{item.name}</strong>
                        <RarityLabel rarity={item.rarity} />
                      </div>
                      {byDefault ? (
                        <p className={styles.default}>
                          <Check aria-hidden="true" /> Wearing (default)
                        </p>
                      ) : equipped ? (
                        <Button
                          variant="secondary"
                          disabled={pending !== null}
                          aria-label={`Unequip ${item.name}`}
                          onClick={() => {
                            void change(item, false);
                          }}
                        >
                          <Check aria-hidden="true" /> Wearing
                        </Button>
                      ) : (
                        <Button
                          disabled={pending !== null}
                          aria-label={`Equip ${item.name}`}
                          onClick={() => {
                            void change(item, true);
                          }}
                        >
                          Equip
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </section>
    </div>
  );
}
