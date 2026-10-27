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
