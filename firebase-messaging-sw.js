// ANDON Service Worker — gestion des notifications push
// Ce fichier doit être à la racine du site

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

// Clic sur une notification → ouvre ou focus l'app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = '/andon-jit/superviseur.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf('superviseur') >= 0 || list[i].url.indexOf('maintenance') >= 0) {
          return list[i].focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// Support Firebase background messaging si disponible
try {
  importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

  firebase.initializeApp({
    apiKey:            "AIzaSyB24gRhCvIBE3HY-teVwr-GTtKA6Pk13A8",
    authDomain:        "andonjit.firebaseapp.com",
    databaseURL:       "https://andonjit-default-rtdb.firebaseio.com",
    projectId:         "andonjit",
    storageBucket:     "andonjit.firebasestorage.app",
    messagingSenderId: "861389965341",
    appId:             "1:861389965341:web:48de1a98ee556b2cdc5ef4"
  });

  var messaging = firebase.messaging();
} catch(e) {
  // Firebase not available — SW still works for local notifications
  console.log('Firebase SW: running without FCM');
}
