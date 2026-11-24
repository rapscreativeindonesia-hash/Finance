'use strict';
/* Enables app shell caching. Financial records remain in localStorage only. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      // Network access and all existing finance functionality remain available.
    });
  });
}
