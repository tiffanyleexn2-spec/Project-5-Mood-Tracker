import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Firebase Configuration Setup
//
// SETUP INSTRUCTIONS:
// 1. Copy .env.example to .env in the project root
// 2. Create a Firebase project at https://console.firebase.google.com/
// 3. Enable Email/Password Authentication
// 4. Create a Firestore database (test mode)
// 5. Get your config from Project Settings → Your apps
// 6. Add all values to your .env file
// 7. Restart the dev server
//
// Why use .env?
// - Secure (never commit .env to git)
// - Professional best practice
// - Easy to manage credentials

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0mquUTIGWljinPzLHcDhjfl3_KDYXX1c",
  authDomain: "moodtracker-c07b3.firebaseapp.com",
  projectId: "moodtracker-c07b3",
  storageBucket: "moodtracker-c07b3.firebasestorage.app",
  messagingSenderId: "967914520691",
  appId: "1:967914520691:web:307ffb547ba6bf4d30ea06",
};
// Validate configuration
if (!firebaseConfig.apiKey) {
  console.error(
    "⚠️ Firebase not configured! Steps:\n" +
    "1. Copy .env.example to .env\n" +
    "2. Add your Firebase credentials\n" +
    "3. Restart dev server"
  );
}

// Initialize Firebase services
export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);