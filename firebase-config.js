import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUQUq9o1l79oQALyUaJ8Akb9tHdd4RjcU",
  authDomain: "student-canteen-97341.firebaseapp.com",
  projectId: "student-canteen-97341",
  storageBucket: "student-canteen-97341.firebasestorage.app",
  messagingSenderId: "986617099609",
  appId: "1:986617099609:web:b72e73f31f697c14e40848",
  measurementId: "G-ZV19PRV7DW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});
const storage = getStorage(app);
const analyticsPromise = isSupported()
  .then((supported) => supported ? getAnalytics(app) : null)
  .catch(() => null);

const collections = {
  users: "users",
  canteens: "canteens",
  menuItems: "menuItems",
  orders: "orders"
};

export { app, auth, db, storage, analyticsPromise, collections };
