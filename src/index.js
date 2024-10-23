import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { onMessage } from "firebase/messaging";
import { messaging } from './firebase.js'; // Import your messaging configuration

// Register the service worker for FCM
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

  onMessage(messaging, (payload) => {
    console.log('Message received in foreground: ', payload);
  
    // Extract notification data from payload
    const { title, body } = payload.notification;
  
    // Check if the browser supports notifications
    if ('Notification' in window) {
      // Request permission to show notifications if not already granted
      if (Notification.permission === 'granted') {
        // Display the notification
        showNotification(title, body);
      } else if (Notification.permission !== 'denied') {
        // Ask user for permission
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showNotification(title, body);
          }
        });
      }
    }
  });

  function showNotification(title, body) {
    new Notification(title, {
      body: body,
      // icon: '/deep.jpeg', 
      tag: 'new-notification' // Optional: Tag to manage notification stacking
    });
  }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
