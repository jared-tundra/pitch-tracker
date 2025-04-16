// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB1x5eZ3FF5YTutQTpU4Z4C6oVV71UgybQ",
  authDomain: "pitchtracker-300a3.firebaseapp.com",
  projectId: "pitchtracker-300a3",
  storageBucket: "pitchtracker-300a3.appspot.com",
  messagingSenderId: "849723021550",
  appId: "1:849723021550:web:c6051700fd7bca3607fbff",
  measurementId: "G-9RTEEJPQC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ use getFirestore instead of firebaseApp.firestore()
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, app };
