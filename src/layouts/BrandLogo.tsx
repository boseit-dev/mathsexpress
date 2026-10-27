import { Link } from 'react-router';
import { BrandMark } from './BrandMark';
import styles from './BrandLogo.module.css';

/** The MathsExpress logo, linking to the home page of the current area. */
export function BrandLogo({ to }: { to: string }) {
  return (
    <Link to={to} className={styles.logo} aria-label="MathsExpress home">
      <BrandMark className={styles.mark} />
      <span className={styles.wordmark}>
        Maths<span className={styles.express}>Express</span>
      </span>
    </Link>
  );
}
