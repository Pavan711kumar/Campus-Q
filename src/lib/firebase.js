import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDUQUq9o1l79oQALyUaJ8Akb9tHdd4RjcU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'student-canteen-97341.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'student-canteen-97341',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'student-canteen-97341.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '986617099609',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:986617099609:web:b72e73f31f697c14e40848',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-ZV19PRV7DW'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});
export const storage = getStorage(app);
export const analyticsPromise = isSupported()
  .then((supported) => supported ? getAnalytics(app) : null)
  .catch(() => null);

export const collections = {
  users: 'users',
  canteens: 'canteens',
  menuItems: 'menuItems',
  orders: 'orders'
};
