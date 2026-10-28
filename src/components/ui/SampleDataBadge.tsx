import { StatusBadge } from './StatusBadge';

/** Marks content that is development sample data, so it is never mistaken for real data. */
export function SampleDataBadge() {
  return <StatusBadge tone="neutral">Sample data</StatusBadge>;
}
