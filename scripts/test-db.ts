// Runs the database integration tests (tests/db) against the local Supabase stack.
// Connection details and keys are read from the Supabase CLI at run time and passed to the
// tests through environment variables; they are never written to disk.
import { execFileSync, spawnSync } from 'node:child_process';

interface LocalStatus {
  API_URL?: string;
  ANON_KEY?: string;
  SERVICE_ROLE_KEY?: string;
  MAILPIT_URL?: string;
}

function readLocalStatus(): LocalStatus {
  try {
    return JSON.parse(
      execFileSync('supabase', ['status', '-o', 'json'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }),
    ) as LocalStatus;
  } catch {
    console.error('The local Supabase stack is not running. Start it with: npx supabase start');
    process.exit(1);
  }
}

const status = readLocalStatus();
const { API_URL, ANON_KEY, SERVICE_ROLE_KEY, MAILPIT_URL } = status;
if (!API_URL || !ANON_KEY || !SERVICE_ROLE_KEY || !MAILPIT_URL) {
  console.error('Could not read the local Supabase URLs and keys from `supabase status`.');
  process.exit(1);
}

const result = spawnSync(
  'npx',
  ['vitest', 'run', '--config', 'vitest.db.config.ts', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      TEST_SUPABASE_URL: API_URL,
      TEST_SUPABASE_ANON_KEY: ANON_KEY,
      TEST_SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY,
      TEST_MAILPIT_URL: MAILPIT_URL,
    },
  },
);
process.exit(result.status ?? 1);
