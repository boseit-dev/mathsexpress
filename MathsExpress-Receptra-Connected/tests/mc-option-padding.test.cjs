// mcQuestion pads a multiple-choice question out to four options. It used to
// build every candidate from `Number(answerText)`, which is NaN for a word,
// fraction or symbol, so the candidate was the string 'NaN' on every pass and
// the `continue` spun forever once 'NaN' was taken. That froze the tab, and
// 125 call sites pass non-numeric answers.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const src = fs.readFileSync(path.resolve(__dirname, '..', 'public/deploy-core-1.js'), 'utf8');

// Run the padding block exactly as shipped, so this tests the real source.
function paddingBlock() {
  const start = src.indexOf('  // Pad the options out.');
  const end = src.indexOf('const r = rngFor(', start);
  assert.ok(start > 0 && end > start, 'padding block not found - did mcQuestion move?');
  return src.slice(start, end);
}

function pad(answerText, distractors, timeout = 1500) {
  const seenLabels = new Set([String(answerText)]);
  const answers = [answerText];
  for (const d of distractors) {
    const label = String(d);
    if (seenLabels.has(label)) continue;
    seenLabels.add(label);
    answers.push(d);
    if (answers.length >= 4) break;
  }
  const sandbox = { answers, seenLabels, answerText, String, Number };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(paddingBlock(), sandbox, { timeout });
  return sandbox.answers;
}

const NON_NUMERIC = [
  ['a word', 'evening', ['morning']],
  ['a word with no distractors', 'evening', []],
  ['a fraction', '1/3', ['3/1']],
  ['a symbol', '>', ['<']],
  ['a sentence', 'They are the same length', ['Ribbon A']],
];

for (const [label, answer, distractors] of NON_NUMERIC) {
  test(`padding terminates for ${label}`, () => {
    const options = pad(answer, distractors);
    assert.ok(options.length >= 2, 'a question needs at least two options');
    assert.equal(new Set(options.map(String)).size, options.length, 'options must be distinct');
    assert.ok(!options.some(o => String(o) === 'NaN'), 'NaN must never be offered as an option');
  });
}

test('padding terminates for a number too large to increment', () => {
  // String(1e21 + 1) === String(1e21), so an unbounded loop would never advance.
  assert.doesNotThrow(() => pad('1e21', []));
});

test('a numeric answer is still padded to four near-miss options', () => {
  assert.deepEqual(pad('12', ['13']), ['12', '13', '15', '17']);
  assert.equal(pad('7', []).length, 4);
});

test('real distractors are kept rather than replaced by placeholders', () => {
  assert.deepEqual(pad('evening', ['morning']), ['evening', 'morning']);
});
