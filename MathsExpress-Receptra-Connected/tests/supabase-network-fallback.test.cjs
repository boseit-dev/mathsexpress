const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function loadFetch(location, fetchImpl) {
  const code = fs.readFileSync(path.join(__dirname, '../public/deploy-core-1.js'), 'utf8');
  let options;
  const sandbox = {
    window: { __modules: Object.create(null) },
    globalThis: null,
    console,
    URL, Request, Response, Headers,
    Math, Date, JSON, Number, String, Boolean, Array, Object, Promise, RegExp, Error, Set, Map, Intl,
    setTimeout, clearTimeout,
    fetch: fetchImpl,
    location,
    MATHSEXPRESS_CONFIG: {
      supabaseUrl: 'https://example.supabase.co',
      supabasePublishableKey: 'public-key',
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { timeout: 5000 });
  const mod = sandbox.window.__modules['src/core/auth.js'];
  const account = new mod.MathRiftAccountClient((_url, _key, createOptions) => {
    options = createOptions;
    return { auth: {} };
  });
  account.ensureClient();
  return options.global.fetch;
}

test('retries the trusted Supabase URL if the same-origin proxy has a network failure', async () => {
  const calls = [];
  const mxFetch = loadFetch(
    { origin: 'https://mathsexpress.example', protocol: 'https:', href: 'https://mathsexpress.example/app.html' },
    async (input, init = {}) => {
      calls.push(String(input));
      if (calls.length === 1) throw new TypeError('Failed to fetch');
      return new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } });
    }
  );

  const response = await mxFetch('https://example.supabase.co/auth/v1/token?grant_type=password', { method: 'POST' });
  assert.equal(response.status, 200);
  assert.deepEqual(calls, [
    '/api/supabase/auth/v1/token?grant_type=password',
    'https://example.supabase.co/auth/v1/token?grant_type=password',
  ]);
});

test('retries the trusted Supabase URL if the proxy route is missing', async () => {
  const calls = [];
  const mxFetch = loadFetch(
    { origin: 'https://mathsexpress.example', protocol: 'https:', href: 'https://mathsexpress.example/app.html' },
    async (input, init = {}) => {
      calls.push(String(input));
      if (calls.length === 1) return new Response('Not Found', { status: 404 });
      return new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } });
    }
  );

  const response = await mxFetch('https://example.supabase.co/rest/v1/rpc/account_get_profile', { method: 'POST' });
  assert.equal(response.status, 200);
  assert.deepEqual(calls, [
    '/api/supabase/rest/v1/rpc/account_get_profile',
    'https://example.supabase.co/rest/v1/rpc/account_get_profile',
  ]);
});

test('local file preview uses the trusted Supabase URL instead of a nonexistent /api route', async () => {
  const calls = [];
  const mxFetch = loadFetch(
    { origin: 'null', protocol: 'file:', href: 'file:///Users/student/Downloads/MathsExpress/public/app.html' },
    async (input, init = {}) => {
      calls.push(String(input));
      return new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } });
    }
  );

  const response = await mxFetch('https://example.supabase.co/auth/v1/token?grant_type=password', { method: 'POST' });
  assert.equal(response.status, 200);
  assert.deepEqual(calls, ['https://example.supabase.co/auth/v1/token?grant_type=password']);
});
