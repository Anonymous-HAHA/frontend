import React, { useEffect } from 'react';
import FooterComponent from './Footer/FooterComponent';
import { Outlet } from 'react-router-dom';
import { getToken, messaging } from '../firebase';
import axios from 'axios';
import env from '../env'; 
import Cookies from "js-cookie";

function Home() {
  useEffect(() => {

    const fcmToken = Cookies.get('fcmToken');
    if (!fcmToken) {
      const requestPermission = async () => {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
            if (token) {
              Cookies.set('fcmToken', token, { expires: 7 });
              await registerToken(token);
            }
          } else {
            console.error('Notification permission denied.');
          }
        } catch (error) {
          console.error('Error getting FCM token:', error);
        }
      };

      const registerToken = async (token) => {
        const jwtToken = Cookies.get('jwtToken');
        try {
          await axios.post(`${env.SERVER_URL}/register/token`, { fcmToken: token }, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          console.log('FCM token registered successfully');
        } catch (error) {
          console.error('Error registering FCM token:', error);
        }
      };

      requestPermission();
    }

    // Function to check and register the service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        // Check if the service worker is already registered
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (!registration) {
          // Register only if not already registered
          try {
            const newRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('Service Worker registered with scope:', newRegistration.scope);
          } catch (error) {
            console.error('Service Worker registration failed:', error);
          }
        } else {
          console.log('Service Worker already registered:', registration.scope);
        }
      }
    };

    registerServiceWorker(); // Call the function to register the service worker
  }, []);

  return (
    <div>
      <Outlet />
      <FooterComponent />
    </div>
  );
}

export default Home;
