import { useEffect } from "react";
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import { getToken, messaging } from '../firebase';
import axios from 'axios';
import env from '../env'; 

const ProtectedRoute = ({ allowedRoles }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = Cookies.get("jwtToken");
    if (!jwtToken) {
      navigate("/login", { replace: true });
      return;
    }

    const role = Cookies.get("role");
    if (!allowedRoles.includes(role)) {
      navigate("/", { replace: true });
      return;
    }

    // FCM Token logic after authentication and role check
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const storedToken = Cookies.get('fcmToken');
          if (!storedToken) {
            const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
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

  }, [allowedRoles, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
