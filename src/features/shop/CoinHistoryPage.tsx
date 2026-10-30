import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { CoinAmount } from '@/components/ui/CoinAmount';
import { paths } from '@/config/paths';
import { COIN_RULES, type ShopState, type ShopTransaction } from '@/domain/shop';
import { formatShortDate } from '@/lib/dates';
import { useShop } from './useShop';
import styles from './CoinHistoryPage.module.css';

function describe(entry: ShopTransaction, state: ShopState): string {
  switch (entry.reason) {
    case 'welcome':
      return 'Welcome gift';
    case 'correct_answer':
      return 'First correct answer to a question';
    case 'lesson_complete':
      return 'Finished a lesson';
    case 'purchase':
      return `Bought ${state.items.find((item) => item.id === entry.itemId)?.name ?? 'an item'}`;
  }
}

/** The latest coins earned and spent, and how to earn more. */
export function CoinHistoryPage() {
  const { state } = useShop();
  return (
    <div className={styles.layout}>
      <section className={styles.history} aria-labelledby="history-heading">
        <h2 id="history-heading">Recent coin activity</h2>
        <ul>
          {state.transactions.map((entry) => (
            <li key={entry.id}>
              <span>
                <strong>{describe(entry, state)}</strong>
                <small>{formatShortDate(new Date(entry.createdAt))}</small>
              </span>
              <span className={styles.delta} data-positive={entry.delta > 0}>
                <CoinAmount amount={Math.abs(entry.delta)} prefix={entry.delta > 0 ? '+' : '−'} />
              </span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>The latest 20 changes. Every coin is saved to your account.</p>
      </section>
      <aside className={styles.earn} aria-labelledby="earn-heading">
        <Sparkles aria-hidden="true" />
        <h2 id="earn-heading">How to earn coins</h2>
        <ul>
          <li>{COIN_RULES.welcome} coins to welcome you.</li>
          <li>
            {COIN_RULES.firstCorrectAnswer} coins the first time you solve each lesson question.
          </li>
          <li>
            {COIN_RULES.lessonComplete} coins each time you finish a lesson, plus{' '}
            {COIN_RULES.lessonFirstTryBonus} for every question right on the first try. Up to{' '}
            {COIN_RULES.rewardedLessonsPerDay} lessons a day earn coins.
          </li>
        </ul>
        <p>Coins are only for looks. They never change questions, marks or hints.</p>
        <Link to={paths.student.learn}>
          Go to Learn <ArrowRight aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
