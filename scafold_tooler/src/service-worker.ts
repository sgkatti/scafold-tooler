// Basic service worker placeholder — extend for caching strategy
self.addEventListener('install', (event: any) => {
  console.log('Service worker installed')
  self.skipWaiting()
})

self.addEventListener('activate', (event: any) => {
  console.log('Service worker activated')
})
