const V='fin-v4', FILES=['./','index.html','manifest.json','assets/icon-192.png','assets/icon-512.png','assets/card-p.webp','assets/card-b.webp','assets/card-f.webp','assets/card-x.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone(); caches.open(V).then(x=>x.put(e.request,c)).catch(()=>{}); return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
self.addEventListener('notificationclick',e=>{e.notification.close(); e.waitUntil(self.clients.matchAll({type:'window'}).then(l=>{for(const c of l){if('focus' in c)return c.focus()} return self.clients.openWindow('./')}))});
