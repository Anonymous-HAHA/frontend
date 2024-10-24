import React, { useEffect } from 'react';
import FooterComponent from './Footer/FooterComponent';
import { Outlet } from 'react-router-dom';

function Home() {
  useEffect(() => {
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
