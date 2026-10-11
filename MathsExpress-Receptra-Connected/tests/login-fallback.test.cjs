const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadAuthModule(fetchImpl) {
  const code = fs.readFileSync(new URL('../public/deploy-core-1.js', `file://${__dirname}/`).pathname, 'utf8');
  const sandbox = {
    window: { __modules: Object.create(null) },
    globalThis: null,
    console,
    URL,
    Math,
    Date,
    JSON,
    Number,
    String,
    Boolean,
    Array,
    Object,
    Promise,
    RegExp,
    Error,
    Set,
    Map,
    Intl,
    setTimeout,
    clearTimeout,
    fetch: fetchImpl,
    MATHSEXPRESS_CONFIG: {
      supabaseUrl: 'https://example.supabase.co',
      supabasePublishableKey: 'public-key',
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { timeout: 5000 });
  return sandbox.window.__modules['src/core/auth.js'];
}

test('email login falls back to Supabase password auth when the custom login function cannot be reached', async () => {
  let directLoginCalls = 0;
  const authModule = loadAuthModule(async () => {
    throw new TypeError('Failed to fetch');
  });

  const fakeClient = {
    auth: {
      async signInWithPassword({ email, password }) {
        directLoginCalls += 1;
        assert.equal(email, 'student@example.com');
        assert.equal(password, 'correct-password');
        return {
          data: { session: { access_token: 'access', refresh_token: 'refresh' } },
          error: null,
        };
      },
      async signOut() {},
    },
    async rpc(name) {
      assert.equal(name, 'account_get_profile');
      return {
        data: {
          user_id: 'user-1',
          email: 'student@example.com',
          display_name: 'Student',
          role: 'player',
          status: 'active',
        },
        error: null,
      };
    },
  };

  const account = new authModule.MathRiftAccountClient(() => fakeClient);
  const snapshot = await account.signIn('student@example.com', 'correct-password');

  assert.equal(directLoginCalls, 1);
  assert.equal(snapshot.authenticated, true);
  assert.equal(snapshot.profile.email, 'student@example.com');
});

test('email login falls back to Supabase password auth when the custom login function is missing', async () => {
  let directLoginCalls = 0;
  const authModule = loadAuthModule(async () => ({
    ok: false,
    status: 404,
    async json() { return { error: 'Function not found' }; },
  }));

  const fakeClient = {
    auth: {
      async signInWithPassword({ email, password }) {
        directLoginCalls += 1;
        assert.equal(email, 'student@example.com');
        assert.equal(password, 'correct-password');
        return {
          data: { session: { access_token: 'access', refresh_token: 'refresh' } },
          error: null,
        };
      },
      async signOut() {},
    },
    async rpc() {
      return {
        data: {
          user_id: 'user-1',
          email: 'student@example.com',
          display_name: 'Student',
          role: 'player',
          status: 'active',
        },
        error: null,
      };
    },
  };

  const account = new authModule.MathRiftAccountClient(() => fakeClient);
  const snapshot = await account.signIn('student@example.com', 'correct-password');

  assert.equal(directLoginCalls, 1);
  assert.equal(snapshot.authenticated, true);
});
