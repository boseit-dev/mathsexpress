// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { allowConnectionsTo } from './content-security-policy.ts';

const headersPath = fileURLToPath(new URL('../../public/_headers', import.meta.url));

describe('allowConnectionsTo', () => {
  it('adds the Supabase address to the site’s connect-src, and nothing else', () => {
    const headers = readFileSync(headersPath, 'utf8');
    const updated = allowConnectionsTo(headers, 'https://abc.supabase.co');
    expect(updated).toContain("connect-src 'self' https://abc.supabase.co;");
    expect(updated.replace(' https://abc.supabase.co', '')).toBe(headers);
  });

  it('does not add an address twice', () => {
    const once = allowConnectionsTo("connect-src 'self'; img-src 'self'", 'http://127.0.0.1:55321');
    expect(allowConnectionsTo(once, 'http://127.0.0.1:55321')).toBe(once);
  });

  it('refuses values that are not a single origin', () => {
    for (const value of [
      'abc.supabase.co',
      "https://a.co 'unsafe-inline'",
      'https://a.co/path',
      '*',
    ]) {
      expect(() => allowConnectionsTo("connect-src 'self'", value)).toThrow();
    }
  });

  it('fails loudly if the policy has no connect-src', () => {
    expect(() => allowConnectionsTo("default-src 'self'", 'https://abc.supabase.co')).toThrow(
      /no connect-src/,
    );
  });
});
