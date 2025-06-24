// Required for background messages
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCANb9a0-6_C55qeZ-YY39tqB5B79cZ0BE",
  authDomain: "nyano-kakh.firebaseapp.com",
  databaseURL: "https://nyano-kakh-default-rtdb.firebaseio.com",
  projectId: "nyano-kakh",
  storageBucket: "nyano-kakh.firebasestorage.app",
  messagingSenderId: "1073797907279",
  appId: "1:1073797907279:web:7ecbabb467bc7ba8b17b3a",
  measurementId: "G-9Y9V54HVKW"
};


firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});







