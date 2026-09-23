const CACHE='mathsexpress-v11-5-13';
const CORE=[
  './','./index.html','./site.css','./site-motion.js','./app.html','./styles.css','./manifest.webmanifest','./mathsexpress-icon.svg','./mathsexpress-config.js',
  './supabase-loader.js','./mathsexpress-safe-math.js','./quick-assign-due.js','./deploy-core-1.js','./deploy-core-2.js','./v7-features.js','./deploy-app.js',
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
  event.respondWith(
    fetch(event.request).then(response=>{
      if(response && response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      }
      return response;
    }).catch(async()=>{
      const cached=await caches.match(event.request);
      if(cached) return cached;
      if(event.request.mode==='navigate'){
        return url.pathname.endsWith('/app.html') ? caches.match('./app.html') : caches.match('./index.html');
      }
      return Response.error();
    })
  );
});
