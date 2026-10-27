import type { RequestOptions } from '../repositories';

/**
 * Returns sample data with the same contract as a network request: it resolves asynchronously,
 * rejects if the request was cancelled, and hands out a copy that callers cannot use to change
 * the shared sample objects.
 */
export async function respond<T>(value: T, { signal }: RequestOptions = {}): Promise<T> {
  await Promise.resolve();
  signal?.throwIfAborted();
  return structuredClone(value);
}
