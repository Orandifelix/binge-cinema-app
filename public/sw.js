// Service Worker for caching and offline functionality
const CACHE_NAME = 'binge-cinema-v1';
const STATIC_CACHE_NAME = 'binge-cinema-static-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /https:\/\/api\.themoviedb\.org\/3\/trending/,
  /https:\/\/api\.themoviedb\.org\/3\/movie\/popular/,
  /https:\/\/api\.themoviedb\.org\/3\/movie\/top_rated/,
  /https:\/\/api\.themoviedb\.org\/3\/movie\/now_playing/,
  /https:\/\/api\.themoviedb\.org\/3\/movie\/upcoming/,
  /https:\/\/api\.themoviedb\.org\/3\/tv\/popular/,
  /https:\/\/api\.themoviedb\.org\/3\/genre\/movie\/list/,
];

// Image cache patterns
const IMAGE_CACHE_PATTERNS = [
  /https:\/\/image\.tmdb\.org\/t\/p\//,
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with stale-while-revalidate strategy
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            // Cache successful responses
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return cached response if network fails
            return cachedResponse;
          });

          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Handle image requests with cache-first strategy
  if (IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Handle static files with cache-first strategy
  if (STATIC_FILES.includes(url.pathname)) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          return cachedResponse || fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // For all other requests, try network first
  event.respondWith(
    fetch(request).catch(() => {
      // If network fails, try to serve from cache
      return caches.match(request);
    })
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Retry failed API requests
      caches.open(CACHE_NAME).then((cache) => {
        return cache.keys().then((requests) => {
          return Promise.all(
            requests.map((request) => {
              return fetch(request).then((response) => {
                if (response.ok) {
                  cache.put(request, response.clone());
                }
                return response;
              }).catch(() => {
                // Keep cached version if network still fails
                return cache.match(request);
              });
            })
          );
        });
      })
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/binge.svg',
      badge: '/binge.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Explore',
          icon: '/binge.svg'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/binge.svg'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
