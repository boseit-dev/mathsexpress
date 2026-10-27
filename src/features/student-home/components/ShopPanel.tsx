import { CircleUserRound, Palette, ShieldCheck, Store, type LucideIcon } from 'lucide-react';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { CoinAmount } from '@/components/ui/CoinAmount';
import { IconTile, type IconTileTone } from '@/components/ui/IconTile';
import { Panel } from '@/components/ui/Panel';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { paths } from '@/config/paths';
import { getCoinsNeeded, type ShopItem, type ShopItemCategory } from '@/domain/rewards';
import { formatNumber } from '@/lib/format';
import styles from './ShopPanel.module.css';

const CATEGORY_DISPLAY: Record<ShopItemCategory, { icon: LucideIcon; tone: IconTileTone }> = {
  theme: { icon: Palette, tone: 'brand' },
  avatar: { icon: CircleUserRound, tone: 'coin' },
  'power-up': { icon: ShieldCheck, tone: 'success' },
};

interface ShopPanelProps {
  items: readonly ShopItem[];
  coinBalance: number;
}

/** The coin balance and a few featured shop items. Buying happens in the shop itself. */
export function ShopPanel({ items, coinBalance }: ShopPanelProps) {
  return (
    <Panel
      title="Coin shop"
      icon={Store}
      action={
        <p className={styles.balance}>
          <VisuallyHidden>Your balance: </VisuallyHidden>
          <CoinAmount amount={coinBalance} />
        </p>
      }
      footer={<ArrowLink to={paths.student.shop}>Go to the shop</ArrowLink>}
    >
      <p className={styles.intro}>Spend your coins on themes, avatar frames and power-ups.</p>
      {items.length > 0 && (
        <ul role="list" className={styles.list}>
          {items.map((item) => {
            const coinsNeeded = getCoinsNeeded(item.price, coinBalance);
            const display = CATEGORY_DISPLAY[item.category];
            return (
              <li key={item.id} className={styles.item}>
                <IconTile icon={display.icon} tone={display.tone} />
                <div className={styles.info}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.description}>{item.description}</p>
                </div>
                <div className={styles.price}>
                  <CoinAmount amount={item.price} />
                  {coinsNeeded > 0 && (
                    <p className={styles.needed}>{formatNumber(coinsNeeded)} more needed</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
