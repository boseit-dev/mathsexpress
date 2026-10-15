const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('login proxy release bumps the auth bundle and service worker cache', () => {
  const app = fs.readFileSync(path.join(__dirname, '../public/app.html'), 'utf8');
  const sw = fs.readFileSync(path.join(__dirname, '../public/service-worker.js'), 'utf8');
  // The auth bundle lives in deploy-core-1.js, so a login fix only reaches a
  // returning browser if its ?v= string changes. Read the version rather than
  // pinning it, so this keeps guarding after the next release instead of just
  // failing.
  const version = app.match(/deploy-core-1\.js\?v=([0-9.]+)/)?.[1];
  assert.ok(version, 'deploy-core-1.js must be cache-busted in app.html');
  assert.match(sw, new RegExp(`mathsexpress-v${version.replace(/\./g, '-')}\\b`),
    `service-worker cache should track deploy-core-1.js (v${version})`);
  assert.match(sw, /const CACHE='mathsexpress-v11-5-35-mc-freeze-and-caching'/);
});
