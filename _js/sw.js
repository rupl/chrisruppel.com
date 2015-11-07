// Detect and register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function(reg) {
    console.log('SW Registered!', reg);
  }, function(err) {
    console.log('SW encountered an error during registration :(', err);
  });
}
