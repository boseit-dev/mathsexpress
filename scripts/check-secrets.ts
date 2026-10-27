// Blocks credentials from being committed.
//   --staged  scan the files staged for commit (used by .githooks/pre-commit)
//   --all     scan every tracked file (used by CI)
import { execFileSync } from 'node:child_process';
import { findSecrets, isSensitiveFilePath } from './lib/secrets.ts';

const mode = process.argv[2];
if (mode !== '--staged' && mode !== '--all') {
  console.error('Usage: node scripts/check-secrets.ts --staged | --all');
  process.exit(2);
}

function git(args: string[]): Buffer {
  return execFileSync('git', args, { maxBuffer: 64 * 1024 * 1024 });
}

const paths = (
  mode === '--staged'
    ? git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'])
    : git(['ls-files', '-z'])
)
  .toString('utf8')
  .split('\0')
  .filter((path) => path !== '');

const problems: string[] = [];

for (const path of paths) {
  if (isSensitiveFilePath(path)) {
    problems.push(`${path}: this file type holds local credentials and must not be committed`);
    continue;
  }
  // ":path" reads the copy in the git index: the staged version, or the committed one in CI.
  const contents = git(['show', `:${path}`]);
  if (contents.includes(0)) continue; // binary file

  for (const finding of findSecrets(contents.toString('utf8'))) {
    problems.push(`${path}:${finding.line}: looks like a ${finding.kind}`);
  }
}

if (problems.length > 0) {
  console.error('Possible credentials found. Remove them before committing:');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
