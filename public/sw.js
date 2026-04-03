self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker Activated')
})

self.addEventListener('fetch', (event) => {

  const url = event.request.url

  // 🚨 VERY IMPORTANT: Skip Firebase requests
  if (
    url.includes('firestore.googleapis.com') ||
    url.includes('googleapis.com')
  ) {
    return
  }

  // your existing caching logic here
})