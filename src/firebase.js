import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBgR_jwf-XcOFG5BcTb1vjzEKXH1yQbON4",
  authDomain: "deep-c172c.firebaseapp.com",
  projectId: "deep-c172c",
  storageBucket: "deep-c172c.appspot.com",
  messagingSenderId: "298440114658",
  appId: "1:298440114658:web:5d9c3f672d92e6df9839bb",
  measurementId: "G-QF1K2LZ3LC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

export {getToken, messaging };
