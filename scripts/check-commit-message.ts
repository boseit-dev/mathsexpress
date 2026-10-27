// Used by .githooks/commit-msg: rejects messages that don't follow the project format.
import { readFileSync } from 'node:fs';
import { validateCommitMessage } from './lib/commit-message.ts';

const messageFile = process.argv[2];
if (messageFile === undefined) {
  console.error('Usage: node scripts/check-commit-message.ts <commit-message-file>');
  process.exit(2);
}

const problems = validateCommitMessage(readFileSync(messageFile, 'utf8'));
if (problems.length > 0) {
  console.error('Commit message rejected (see "Commit messages" in CLAUDE.md):');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
