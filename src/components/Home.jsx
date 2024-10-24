import React, { useEffect } from 'react';
import FooterComponent from './Footer/FooterComponent';
import { Outlet } from 'react-router-dom';
import { getToken, messaging } from '../firebase';
import axios from 'axios';
import Cookies from 'js-cookie';
import env from '../env';


function Home() {
  useEffect(() => {
    const jwtToken = Cookies.get('jwtToken');
    
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
  
      registerServiceWorker(); 

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const storedToken = Cookies.get('fcmToken');
          if (!storedToken) {
            const token = await getToken(messaging, { vapidKey: 'BAswP1DQ5HVO0qvdtoT86skND8GeBt7O1wy6mN2xsi9KAxedE49Bvh0Hmzz2Ddu71OwqXoDDhGOpcUpwdXHjdwI' });
            if (token) {
              Cookies.set('fcmToken', token, { expires: 7 });
              await registerToken(token);
            }
          }
        } else {
          console.error("Notification permission denied.");
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    const registerToken = async (token) => {
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
  }, []);

  return (
    <div>
      <Outlet />
      <FooterComponent />
    </div>
  );
}

export default Home;
