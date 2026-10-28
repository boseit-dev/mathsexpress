import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWithTimeout } from './client';

/** A fetch that never answers until its signal cancels it, like a stalled server. */
function stalledFetch(_input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => {
      reject(init.signal?.reason as Error);
    });
  });
}

describe('fetchWithTimeout', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('gives up on a server that never answers', async () => {
    vi.stubGlobal('fetch', vi.fn(stalledFetch));
    await expect(fetchWithTimeout('https://example.test', {}, 20)).rejects.toMatchObject({
      name: 'TimeoutError',
    });
  });

  it('still lets the caller cancel the request', async () => {
    vi.stubGlobal('fetch', vi.fn(stalledFetch));
    const controller = new AbortController();
    const request = fetchWithTimeout('https://example.test', { signal: controller.signal }, 10_000);
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
  });
});
