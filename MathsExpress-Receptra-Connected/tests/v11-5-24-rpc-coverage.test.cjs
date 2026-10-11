const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

// Functions that existed on the live project when last audited (12 Oct 2026), plus everything the
// migrations in supabase/migrations create. A client call outside this set is a feature that cannot work.
function knownFunctions() {
  const known = new Set(read('tests/fixtures/live-public-functions-2026-10-12.txt').split(/\s+/).filter(Boolean));
  for (const f of fs.readdirSync(path.join(root, 'supabase/migrations'))) {
    for (const m of read(`supabase/migrations/${f}`).matchAll(/function\s+public\.(\w+)/g)) known.add(m[1]);
  }
  return known;
}

function calledFunctions() {
  const out = new Map();
  for (const f of ['public/deploy-app.js', 'public/deploy-core-1.js', 'public/deploy-core-2.js', 'public/v7-features.js', 'public/quick-assign-due.js', 'worker.js']) {
    const src = read(f);
    for (const m of src.matchAll(/(?:rpc\(\s*|supabaseRpc\(\s*|rpc\(a,\s*|rpc\/)['"`]?((?:mathsexpress|mathrift|express|account)_\w+)/g)) {
      if (!out.has(m[1])) out.set(m[1], f);
    }
  }
  return out;
}

test('every RPC the client and Worker call exists live or is created by a migration', () => {
  const known = knownFunctions();
  const missing = [...calledFunctions()].filter(([name]) => !known.has(name)).map(([n, f]) => `${n} (${f})`);
  assert.deepEqual(missing, []);
});

test('the never-built _v114 reward RPC is no longer called', () => {
  assert.doesNotMatch(read('public/deploy-core-1.js'), /award_question_reward_v114/);
});

test('new SECURITY DEFINER functions are never executable by anon', () => {
  const sql = read('supabase/migrations/20261012_01_missing_rpcs.sql');
  assert.match(sql, /revoke all on function public\.%s from public, anon/);
  const defs = [...sql.matchAll(/create or replace function public\.(\w+)/g)].map(m => m[1]);
  for (const name of defs) assert.match(sql, new RegExp(`'${name}\\(`), `${name} is missing from the grant list`);
});

test('reports read stored evidence rather than invented numbers', () => {
  const sql = read('supabase/migrations/20261012_01_missing_rpcs.sql');
  assert.doesNotMatch(sql, /random\(\)/);
  for (const t of ['mathrift_activity', 'mathrift_question_attempts', 'mathrift_assignment_attempts', 'mathsexpress_irt_skill_state']) assert.match(sql, new RegExp(t));
});
