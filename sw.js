const V='fin-v7', FILES=['./','index.html','manifest.json','assets/icon-192.png','assets/icon-512.png','assets/card-p.webp','assets/card-b.webp','assets/card-f.webp','assets/card-x.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone(); caches.open(V).then(x=>x.put(e.request,c)).catch(()=>{}); return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
self.addEventListener('notificationclick',e=>{e.notification.close(); e.waitUntil(self.clients.matchAll({type:'window'}).then(l=>{for(const c of l){if('focus' in c)return c.focus()} return self.clients.openWindow('./')}))});

self.addEventListener('push',e=>{
  e.waitUntil((async()=>{
    let p={}; try{p=e.data.json()}catch(_){}
    let s={}; try{const c=await caches.open('fin-rem'), r=await c.match(new URL('__rem.json',self.registration.scope).href); if(r)s=await r.json()}catch(_){}
    let title=s.app||'Мои финансы', body='', k=p.k||'x';
    if(k==='pay'){
      const d=+p.d||new Date().getDate(), n=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
      const L=(s.pay||[]).filter(x=>x.d===d||(d===n&&x.d>d));
      if(!L.length)return;
      title=L.length>1?(s.p2||title):(s.p1||title); body=L.map(x=>x.t).join('\n');
    }else if(k==='eve'){ if(s.eve===false)return; title=s.et||title; body=s.eb||'' }
    else if(k==='payday'){ title=s.dt||title; body=s.db||'' }
    else if(k==='test'){ body=s.tt||'OK' }
    await self.registration.showNotification(title,{body:body,icon:'assets/icon-192.png',badge:'assets/icon-192.png',tag:'fin-'+k});
  })());
});
