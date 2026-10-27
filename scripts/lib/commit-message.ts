// Validates commit messages against the project format described in CLAUDE.md ("Commit messages").

export const COMMIT_TYPES = [
  'feat',
  'fix',
  'refactor',
  'perf',
  'style',
  'test',
  'docs',
  'build',
  'ci',
  'chore',
  'revert',
] as const;

export const MAX_TITLE_LENGTH = 72;

const TITLE_PATTERN = /^(?<type>[a-z]+)(?:\([a-z0-9][a-z0-9-]*\))?!?: \S/;
const VERSION_LINE_PATTERN = /^Version: \d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?$/;
const TRAILER_PATTERN = /^[A-Za-z][A-Za-z-]*: \S/;
// Only messages git writes itself keep git's own format: merges such as
// "Merge branch 'main' into mathsexpress-v2", and `git revert` messages.
const GIT_MERGE_TITLE_PATTERN =
  /^Merge (?:branch|branches|remote-tracking branch|pull request #\d+|tag|commit) /;
const GIT_REVERT_TITLE_PATTERN = /^Revert ".+"$/;
const GIT_REVERT_BODY_PATTERN = /^This reverts commit [0-9a-f]{7,40}\.?$/;
const SCISSORS_LINE = '# ------------------------ >8 ------------------------';

function cleanMessage(raw: string): string[] {
  const scissorsIndex = raw.indexOf(SCISSORS_LINE);
  const text = scissorsIndex === -1 ? raw : raw.slice(0, scissorsIndex);
  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .map((line) => line.trimEnd());

  while (lines.length > 0 && lines[0] === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

function isCommitType(value: string | undefined): boolean {
  return COMMIT_TYPES.some((type) => type === value);
}

function isGeneratedByGit(title: string, body: readonly string[]): boolean {
  if (GIT_MERGE_TITLE_PATTERN.test(title)) return true;
  return (
    GIT_REVERT_TITLE_PATTERN.test(title) && body.some((line) => GIT_REVERT_BODY_PATTERN.test(line))
  );
}

interface ValidationOptions {
  /** When given, the "Version:" line must state exactly this version (from package.json). */
  expectedVersion?: string;
}

/** Returns a list of problems with the message; an empty list means it is valid. */
export function validateCommitMessage(raw: string, options: ValidationOptions = {}): string[] {
  const lines = cleanMessage(raw);
  const [title = '', separator, ...body] = lines;

  if (title === '') return ['The commit message is empty.'];
  if (isGeneratedByGit(title, body)) return [];

  const problems: string[] = [];
  const titleMatch = TITLE_PATTERN.exec(title);

  if (!titleMatch || !isCommitType(titleMatch.groups?.type)) {
    problems.push(
      `The title must start with a type and a colon, e.g. "feat: add student dashboard layout". Types: ${COMMIT_TYPES.join(', ')}.`,
    );
  }
  if (title.length > MAX_TITLE_LENGTH) {
    problems.push(
      `The title is ${title.length} characters; keep it to ${MAX_TITLE_LENGTH} or fewer.`,
    );
  }
  if (title.endsWith('.')) {
    problems.push('The title must not end with a full stop.');
  }

  if (separator === undefined || body.length === 0) {
    problems.push(
      'Add a detailed description below the title: what changed, why, testing and version.',
    );
    return problems;
  }
  if (separator !== '') {
    problems.push('Leave one blank line between the title and the description.');
  }

  const descriptionLines = body.filter((line) => line !== '' && !TRAILER_PATTERN.test(line));
  if (descriptionLines.length === 0) {
    problems.push('The description must explain what changed and why, not only list trailers.');
  }
  if (!body.some((line) => line.startsWith('Testing:'))) {
    problems.push('Add a "Testing:" section listing the checks that actually ran.');
  }
  const { expectedVersion } = options;
  if (expectedVersion === undefined) {
    if (!body.some((line) => VERSION_LINE_PATTERN.test(line))) {
      problems.push('Add a "Version: x.y.z" line with the version from package.json.');
    }
  } else if (!body.includes(`Version: ${expectedVersion}`)) {
    problems.push(`Add a "Version: ${expectedVersion}" line (the version in package.json).`);
  }

  return problems;
}
