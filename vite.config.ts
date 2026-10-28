import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
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
});
