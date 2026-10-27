// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { findSecrets, isSensitiveFilePath } from './secrets.ts';

// Fake credentials are assembled at runtime so this file never contains a real-looking secret.
const fake = (...parts: string[]) => parts.join('');
const jwtSegment = 'A'.repeat(24);

describe('findSecrets', () => {
  it.each([
    ['JSON Web Token', fake('eyJ', jwtSegment, '.eyJ', jwtSegment, '.', jwtSegment)],
    ['Supabase secret key', fake('sb_', 'secret_', 'x'.repeat(24))],
    ['Stripe secret key', fake('sk_', 'live_', '4'.repeat(24))],
    ['GitHub token', fake('gh', 'p_', 'a'.repeat(36))],
    ['AWS access key', fake('AK', 'IA', 'B'.repeat(16))],
    ['Slack token', fake('xo', 'xb-', '1'.repeat(12))],
    ['Private key', fake('-----BEGIN ', 'RSA PRIVATE KEY', '-----')],
  ])('detects a %s', (kindStart, secret) => {
    const findings = findSecrets(`const config = {\n  key: "${secret}",\n};`);
    expect(findings).toEqual([{ line: 2, kind: expect.stringContaining(kindStart) as string }]);
  });

  it('ignores ordinary code and public identifiers', () => {
    const text = [
      "const supabaseUrl = 'https://example.supabase.co';",
      "const publishable = 'sb_publishable_example';",
      'const skill = "sk_algebra_basics";',
    ].join('\n');
    expect(findSecrets(text)).toEqual([]);
  });
});

describe('isSensitiveFilePath', () => {
  it.each([
    '.env',
    '.env.local',
    'app/.env.production',
    '.dev.vars',
    '.dev.vars.staging',
    'key.pem',
  ])('flags %s', (path) => {
    expect(isSensitiveFilePath(path)).toBe(true);
  });

  it.each(['.env.example', 'src/env.ts', 'docs/environment.md', '.envrc.md'])(
    'allows %s',
    (path) => {
      expect(isSensitiveFilePath(path)).toBe(false);
    },
  );
});
