// Reads wrangler.jsonc so a test can stop the project from targeting the live site by accident.
import { readFileSync } from 'node:fs';

/** The Worker that serves the live (v11) MathsExpress site. 2.0 must not deploy to it yet. */
export const LIVE_WORKER_NAME = 'mathsexpress';

interface WranglerConfig {
  name?: unknown;
  routes?: unknown;
  route?: unknown;
}

/** Parses JSON with comments and trailing commas, as used by wrangler.jsonc. */
export function parseJsonc(text: string): unknown {
  const withoutComments = text.replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '$1');
  const withoutTrailingCommas = withoutComments.replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(withoutTrailingCommas);
}

export function readWranglerConfig(path: string): WranglerConfig {
  return parseJsonc(readFileSync(path, 'utf8')) as WranglerConfig;
}
