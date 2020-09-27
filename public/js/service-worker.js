const FILES_TO_CACHE = [
    "../../index.html",
    "./index.js",
    "./idb.js",
    "../css/styles.css"
  ]
  
  const APP_PREFIX = 'BudgetTracker-';
  const VERSION = 'version_01';
  const CACHE_NAME = APP_PREFIX + VERSION;
  
  self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(FILES_TO_CACHE);
      })
    )
  })
  
  self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
        let cacheKeeplist = keyList.filter(function(key) {
          return key.indexOf(APP_PREFIX);
        }) 
        // store current cache
        cacheKeeplist.push(CACHE_NAME);
  
        // delete old cache
        return Promise.all(keyList.map(function(key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(keyList[i]);
          }
        }))
      })
    )
  })
  
  self.addEventListener('fetch', function(e) {
    e.respondWith(
      caches.match(e.request).then(function(request) {
        return request || fetch(e.request)
      })
    )
  }) 