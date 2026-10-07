const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function loadV7Features() {
  const code = fs.readFileSync(path.join(root, 'public', 'v7-features.js'), 'utf8');
  const sandbox = {
    window: { __modules: Object.create(null) },
    console,
    Math, Date, JSON, Number, String, Boolean, Array, Object, RegExp, Error, Set, Map,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.window.__modules['src/core/v7-features.js'];
}

const { symbolicEquivalent } = loadV7Features();

test('symbolicEquivalent reports a result object, not a boolean', () => {
  const result = symbolicEquivalent('2*x', '2x');
  assert.equal(typeof result, 'object');
  assert.equal(typeof result.equivalent, 'boolean');
});

test('symbolicEquivalent rejects answers that are not equivalent', () => {
  // These are the shapes a student types when guessing: prose, random letters,
  // and a wrong number. None should be judged equivalent.
  for (const wrong of ['asdf', 'i dont know', 'banana', '99', 'x', '']) {
    assert.equal(
      symbolicEquivalent(wrong, '3:4').equivalent,
      false,
      `"${wrong}" must not be equivalent to "3:4"`,
    );
  }
  assert.equal(symbolicEquivalent('5', '35').equivalent, false);
  assert.equal(symbolicEquivalent('hello', '7.5').equivalent, false);
});

test('symbolicEquivalent still accepts genuinely equivalent expressions', () => {
  // It normalises implicit multiplication before comparing; it cannot evaluate
  // expressions containing variables, so equivalence is textual after
  // normalisation rather than algebraic.
  assert.equal(symbolicEquivalent('2x', '2*x').equivalent, true);
  assert.equal(symbolicEquivalent('35', '35').equivalent, true);
  assert.equal(symbolicEquivalent('1/2', '1/2').equivalent, true);
});

// The grading bug: `validateAnswer(...).correct || symbolicEquivalent(...)` used
// the returned OBJECT as a boolean. An object is always truthy, so every wrong
// answer fell through the `||` and was counted correct -- which is why a
// Discovery Check-In reported 100% accuracy for arbitrary text, and why Fix Mode
// handed back full marks for anything typed.
test('grading must read .equivalent rather than the result object', () => {
  const app = fs.readFileSync(path.join(root, 'public', 'deploy-app.js'), 'utf8');
  const calls = [...app.matchAll(/symbolicEquivalent\s*\(/g)];
  assert.ok(calls.length >= 2, 'expected grading call sites to exist');

  for (const call of calls) {
    const following = app.slice(call.index, call.index + 400);
    const usesProperty = /symbolicEquivalent\s*\([^;]*?\)\s*\.equivalent/.test(following);
    const assignedForInspection = /const\s+\w+\s*=\s*symbolicEquivalent/.test(
      app.slice(Math.max(0, call.index - 40), call.index + 30),
    );
    assert.ok(
      usesProperty || assignedForInspection,
      `symbolicEquivalent result used as a boolean near: ${following.slice(0, 120)}`,
    );
  }
});

test('answer inputs that are graded carry the character restriction', () => {
  const app = fs.readFileSync(path.join(root, 'public', 'deploy-app.js'), 'utf8');
  // Each of these is an input whose value is graded, so it must go through
  // mathAnswerInputAttrs() and therefore sanitizeMathAnswerInput().
  for (const id of ['fix-answer', 'challenge-answer']) {
    const tag = app.match(new RegExp(`<input id="${id}"[^>]*>`));
    assert.ok(tag, `${id} input not found`);
    assert.match(tag[0], /mathAnswerInputAttrs\(/, `${id} must restrict typed characters`);
  }
  // Discovery Check-In builds its fields from the question list.
  assert.match(
    app,
    /<input name="\$\{x\.id\}" \$\{mathAnswerInputAttrs\(x\)\}/,
    'Discovery Check-In fields must restrict typed characters',
  );
});

// End-to-end: reproduce the grading expression the Discovery Check-In uses and
// confirm it neither accepts nonsense nor rejects correct work. Before the fix
// every one of the "gibberish" cases below scored as correct, which is what
// produced a 100% accuracy result for arbitrary typing.
function loadQuestionEngine() {
  const code = fs.readFileSync(path.join(root, 'public', 'deploy-core-1.js'), 'utf8');
  const sandbox = {
    window: { __modules: Object.create(null) },
    console, Math, Date, JSON, Number, String, Boolean, Array, Object,
    RegExp, Error, Set, Map, Intl, setTimeout, clearTimeout, URL, Promise,
    fetch: () => {},
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  try { vm.runInContext(code, sandbox); } catch { /* browser-only tail */ }
  return sandbox.window.__modules['src/core/question-engine.js'];
}

const { validateAnswer } = loadQuestionEngine();

const grade = (q, actual) =>
  validateAnswer(
    { prompt: q.prompt, answer: q.answer, exactAnswer: q.exactAnswer, type: q.type || 'short-answer' },
    actual,
  ).correct === true || symbolicEquivalent(actual, String(q.answer ?? '')).equivalent === true;

const CHECK_IN_QUESTIONS = [
  { id: 'x1', prompt: 'Simplify the ratio 18:24.', answer: '3:4', type: 'short-answer' },
  { id: 'x2', prompt: 'Find the area of a rectangle 7 cm by 5 cm.', answer: '35', type: 'numeric' },
  { id: 'x3', prompt: 'Find the mean of 4, 7, 9, 10.', answer: '7.5', type: 'numeric' },
  { id: 'x4', prompt: 'A fair die is rolled. Give a simplified fraction.', answer: '1/2', type: 'numeric' },
  { id: 'x5', prompt: 'For y = 3x + 2, find y when x = 4.', answer: '14', type: 'numeric' },
  { id: 'x6', prompt: 'Find the gradient between (1,3) and (5,11).', answer: '2', type: 'numeric' },
  { id: 'x7', prompt: 'Solve x² - 9 = 0. Enter the positive solution.', answer: '3', type: 'numeric' },
];

test('check-in grading rejects arbitrary text on every question', () => {
  for (const q of CHECK_IN_QUESTIONS) {
    for (const junk of ['asdf', 'i dont know', 'banana', 'aaaaaa', '???']) {
      assert.equal(grade(q, junk), false, `${q.id} must not accept "${junk}"`);
    }
  }
});

test('check-in grading rejects wrong numbers', () => {
  assert.equal(grade(CHECK_IN_QUESTIONS[1], '99'), false);
  assert.equal(grade(CHECK_IN_QUESTIONS[2], '8'), false);
  assert.equal(grade(CHECK_IN_QUESTIONS[4], '12'), false);
});

test('check-in grading still accepts every correct answer', () => {
  for (const q of CHECK_IN_QUESTIONS) {
    assert.equal(grade(q, q.answer), true, `${q.id} must accept its own answer "${q.answer}"`);
  }
});
