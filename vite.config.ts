import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { loadEnv, type Plugin } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import packageJson from './package.json' with { type: 'json' };
import { allowConnectionsTo } from './scripts/lib/content-security-policy.ts';

/** Lets the built site connect to the Supabase project it was built for (see public/_headers). */
function allowSupabaseConnections(supabaseUrl: string | undefined): Plugin {
  let outDir = 'dist';
  return {
    name: 'mathsexpress:allow-supabase-connections',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      if (!supabaseUrl) return;
      const headersPath = join(outDir, '_headers');
      const headers = readFileSync(headersPath, 'utf8');
      writeFileSync(headersPath, allowConnectionsTo(headers, new URL(supabaseUrl).origin));
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    allowSupabaseConnections(loadEnv(mode, process.cwd(), 'VITE_').VITE_SUPABASE_URL),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    rolldownOptions: {
      output: {
        // Large libraries in their own chunks: they change rarely, so browsers keep them cached
        // across app updates, and no single file is too large.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'router', test: /node_modules[\\/]react-router[\\/]/ },
            { name: 'supabase', test: /node_modules[\\/]@supabase[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Database tests need the local Supabase stack; they run separately with `npm run test:db`.
    exclude: [...configDefaults.exclude, 'tests/db/**'],
    // Dates are shown in the student's local time; pin the zone so tests behave the same on every machine.
    env: { TZ: 'Australia/Sydney' },
    restoreMocks: true,
  },
}));
