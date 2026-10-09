const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('login proxy release bumps the auth bundle and service worker cache', () => {
  const app = fs.readFileSync(path.join(__dirname, '../public/app.html'), 'utf8');
  const sw = fs.readFileSync(path.join(__dirname, '../public/service-worker.js'), 'utf8');
  assert.match(app, /deploy-core-1\.js\?v=11\.5\.18/);
  assert.match(sw, /const CACHE='mathsexpress-v11-5-19-receptra'/);
});
