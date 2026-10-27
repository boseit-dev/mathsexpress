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
// Messages git writes itself (merges, reverts, autosquash) keep git's own format.
const GENERATED_TITLE_PATTERN = /^(?:Merge |Revert "|fixup! |squash! |amend! )/;
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

/** Returns a list of problems with the message; an empty list means it is valid. */
export function validateCommitMessage(raw: string): string[] {
  const lines = cleanMessage(raw);
  const [title = '', separator, ...body] = lines;

  if (title === '') return ['The commit message is empty.'];
  if (GENERATED_TITLE_PATTERN.test(title)) return [];

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
  if (!body.some((line) => VERSION_LINE_PATTERN.test(line))) {
    problems.push('Add a "Version: x.y.z" line with the version from package.json.');
  }

  return problems;
}
