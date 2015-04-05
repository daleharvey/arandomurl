console.log('Starting sw.js');

self.addEventListener('install', function(event) {
  console.log('installing');
});

self.addEventListener('fetch', function(evt) {
  console.log('fetching 4', evt.request);
  //evt.respondWith(new Response("Hello world!"));
});

self.addEventListener('activate', function(event) {
  console.log('activate');
});
