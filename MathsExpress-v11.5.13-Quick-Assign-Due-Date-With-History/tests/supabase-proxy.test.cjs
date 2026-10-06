const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

function loadAuthModule(fetchImpl, factorySpy) {
  const code = fs.readFileSync(path.join(__dirname, '../public/deploy-core-1.js'), 'utf8');
  const sandbox = {
    window: { __modules: Object.create(null) },
    globalThis: null,
    console,
    URL,
    Request,
    Response,
    Headers,
    Math, Date, JSON, Number, String, Boolean, Array, Object, Promise, RegExp, Error, Set, Map, Intl,
    setTimeout, clearTimeout,
    fetch: fetchImpl,
    location: { origin: 'https://mathsexpress.example', protocol: 'https:', href: 'https://mathsexpress.example/app.html' },
    MATHSEXPRESS_CONFIG: {
      supabaseUrl: 'https://example.supabase.co',
      supabasePublishableKey: 'public-key',
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { timeout: 5000 });
  const mod = sandbox.window.__modules['src/core/auth.js'];
  const account = new mod.MathRiftAccountClient(factorySpy);
  account.ensureClient();
  return mod;
}

test('Supabase client uses same-origin proxy for project HTTP requests', async () => {
  const calls = [];
  let createOptions;
  const fetchImpl = async (input, init = {}) => {
    calls.push({ input: String(input), init });
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  loadAuthModule(fetchImpl, (_url, _key, options) => {
    createOptions = options;
    return { auth: {} };
  });

  assert.equal(typeof createOptions?.global?.fetch, 'function');
  await createOptions.global.fetch('https://example.supabase.co/auth/v1/token?grant_type=password', { method: 'POST' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].input, '/api/supabase/auth/v1/token?grant_type=password');
});

test('Supabase proxy fetch leaves unrelated hosts unchanged', async () => {
  const calls = [];
  let createOptions;
  const fetchImpl = async (input, init = {}) => {
    calls.push({ input: String(input), init });
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  loadAuthModule(fetchImpl, (_url, _key, options) => {
    createOptions = options;
    return { auth: {} };
  });

  await createOptions.global.fetch('https://example.org/test', { method: 'GET' });
  assert.equal(calls[0].input, 'https://example.org/test');
});

async function importWorkerFresh() {
  const workerPath = path.join(__dirname, '../worker.js');
  const source = fs.readFileSync(workerPath, 'utf8');
  const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${Date.now()}-${Math.random()}`;
  return import(url);
}

test('Cloudflare worker proxies same-origin Supabase auth calls to the configured project', async () => {
  const workerModule = await importWorkerFresh();
  const originalFetch = global.fetch;
  let upstream;
  global.fetch = async (input, init = {}) => {
    upstream = { url: String(input), init };
    return new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const request = new Request('https://mathsexpress.example/api/supabase/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: 'public-key', authorization: 'Bearer test-token' },
      body: JSON.stringify({ email: 'student@example.com', password: 'password' }),
    });
    const response = await workerModule.default.fetch(request, { ASSETS: { fetch: async () => new Response('asset', { status: 404 }) } });
    assert.equal(response.status, 200);
    assert.equal(upstream.url, 'https://dsjrxkxjcaurrbijihja.supabase.co/auth/v1/token?grant_type=password');
    assert.equal(upstream.init.method, 'POST');
    assert.equal(new Headers(upstream.init.headers).get('authorization'), 'Bearer test-token');
    assert.equal(await new Response(upstream.init.body).text(), JSON.stringify({ email: 'student@example.com', password: 'password' }));
  } finally {
    global.fetch = originalFetch;
  }
});
