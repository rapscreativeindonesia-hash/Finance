'use strict';
const CACHE_NAME = 'finance-static-2026-11-24-v1';
const APP_SHELL = [
  '/', '/index.html', '/style.css?v=4', '/ui-icons.js?v=2',
  '/report-pdf.js?v=1', '/app.js?v=3', '/favicon.svg',
  '/manifest.webmanifest', '/icons/finance-180.png',
  '/icons/finance-192.png', '/icons/finance-512.png'
];
const allowed = path =>
  path === '/' ||
  path === '/index.html' ||
  path === '/style.css' ||
  path === '/ui-icons.js' ||
  path === '/report-pdf.js' ||
  path === '/app.js' ||
  path === '/favicon.svg' ||
  path === '/manifest.webmanifest' ||
  /^\/icons\/finance-(180|192|512)\.png$/.test(path);
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names
        .filter(name => name.startsWith('finance-static-') && name !== CACHE_NAME)
        .map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !allowed(url.pathname)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (err) {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match(request, { ignoreSearch: true })
        || (request.mode === 'navigate' ? await cache.match('/') : undefined)
        || Response.error();
    }
  })());
});
