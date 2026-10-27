// Blocks credentials from reaching the public repository.
//   --staged              files staged for commit (.githooks/pre-commit)
//   --all                 every tracked file (CI)
//   --commits <revs...>   every file version changed by the given commits, e.g. "origin/main..HEAD"
//                         (.githooks/pre-push and CI), so a secret added and later removed is caught
import { execFileSync } from 'node:child_process';
import { findSecrets, isSensitiveFilePath } from './lib/secrets.ts';

interface FileVersion {
  /** How the file is named in reports, e.g. "src/a.ts" or "1a2b3c4 src/a.ts". */
  label: string;
  path: string;
  /** The git object to read: ":path" for the index, "<commit>:path" for history. */
  object: string;
}

function usage(): never {
  console.error('Usage: node scripts/check-secrets.ts --staged | --all | --commits <revisions...>');
  process.exit(2);
}

function git(args: string[]): Buffer {
  return execFileSync('git', args, { maxBuffer: 64 * 1024 * 1024 });
}

function nulSeparated(output: Buffer): string[] {
  return output
    .toString('utf8')
    .split('\0')
    .filter((path) => path !== '');
}

function inIndex(path: string): FileVersion {
  return { label: path, path, object: `:${path}` };
}

function filesToScan(mode: string | undefined, revisions: string[]): FileVersion[] {
  switch (mode) {
    case '--staged':
      return nulSeparated(git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'])).map(
        inIndex,
      );
    case '--all':
      return nulSeparated(git(['ls-files', '-z'])).map(inIndex);
    case '--commits': {
      if (revisions.length === 0) usage();
      const commits = git(['rev-list', ...revisions])
        .toString('utf8')
        .split('\n')
        .filter((commit) => commit !== '');
      return commits.flatMap((commit) =>
        nulSeparated(
          git([
            'diff-tree',
            '--root',
            '--no-commit-id',
            '--name-only',
            '-r',
            '--diff-filter=ACMR',
            '-z',
            commit,
          ]),
        ).map((path) => ({
          label: `${commit.slice(0, 7)} ${path}`,
          path,
          object: `${commit}:${path}`,
        })),
      );
    }
    default:
      return usage();
  }
}

const [mode, ...revisions] = process.argv.slice(2);
const problems: string[] = [];

for (const file of filesToScan(mode, revisions)) {
  if (isSensitiveFilePath(file.path)) {
    problems.push(
      `${file.label}: this file type holds local credentials and must not be committed`,
    );
    continue;
  }
  const contents = git(['show', file.object]);
  if (contents.includes(0)) continue; // binary file

  for (const finding of findSecrets(contents.toString('utf8'))) {
    problems.push(`${file.label}:${finding.line}: looks like a ${finding.kind}`);
  }
}

if (problems.length > 0) {
  console.error('Possible credentials found. Remove them before committing:');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
