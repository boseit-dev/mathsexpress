// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LIVE_WORKER_NAME, parseJsonc, readWranglerConfig } from './deploy-config.ts';

const wranglerPath = fileURLToPath(new URL('../../wrangler.jsonc', import.meta.url));

// Deployment safety: until the owner approves the 2.0 release, this project must deploy only to
// its own development Worker, never to the live site. Change this test only as part of that release.
describe('wrangler.jsonc', () => {
  const config = readWranglerConfig(wranglerPath);

  it('targets the development Worker, not the live site', () => {
    expect(config.name).toBe('mathsexpress-v2');
    expect(config.name).not.toBe(LIVE_WORKER_NAME);
  });

  it('claims no routes or custom domains', () => {
    expect(config.routes).toBeUndefined();
    expect(config.route).toBeUndefined();
  });
});

describe('parseJsonc', () => {
  it('ignores comments and trailing commas but keeps "//" inside strings', () => {
    const text = `{
      // a comment
      "url": "https://example.com", /* another */
      "list": [1, 2,],
    }`;
    expect(parseJsonc(text)).toEqual({ url: 'https://example.com', list: [1, 2] });
  });
});
