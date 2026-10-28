// Writes .env.local (ignored by Git) with the local Supabase stack's URL and publishable key,
// read from the Supabase CLI. Run after `supabase start`: npm run env:local
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

interface LocalStatus {
  API_URL?: string;
  PUBLISHABLE_KEY?: string;
  ANON_KEY?: string;
}

let status: LocalStatus;
try {
  status = JSON.parse(
    execFileSync('supabase', ['status', '-o', 'json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }),
  ) as LocalStatus;
} catch {
  console.error('The local Supabase stack is not running. Start it with: supabase start');
  process.exit(1);
}

const key = status.PUBLISHABLE_KEY ?? status.ANON_KEY;
if (!status.API_URL || !key) {
  console.error('Could not read the local Supabase URL and key from `supabase status`.');
  process.exit(1);
}

writeFileSync(
  '.env.local',
  [
    '# Written by `npm run env:local` for the local Supabase stack. Not committed.',
    `VITE_SUPABASE_URL=${status.API_URL}`,
    `VITE_SUPABASE_PUBLISHABLE_KEY=${key}`,
    '',
  ].join('\n'),
);
console.log('Wrote .env.local for the local Supabase stack.');
