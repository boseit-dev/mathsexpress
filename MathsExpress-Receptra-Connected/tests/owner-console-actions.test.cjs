const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'public/deploy-app.js'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'worker.js'), 'utf8');
const between = (start, end) => app.slice(app.indexOf(start), app.indexOf(end));

test('every Owner Control Room tile is handled instead of falling to the unavailable command', () => {
  const ui = between('function openOwnerConsole() {', 'function completeAllQuests(');
  const handler = between('function applyOwnerAction(action) {', 'async function openEducationDomainsModal(');
  const tiles = [...ui.matchAll(/ownerActionButton\(\s*'([^']+)'/g)].map(m => m[1]);
  assert.equal(tiles.length, 43, 'Review test if owner tiles are added or removed');
  const missing = tiles.filter(action => !handler.includes(`'${action}'`));
  assert.deepEqual(missing, [], `Owner tiles missing a click handler: ${missing.join(', ')}`);
});

test('Create Account Owner tile uses the real, Owner-restricted form', () => {
  assert.match(app, /else if \(action === 'owner-create-account'\) \{ closeOwnerConsole\(\); return openOwnerCreateAccountModal\(\); \}/);
  assert.match(app, /if \(action === 'owner-create-account'\) return openOwnerCreateAccountModal\(\);/);
  assert.match(app, /function openOwnerCreateAccountModal\(\) \{\s*if \(!canUseOwnerConsole\(account\)\)/);
  assert.match(app, /<form id="owner-create-account-form"/);
  assert.match(app, /fetch\('\/api\/owner\/create-user'/);
});

test('account creation is handled on the server, not with a browser-exposed admin key', () => {
  assert.match(worker, /if\(routePath==='\/api\/owner\/create-user'\) return __mxOwnerCreateUser\(request,env\)/);
  assert.match(worker, /if\(!env\?\.SUPABASE_SERVICE_ROLE_KEY\)return __mxJson/);
  assert.match(worker, /mathsexpress_is_platform_admin/);
});

test('owner action patch refreshes the static script and service worker cache', () => {
  const appHtml = fs.readFileSync(path.join(root, 'public/app.html'), 'utf8');
  const sw = fs.readFileSync(path.join(root, 'public/service-worker.js'), 'utf8');
  assert.match(appHtml, /deploy-app\.js\?v=11\.5\.34/);
  assert.match(sw, /mathsexpress-v11-5-35-mc-freeze-and-caching/);
});
