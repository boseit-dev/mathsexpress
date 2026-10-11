const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const worker = fs.readFileSync(path.join(root, 'worker.js'), 'utf8');
const config = fs.readFileSync(path.join(root, 'public', 'mathsexpress-config.js'), 'utf8');
const appHtml = fs.readFileSync(path.join(root, 'public', 'app.html'), 'utf8');

const ACTIVE_REF = 'dsjrxkxjcaurrbijihja';
const ACTIVE_URL = `https://${ACTIVE_REF}.supabase.co`;
const ACTIVE_KEY = 'sb_publishable_Df5UQ8PeQgUnWQ_4VT91DQ_j85oh6fv';
const INACTIVE_REF = 'ewpncbgqutftiqhtkpfl';

test('production auth points at the active MathsExpress Supabase project', () => {
  for (const [name, text] of [['worker.js', worker], ['mathsexpress-config.js', config], ['app.html', appHtml]]) {
    assert.ok(text.includes(ACTIVE_URL), `${name} must reference the active MathsExpress project URL`);
    assert.ok(!text.includes(INACTIVE_REF), `${name} must not reference the inactive ExpressEducation project`);
  }
  assert.ok(worker.includes(ACTIVE_KEY), 'worker.js must contain the active publishable key fallback');
  assert.ok(config.includes(ACTIVE_KEY), 'client config must contain the active publishable key');
});
