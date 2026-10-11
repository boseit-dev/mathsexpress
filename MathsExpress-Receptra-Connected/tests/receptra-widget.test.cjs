'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');
const widget = fs.readFileSync(path.join(pub, 'receptra-widget.js'), 'utf8');
const expected = 'https://receptra-staging.aarush-sharma6.workers.dev';
const expectedKey = 'pk_ce260ad7ed8e43b69f8be0c384745306ed9f';

function loadWidget(hostname, found = false) {
  const appended = [];
  const doc = {
    querySelector: (selector) => selector === 'script[data-receptra-key]' && found ? {} : null,
    createElement: (tag) => {
      assert.equal(tag, 'script');
      return { setAttribute(key, val) { this[key] = val; } };
    },
    head: { appendChild(node) { appended.push(node); } }
  };
  vm.runInNewContext(widget, {window: {location: {hostname}}, document: doc}, {timeout: 1000});
  return appended;
}

test('MathsExpress homepage loads the local widget installer, not a secret or third-party embed in the app', () => {
  const home = fs.readFileSync(path.join(pub, 'index.html'),'utf8');
  const app = fs.readFileSync(path.join(pub, 'app.html'),'utf8');
  assert.match(home, /<script src="\.\/receptra-widget\.js" defer><\/script>/);
  assert.doesNotMatch(app, /receptra-widget|data-receptra-key/);
});

test('widget script only runs on the intended public MathsExpress domain', () => {
  assert.equal(loadWidget('localhost').length, 0);
  assert.equal(loadWidget('example.com').length, 0);
  assert.equal(loadWidget('mathsexpress.aarush-sharma6.workers.dev').length, 1);
});

test('widget loader installs correct public script and key without repeating it', () => {
  const [script] = loadWidget('mathsexpress.aarush-sharma6.workers.dev');
  assert.equal(script.src, `${expected}/widget.js`);
  assert.equal(script['data-receptra-key'], expectedKey);
  assert.equal(script.async, true);
  assert.equal(script.referrerPolicy, 'strict-origin');
  assert.equal(loadWidget('mathsexpress.aarush-sharma6.workers.dev', true).length, 0);
});

test('CSP allows the exact Receptra origin for scripts, frames, and connections', () => {
  const h = fs.readFileSync(path.join(pub, '_headers'),'utf8');
  const csp = h.split('\n').find(x => x.includes('Content-Security-Policy:'));
  assert.ok(csp);
  for (const directive of ['script-src','frame-src','connect-src']) {
    assert.match(csp, new RegExp(`(?:^|;)\\s*${directive}[^;]*${expected.replaceAll('.', '\\.')}[;]`));
  }
  assert.match(csp, /default-src 'self'/);
});

test('service worker refreshes cached homepage and caches installer', () => {
  const sw = fs.readFileSync(path.join(pub, 'service-worker.js'),'utf8');
  assert.match(sw, /mathsexpress-v11-5-20-receptra/);
  assert.match(sw, /'\.\/receptra-widget\.js'/);
});

test('MathsExpress worker deployment still targets the existing worker', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(root,'wrangler.jsonc'),'utf8'));
  assert.equal(cfg.name, 'mathsexpress');
  assert.equal(cfg.assets.directory, './public');
  assert.equal(cfg.assets.binding, 'ASSETS');
});
