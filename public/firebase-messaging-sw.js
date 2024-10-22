// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const crypto = require('crypto-js');
const encryptedContent = process.env.CONFIG_;
const bytes = crypto.AES.decrypt(encryptedContent, process.env.FIREBASE_SECRET_KEY);
const decrypted = bytes.toString(crypto.enc.Utf8);
console.log(decrypted);

firebase.initializeApp(decrypted);

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
