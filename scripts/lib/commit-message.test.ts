// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { validateCommitMessage } from './commit-message.ts';

const VALID_MESSAGE = `feat: add responsive top navigation

Adds the student navigation bar with Home, Learn, Textbook, Class and More.

Testing:
- Vitest: 12 passed

Version: 2.0.0-alpha.1

Co-Authored-By: Example Person <person@example.com>`;

describe('validateCommitMessage', () => {
  it('accepts a complete message', () => {
    expect(validateCommitMessage(VALID_MESSAGE)).toEqual([]);
  });

  it('accepts a scope and a breaking-change marker', () => {
    const message = VALID_MESSAGE.replace('feat:', 'refactor(navigation)!:');
    expect(validateCommitMessage(message)).toEqual([]);
  });

  it('ignores git comment lines and everything below the scissors line', () => {
    const message = `# Please enter the commit message\n${VALID_MESSAGE}\n# ------------------------ >8 ------------------------\ndiff --git a/x b/x`;
    expect(validateCommitMessage(message)).toEqual([]);
  });

  it('skips merge and revert messages that git writes itself', () => {
    expect(validateCommitMessage("Merge branch 'main' into mathsexpress-v2")).toEqual([]);
    expect(validateCommitMessage('Merge pull request #12 from boseit-dev/feature')).toEqual([]);
    expect(
      validateCommitMessage(
        'Revert "feat: add navigation"\n\nThis reverts commit 0cef293a1b2c3d4e5f60718293a4b5c6d7e8f901.',
      ),
    ).toEqual([]);
  });

  it('does not exempt hand-written titles that only look generated', () => {
    expect(validateCommitMessage('Merge in my broken changes')).not.toEqual([]);
    expect(validateCommitMessage('Revert "feat: add navigation"')).not.toEqual([]);
    expect(validateCommitMessage('fixup! feat: add navigation')).not.toEqual([]);
  });

  it('requires the exact package.json version when one is given', () => {
    expect(validateCommitMessage(VALID_MESSAGE, { expectedVersion: '2.0.0-alpha.1' })).toEqual([]);
    expect(validateCommitMessage(VALID_MESSAGE, { expectedVersion: '2.0.0-alpha.2' })).toEqual([
      'Add a "Version: 2.0.0-alpha.2" line (the version in package.json).',
    ]);
  });

  it('rejects an empty message', () => {
    expect(validateCommitMessage('\n# only a comment\n')).toEqual(['The commit message is empty.']);
  });

  it('rejects a title without a known type', () => {
    const problems = validateCommitMessage(VALID_MESSAGE.replace('feat:', 'feature:'));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/must start with a type/);
  });

  it('rejects a title that is too long or ends with a full stop', () => {
    const longTitle = `feat: ${'a'.repeat(70)}.`;
    const problems = validateCommitMessage(VALID_MESSAGE.replace(/^.*$/m, longTitle));
    expect(problems).toEqual([
      expect.stringMatching(/keep it to 72 or fewer/),
      'The title must not end with a full stop.',
    ]);
  });

  it('requires a description', () => {
    expect(validateCommitMessage('feat: add navigation')).toEqual([
      'Add a detailed description below the title: what changed, why, testing and version.',
    ]);
  });

  it('requires a blank line after the title', () => {
    const message = VALID_MESSAGE.replace('\n\nAdds', '\nAdds');
    expect(validateCommitMessage(message)).toEqual([
      'Leave one blank line between the title and the description.',
    ]);
  });

  it('requires testing and version sections', () => {
    const message = 'fix: correct progress\n\nFixes the progress bar rounding.';
    expect(validateCommitMessage(message)).toEqual([
      'Add a "Testing:" section listing the checks that actually ran.',
      'Add a "Version: x.y.z" line with the version from package.json.',
    ]);
  });

  it('rejects a version line that is not semantic versioning', () => {
    const message = VALID_MESSAGE.replace('Version: 2.0.0-alpha.1', 'Version: two');
    expect(validateCommitMessage(message)).toEqual([
      'Add a "Version: x.y.z" line with the version from package.json.',
    ]);
  });
});
