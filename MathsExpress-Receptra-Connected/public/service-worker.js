const CACHE='mathsexpress-v11-5-26-receptra';
const CORE=[
  './','./index.html','./site.css','./site-motion.js','./receptra-widget.js','./app.html','./styles.css','./manifest.webmanifest','./mathsexpress-icon.svg','./mathsexpress-config.js',
  './supabase-loader.js','./mathsexpress-safe-math.js','./quick-assign-due.js','./startup-failsafe.js','./deploy-core-1.js','./deploy-core-2.js','./v7-features.js','./deploy-app.js',
  './assets/clove.png','./assets/mx-logo.png','./mx-logo.png','./favicon.ico','./assets/mx-logo-180.png','./assets/mx-logo-192.png','./assets/mx-logo-192-maskable.png','./assets/mx-logo-512-maskable.png','./assets/fox-guide.png','./privacy.html','./terms.html','./security.html','./accessibility.html','./subprocessors.html','./robots.txt','./sitemap.xml'
];

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  // Never store authenticated/API data in the shared service-worker cache. In
  // particular, /api/supabase proxies user information and must be network-only.
  const pathname=url.pathname;
  const isApi=pathname.startsWith('/api/') || pathname.startsWith('/.netlify/functions/')
    || pathname.startsWith('/auth/') || pathname.startsWith('/rest/') || pathname.startsWith('/storage/');
  if(isApi || event.request.headers.has('Authorization') || event.request.headers.has('Cookie')) return;
  const isDocument=event.request.mode==='navigate';
  const isStatic=CORE.some(asset=>new URL(asset,self.location.href).pathname===pathname);
  // Never cache arbitrary routes, even when the response is an HTML document.
  if(!isStatic) return;
  event.respondWith(
    fetch(event.request).then(response=>{
      // Do not persist non-public responses even if a server route changes.
      const cacheControl=String(response?.headers?.get('Cache-Control')||'');
      if(response && response.ok && !/private|no-store|no-cache/i.test(cacheControl) && !response.headers.has('Set-Cookie')){
        const copy=response.clone();
        event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));
      }
      return response;
    }).catch(async()=>{
      const cached=await caches.match(event.request);
      if(cached) return cached;
      if(isDocument && (pathname==='/' || pathname==='/index.html' || pathname==='/app.html')) {
        return caches.match(pathname==='/app.html'?'./app.html':'./index.html');
      }
      return Response.error();
    })
  );
});
