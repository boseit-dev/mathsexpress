// Detects credentials before they reach the public GitHub repository.

export interface SecretFinding {
  line: number;
  kind: string;
}

interface SecretPattern {
  kind: string;
  pattern: RegExp;
}

const SECRET_PATTERNS: readonly SecretPattern[] = [
  {
    kind: 'JSON Web Token (for example a Supabase service-role key)',
    pattern: /\beyJ[\w-]{10,}\.eyJ[\w-]{10,}\.[\w-]{10,}/,
  },
  { kind: 'Supabase secret key', pattern: /\bsb_secret_[\w-]{20,}/ },
  { kind: 'Stripe secret key', pattern: /\b[rs]k_(?:live|test)_[0-9A-Za-z]{16,}/ },
  { kind: 'GitHub token', pattern: /\b(?:gh[oprsu]_[0-9A-Za-z]{30,}|github_pat_\w{30,})/ },
  { kind: 'AWS access key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { kind: 'Slack token', pattern: /\bxox[abprs]-[0-9A-Za-z-]{10,}/ },
  { kind: 'Private key', pattern: /-----BEGIN (?:[A-Z]+ )*PRIVATE KEY-----/ },
  { kind: 'Stripe webhook secret', pattern: /\bwhsec_[0-9A-Za-z]{24,}/ },
  { kind: 'Supabase access token', pattern: /\bsbp_(?:oauth_)?[0-9a-f]{40}\b/ },
  { kind: 'Resend API key', pattern: /\bre_[0-9A-Za-z]{6,12}_[0-9A-Za-z]{20,}/ },
  { kind: 'Groq API key', pattern: /\bgsk_[0-9A-Za-z]{40,}/ },
  { kind: 'npm token', pattern: /\bnpm_[0-9A-Za-z]{36}\b/ },
  { kind: 'AI provider API key', pattern: /\bsk-(?:ant|proj)-[\w-]{20,}/ },
  {
    kind: 'password inside a connection URL',
    pattern: /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:@'"]+:(?![$<*])[^\s/@'"]{8,}@/,
  },
  {
    // apiKey: "…", "client_secret": "…", password = '…' — but not placeholders like CHANGE_ME.
    kind: 'credential written into code or config',
    pattern:
      /(?:service[_-]?role[_-]?key|api[_-]?(?:key|token)|access[_-]?token|client[_-]?secret|secret[_-]?key|webhook[_-]?secret|password)['"]?\s*[:=]\s*['"](?!(?:your|example|placeholder|change[_-]?me|x{4}))[^'"\s]{16,}['"]/i,
  },
  {
    // .env-style line: CLOUDFLARE_API_TOKEN=… (not a ${VARIABLE} reference or a placeholder)
    kind: 'credential in an environment-variable line',
    pattern:
      /^\s*(?:export\s+)?[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*\s*=\s*(?![$<'"]|(?:your|example|placeholder|change_?me)\b)[^\s#]{16,}/,
  },
];

// Files that hold real credentials locally and must never be committed.
const SENSITIVE_FILE_PATTERN =
  /(?:^|\/)(?:\.env(?:\.(?!example$)[^/]+)?|\.dev\.vars(?:\.[^/]+)?|[^/]+\.pem)$/;

export function findSecrets(text: string): SecretFinding[] {
  const findings: SecretFinding[] = [];
  text.split('\n').forEach((content, index) => {
    for (const { kind, pattern } of SECRET_PATTERNS) {
      if (pattern.test(content)) findings.push({ line: index + 1, kind });
    }
  });
  return findings;
}

export function isSensitiveFilePath(path: string): boolean {
  return SENSITIVE_FILE_PATTERN.test(path);
}
