const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function loadCore2() {
  const sandbox = { window: { __modules: Object.create(null) }, console, Math, Date, JSON, Number, String, Boolean, Array, Object, RegExp, Error, Set, Map, Promise };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  // Run only the driving-game module; other modules in the bundle need browser APIs and core-1.
  const bundle = read('public/deploy-core-2.js');
  const start = bundle.indexOf('// module: src/core/driving-game.js');
  const end = bundle.indexOf('// module:', start + 10);
  vm.runInContext(`var __modules = window.__modules;\n${bundle.slice(start, end)}`, sandbox);
  return sandbox.window.__modules['src/core/driving-game.js'];
}

function seeded(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

test('deterministic questions are identical for the same seed, so friend challenge codes work', () => {
  const { createDrivingQuestion } = loadCore2();
  // Prime the per-tab recent-prompt memory so a non-deterministic call would diverge.
  for (let i = 0; i < 40; i++) createDrivingQuestion(9);
  const a = []; const b = [];
  const ra = seeded(42), rb = seeded(42);
  for (let i = 0; i < 10; i++) a.push(createDrivingQuestion(9, ra, [], { deterministic: true }));
  for (let i = 0; i < 10; i++) b.push(createDrivingQuestion(9, rb, [], { deterministic: true }));
  assert.deepEqual(a.map(q => [q.prompt, q.options.map(o => o.value)]), b.map(q => [q.prompt, q.options.map(o => o.value)]));
});

test('friend challenge code is no longer a client-side timestamp', () => {
  const app = read('public/deploy-app.js');
  assert.doesNotMatch(app, /MX\$\{String\(Date\.now\(\)\)/);
  assert.match(app, /function parseFriendChallengeCode/);
});

test('class game calls use RPCs that exist, not the never-built _v114 names', () => {
  const core = read('public/deploy-core-1.js');
  for (const name of ['class_game_join', 'class_game_leaderboard', 'class_game_answer', 'record_daily_question_attempt']) {
    assert.doesNotMatch(core, new RegExp(`mathsexpress_${name}_v114`));
  }
});

test('the startup fail-safe is an external script, so the CSP lets it run', () => {
  const html = read('public/app.html');
  assert.doesNotMatch(html, /<script>(?!<\/script>)/);
  assert.doesNotMatch(html, /\son[a-z]+=/);
  assert.match(html, /<script src="\.\/startup-failsafe\.js\?v=/);
  assert.match(read('public/service-worker.js'), /'\.\/startup-failsafe\.js'/);
});

test('no stale netlify domain is advertised', () => {
  for (const file of ['public/robots.txt', 'public/sitemap.xml', 'public/index.html', 'public/app.html', 'public/deploy-app.js']) {
    assert.doesNotMatch(read(file), /mathsexpress\.netlify\.app/, file);
  }
});

test('driving game remnants are gone from achievements, shop and owner console', () => {
  const core = read('public/deploy-core-1.js');
  const app = read('public/deploy-app.js');
  assert.doesNotMatch(core, /id: 'drive-1000'|drive-extra-|category:'gameSkin',name/);
  assert.doesNotMatch(app, /'set-drive-score'|'clear-drive-score'/);
});

test('signup asks for a class code and a password confirmation', () => {
  const app = read('public/deploy-app.js');
  assert.match(app, /id="auth-signup-class-code"/);
  assert.match(app, /id="auth-signup-password-confirm"/);
  assert.match(app, /The two passwords do not match/);
});
