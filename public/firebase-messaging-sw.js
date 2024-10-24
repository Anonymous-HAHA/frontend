// public/firebase-messaging-sw.js
// importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

import { onBackgroundMessage } from "firebase/messaging/sw";

onBackgroundMessage(messaging, (payload) => {
  console.log('Background message received: ', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: 'https://frontend-ten-pi-46.vercel.app/deep.jpeg', // Add a custom icon if needed
  });
});

