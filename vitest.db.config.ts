import { defineConfig } from 'vitest/config';

// Database integration tests: real Supabase Auth and Postgres, run with `npm run test:db`.
export default defineConfig({
  test: {
    include: ['tests/db/**/*.test.ts'],
    environment: 'node',
    // The tests share one local database, so files run one after another.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
