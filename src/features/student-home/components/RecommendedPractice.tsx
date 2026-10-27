import { Check, Clock, ListChecks, Sparkles, X } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Panel } from '@/components/ui/Panel';
import { paths } from '@/config/paths';
import type { PracticeRecommendation } from '@/domain/recommendation';
import { cx } from '@/lib/cx';
import { formatCount } from '@/lib/format';
import { TopicArt } from './TopicArt';
import styles from './RecommendedPractice.module.css';

interface RecommendedPracticeProps {
  recommendation: PracticeRecommendation | null;
}

/** One suggested topic to practise, beside the recent mistakes it is based on. */
export function RecommendedPractice({ recommendation }: RecommendedPracticeProps) {
  return (
    <Panel title="Your recommended practice" icon={Sparkles}>
      {recommendation === null ? (
        <p className={styles.empty}>
          Answer a few more questions and MathsExpress will suggest what to practise next.
        </p>
      ) : (
        <div className={styles.cards}>
          <article className={styles.card}>
            <div className={styles.topicArt}>
              <TopicArt />
            </div>
            <div className={styles.body}>
              <p className={styles.strand}>{recommendation.strand}</p>
              <h3 className={styles.cardTitle}>{recommendation.topicName}</h3>
              <p className={styles.reason}>{recommendation.reason}</p>
              <p className={styles.meta}>
                <span className={styles.metaItem}>
                  <ListChecks />
                  {formatCount(recommendation.questionCount, 'question')}
                </span>
                <span className={styles.metaItem}>
                  <Clock />
                  About {formatCount(recommendation.estimatedMinutes, 'minute')}
                </span>
              </p>
              <ButtonLink to={paths.student.learn} className={styles.action}>
                Start practice
              </ButtonLink>
            </div>
          </article>

          {recommendation.mistakes.length > 0 && (
            <article className={styles.card}>
              <div className={styles.reviewHeader}>
                <h3 className={styles.reviewTitle}>Quick review</h3>
                <p className={styles.reviewCount}>
                  {formatCount(recommendation.mistakes.length, 'recent mistake')} to look over
                </p>
              </div>
              <div className={styles.body}>
                <ul role="list" className={styles.mistakes}>
                  {recommendation.mistakes.map((mistake) => (
                    <li key={mistake.id} className={styles.mistake}>
                      <p className={styles.question}>{mistake.question}</p>
                      <dl className={styles.answers}>
                        <div className={cx(styles.answer, styles.given)}>
                          <dt>
                            <X />
                            Your answer:
                          </dt>
                          <dd>{mistake.givenAnswer}</dd>
                        </div>
                        <div className={cx(styles.answer, styles.correct)}>
                          <dt>
                            <Check />
                            Correct:
                          </dt>
                          <dd>{mistake.correctAnswer}</dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )}
        </div>
      )}
    </Panel>
  );
}
