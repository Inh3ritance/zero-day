
//This is the first line of service worker

// push notifications
self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
      icon: './logo72.png',
      body: data.body,
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
});
  
// fetch for before install prompt, network first approach / fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
  
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
  }).then(clientList => {
      let client = null;
      for (let i = 0; i < clientList.length; i++) {
        let item = clientList[i];
        if (item.url) {
          client = item;
          break;
        }
      }
      if (client && 'navigate' in client) {
        client.focus();
        return client.navigate('zerodayurl');
      } else {
        return clients.openWindow('zerodayurl');
      }
    }
  ));
});

const staticsCacheName = 'Zero-Day-Cache-v01';

// get latest cache only
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticsCacheName)
        .map(key => caches.delete(key))
      )
    })
  );
});

// cache data
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticsCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll([
        '/',
      ]).catch(err => {
        console.log(err);
      });
    })
  );
});