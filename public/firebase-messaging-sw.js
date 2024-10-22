// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');



firebase.initializeApp({
    apiKey: "AIzaSyBgR_jwf-XcOFG5BcTb1vjzEKXH1yQbON4",
    authDomain: "deep-c172c.firebaseapp.com",
    projectId: "deep-c172c",
    storageBucket: "deep-c172c.appspot.com",
    messagingSenderId: "298440114658",
    appId: "1:298440114658:web:5d9c3f672d92e6df9839bb",
    measurementId: "G-QF1K2LZ3LC"
  });

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/deep.jpeg' // Your icon path here
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
