// Identifier for this app (this needs to be consistent across every cache update)
var APP_PREFIX = 'HabitBreaker'
// Version of the off-line cache (change this value every time you want to update cache)
var VERSION = '0.1'
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [
  '/habit-breaker/',
  '/habit-breaker/index.html',
  '/habit-breaker/js/cache.js',
  '/habit-breaker/js/classifier.js',
  '/habit-breaker/js/input.js',
  '/habit-breaker/js/notification.js',
  '/habit-breaker/js/pwa.js',
  '/habit-breaker/css/style.css',
  '/habit-breaker/img/favicon.ico',
  '/habit-breaker/img/logo-192.png',
  '/habit-breaker/img/logo-512.png',
  '/habit-breaker/img/model-flow.png',
  '/habit-breaker/img/pwa-icon.png',
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i])
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})