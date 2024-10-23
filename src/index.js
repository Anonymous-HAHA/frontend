import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { onMessage } from "firebase/messaging";
import { messaging } from './firebase.js'; // Import your messaging configuration

onMessage(messaging, (payload) => {
  console.log('Message received in foreground: ', payload);

  // Extract notification data from payload
  const { title, body } = payload.notification;

  // Check if the browser supports notifications and app is in the foreground
  if (document.visibilityState === 'visible' && 'Notification' in window) {
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

// Function to display notification
function showNotification(title, body) {
  new Notification(title, {
    body: body,
    icon: 'https://frontend-ten-pi-46.vercel.app/deep.jpeg', 
    tag: 'new-notification' // Optional: Tag to manage notification stacking
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
