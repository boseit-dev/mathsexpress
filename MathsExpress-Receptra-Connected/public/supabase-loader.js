(() => {
  'use strict';
  if (globalThis.supabase?.createClient) {
    globalThis.MathsExpressSupabaseReady = Promise.resolve(true);
    setTimeout(() => globalThis.dispatchEvent?.(new Event('mathsexpress:supabase-ready')), 0);
    return;
  }

  const SOURCES = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/dist/umd/supabase.min.js',
    'https://unpkg.com/@supabase/supabase-js@2.116.0/dist/umd/supabase.min.js'
  ];
  let promiseDone = false;
  let readyEventSent = false;
  let resolveReady;
  globalThis.MathsExpressSupabaseReady = new Promise((resolve) => { resolveReady = resolve; });

  function ready() {
    if (!globalThis.supabase?.createClient) return false;
    if (!promiseDone) { promiseDone = true; resolveReady(true); }
    if (!readyEventSent) {
      readyEventSent = true;
      globalThis.dispatchEvent?.(new Event('mathsexpress:supabase-ready'));
    }
    return true;
  }

  function inject(url, label) {
    if (ready() || document.querySelector(`script[data-mx-supabase=\"${label}\"]`)) return;
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.mxSupabase = label;
    script.onload = () => ready();
    document.head.appendChild(script);
  }

  inject(SOURCES[0], 'primary');
  setTimeout(() => { if (!ready()) inject(SOURCES[1], 'fallback'); }, 500);
  // Do not reject startup. Resolve false quickly so the app remains usable while a
  // late CDN load can still fire mathsexpress:supabase-ready afterwards.
  setTimeout(() => { if (!promiseDone) { promiseDone = true; resolveReady(false); } }, 1200);
})();
