// Static bundles were served with `max-age=0, must-revalidate`, so every page
// load revalidated all 13 of them. That is a large part of "pages take 5
// seconds to load" on a school network.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const headers = fs.readFileSync(path.join(root, 'public/_headers'), 'utf8');

// "/deploy-app.js\n  Cache-Control: ..." -> { '/deploy-app.js': 'Cache-Control: ...' }
function rules() {
  const out = new Map();
  let current = null;
  for (const line of headers.split('\n')) {
    if (/^\//.test(line)) { current = line.trim(); out.set(current, []); }
    else if (current && line.trim()) out.get(current).push(line.trim());
  }
  return out;
}

function cacheControlFor(route) {
  const found = (rules().get(route) || []).find(h => /^Cache-Control:/i.test(h));
  return found ? found.replace(/^Cache-Control:\s*/i, '') : null;
}

test('every script and stylesheet the pages load is cacheable', () => {
  const pages = ['public/app.html', 'public/index.html']
    .map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
  const assets = new Set(
    [...pages.matchAll(/\.\/([a-z0-9.-]+\.(?:js|css))(?:\?v=[0-9.]+)?/g)].map(m => m[1])
  );
  assert.ok(assets.size >= 10, `expected the bundles, found ${assets.size}`);
  for (const asset of assets) {
    const cc = cacheControlFor(`/${asset}`);
    assert.ok(cc, `${asset} has no Cache-Control, so it is revalidated on every load`);
    assert.match(cc, /max-age=\d+/, `${asset} needs a max-age`);
    assert.doesNotMatch(cc, /max-age=0/, `${asset} is still revalidated every load`);
  }
});

test('the service worker is never cached', () => {
  // It is the mechanism that ships every other update. Cache it and a bad
  // release cannot be replaced.
  assert.match(cacheControlFor('/service-worker.js') || '', /no-cache|no-store/);
});

test('entry points are revalidated so new ?v= strings are picked up', () => {
  for (const page of ['/app.html', '/index.html']) {
    assert.match(cacheControlFor(page) || '', /no-cache|no-store/, `${page} must revalidate`);
  }
});

test('no wildcard js rule, which would also catch the service worker', () => {
  assert.doesNotMatch(headers, /^\/\*\.js$/m);
});
