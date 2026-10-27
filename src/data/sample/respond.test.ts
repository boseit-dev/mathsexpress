import { describe, expect, it } from 'vitest';
import { respond } from './respond';

describe('respond', () => {
  it('resolves with a copy that cannot change the original', async () => {
    const original = { coins: 10 };
    const copy = await respond(original);
    copy.coins = 99;
    expect(original.coins).toBe(10);
  });

  it('rejects when the request has been cancelled', async () => {
    const controller = new AbortController();
    controller.abort(new Error('Navigated away'));
    await expect(respond({}, { signal: controller.signal })).rejects.toThrow('Navigated away');
  });
});
