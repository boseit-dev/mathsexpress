import { useId } from 'react';
import { Search } from 'lucide-react';
import styles from './TableToolbar.module.css';

interface TableToolbarProps {
  searchLabel: string;
  query: string;
  onQueryChange: (query: string) => void;
  sortLabel?: string;
  sort?: string;
  sortOptions?: readonly { value: string; label: string }[];
  onSortChange?: (value: string) => void;
  /** Announced when the search changes what is shown, e.g. "2 students of 30 match". */
  summary?: string;
}

/** Search, and optionally sorting, above a list or table. Filtering happens as you type. */
export function TableToolbar({
  searchLabel,
  query,
  onQueryChange,
  sortLabel,
  sort,
  sortOptions,
  onSortChange,
  summary,
}: TableToolbarProps) {
  const id = useId();
  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <label htmlFor={`${id}-search`} className={styles.label}>
          {searchLabel}
        </label>
        <div className={styles.inputWrap}>
          <Search aria-hidden="true" />
          <input
            id={`${id}-search`}
            type="search"
            className={styles.input}
            value={query}
            autoComplete="off"
            onChange={(event) => {
              onQueryChange(event.target.value);
            }}
          />
        </div>
      </div>
      {sortOptions && onSortChange && (
        <div className={styles.sort}>
          <label htmlFor={`${id}-sort`} className={styles.label}>
            {sortLabel ?? 'Sort by'}
          </label>
          <select
            id={`${id}-sort`}
            className={styles.select}
            value={sort}
            onChange={(event) => {
              onSortChange(event.target.value);
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <p role="status" className={styles.summary}>
        {summary}
      </p>
    </div>
  );
}
