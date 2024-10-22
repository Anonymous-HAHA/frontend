import React, { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Cookies from 'js-cookie';
import env from "./env";
import axios from 'axios';
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AdminHome from "./components/AdminHome";
import LandingPage from "./components/Homepage/LandingPage";
import AdminDashboard from "./components/Admindashboard/AdminDashboard";
import CreatePoem from "./components/Poems/CreatePoem";
import Poems from "./components/Poems/Poems";
import UserSettings from "./components/Settings/UserSettings";
import AllSounds from "./components/Sound/AllSounds";
import CreateSound from "./components/Sound/CreateSound";
import FreeHandDrawing from "./components/Drawings/DrawingComponent";
import AllDrawings from "./components/Drawings/AllDrawings";
import { getToken , messaging } from './firebase'; // Ensure you export messaging from your firebase.js
import SendNotification from "./components/notifications/SendNotification";

function App() {

    useEffect(() => {
        const requestPermission = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                  const storedToken = Cookies.get('fcmToken');
                  if (!storedToken) {
                    const token = await getToken(messaging, { vapidKey: 'BAswP1DQ5HVO0qvdtoT86skND8GeBt7O1wy6mN2xsi9KAxedE49Bvh0Hmzz2Ddu71OwqXoDDhGOpcUpwdXHjdwI' });
                //   console.log('FCM Token:', token);
                  if (token) {
                    Cookies.set('fcmToken', token, { expires: 7 }); 
                      await registerToken(token);
                  }
                } else {
                    // console.log('FCM Token exists:', storedToken);
                }
                } else {
                    console.error("Notification permission denied.");
                }
            } catch (error) {
                console.error('Error getting FCM token:', error);
            }
        };

        const registerToken = async (token) => {
            const jwtToken = Cookies.get('jwtToken');
            if (!jwtToken) {
                console.error("JWT token not found.");
                return;
            }

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
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute allowedRoles={['admin','user']} />}>
                    <Route path="/" element={<Home />}>
                        <Route index element={<LandingPage />} />
                        <Route path="poems" element={<Poems />} />
                        <Route path="settings" element={<UserSettings />} />
                        <Route path="sounds" element={<AllSounds />} />
                        <Route path="drawings" element={<AllDrawings />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminHome />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="create/poem" element={<CreatePoem />} />
                        <Route path="create/sound" element={<CreateSound />} />
                        <Route path="draw" element={<FreeHandDrawing />} />
                        <Route path="send/notification" element={<SendNotification />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
