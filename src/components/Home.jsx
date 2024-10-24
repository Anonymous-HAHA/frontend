import React, { useEffect } from 'react';
import FooterComponent from './Footer/FooterComponent';
import { Outlet } from 'react-router-dom';

function Home() {
  useEffect(() => {
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
