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
    ['Stripe webhook secret', fake('wh', 'sec_', 'W'.repeat(32))],
    ['Supabase access token', fake('sb', 'p_', 'a1'.repeat(20))],
    ['Resend API key', fake('re', '_Ab12Cd34', '_', 'Q'.repeat(24))],
    ['Groq API key', fake('gs', 'k_', 'z'.repeat(52))],
    ['npm token', fake('np', 'm_', 'N'.repeat(36))],
    ['AI provider API key', fake('sk', '-ant-', 'k'.repeat(40))],
    [
      'password inside a connection URL',
      fake('postgres://', 'admin:', 'S3cretP4ss', '@db.example.com/app'),
    ],
    ['credential written into code or config', fake('api', 'Key: "', 'r'.repeat(32), '"')],
  ])('detects a %s', (kindStart, secret) => {
    const findings = findSecrets(`const config = {\n  key: "${secret}",\n};`);
    expect(findings).toEqual([{ line: 2, kind: expect.stringContaining(kindStart) as string }]);
  });

  it('detects a credential on an environment-variable line', () => {
    const line = fake('CLOUDFLARE_API_', 'TOKEN=', 'c'.repeat(40));
    expect(findSecrets(line)).toEqual([
      { line: 1, kind: 'credential in an environment-variable line' },
    ]);
  });

  it('ignores ordinary code, placeholders and references to secrets', () => {
    const text = [
      "const supabaseUrl = 'https://example.supabase.co';",
      "const publishable = 'sb_publishable_example';",
      'const skill = "sk_algebra_basics";',
      'const password = getPasswordFromForm();',
      "const apiKey = 'CHANGE_ME_BEFORE_RUNNING';",
      'SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}',
      'RESEND_API_KEY=your-resend-api-key-here',
      'const url = `postgres://${user}:${password}@localhost/app`;',
      'function re_validate_assignment_status() {}',
      'openai_api_key = "env(OPENAI_API_KEY)"',
      's3_secret_key = "env(S3_SECRET_KEY)"',
      "  forgotPassword: '/forgot-password',",
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
