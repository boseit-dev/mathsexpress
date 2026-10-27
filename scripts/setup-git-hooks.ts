// Runs on `npm install`: points git at the versioned hooks in .githooks so every clone
// gets the same commit-message and pre-push checks.
import { execFileSync } from 'node:child_process';

function isGitCheckout(): boolean {
  try {
    execFileSync('git', ['rev-parse', '--git-dir'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (isGitCheckout()) {
  execFileSync('git', ['config', 'core.hooksPath', '.githooks']);
}
