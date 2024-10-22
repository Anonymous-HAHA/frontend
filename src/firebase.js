import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const crypto = require('crypto-js');
const encryptedContent = process.env.CONFIG_;
const bytes = crypto.AES.decrypt(encryptedContent, process.env.FIREBASE_SECRET_KEY);
const decrypted = JSON.parse(bytes.toString(crypto.enc.Utf8));
// console.log(decrypted);

const firebaseConfig = decrypted;


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

export {getToken, messaging };
