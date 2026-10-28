// The site's Content-Security-Policy lives in public/_headers and only allows connections to the
// site itself. The app also talks to its Supabase project, whose address depends on the
// environment, so the build adds that one address to the copy of _headers in dist/.

/**
 * Adds `origin` to every `connect-src` directive in a Cloudflare `_headers` file. Throws if there
 * is no such directive, so a changed policy can't silently leave the app unable to connect.
 */
export function allowConnectionsTo(headers: string, origin: string): string {
  if (!/^https?:\/\/[^\s/;']+$/.test(origin)) {
    throw new Error(`"${origin}" is not an origin like https://example.supabase.co`);
  }
  const directive = /connect-src ([^;\n]*)/g;
  if (!directive.test(headers)) {
    throw new Error('The Content-Security-Policy in _headers has no connect-src');
  }
  return headers.replace(directive, (_match, sources: string) =>
    sources.split(' ').includes(origin)
      ? `connect-src ${sources}`
      : `connect-src ${sources} ${origin}`,
  );
}
