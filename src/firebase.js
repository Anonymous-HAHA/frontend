import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// console.log(process.env);
const crypto = require('crypto-js');
const encryptedContent = process.env.REACT_APP_CONFIG_TEXT;
const bytes = crypto.AES.decrypt(encryptedContent, process.env.REACT_APP_FIREBASE_SECRET_KEY);
const firebaseConfig = JSON.parse(bytes.toString(crypto.enc.Utf8));
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

export {getToken, messaging };
