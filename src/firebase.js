// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import for Authentication
import { getFirestore } from "firebase/firestore"; // Import for Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWEZaJNUbpHRma40tao7WKN6jCOah2GRY",
  authDomain: "income-3d5a2.firebaseapp.com",
  projectId: "income-3d5a2",
  storageBucket: "income-3d5a2.appspot.com",
  messagingSenderId: "839657154414",
  appId: "1:839657154414:web:85bce976b73053843c037f",
  measurementId: "G-91WKFBS4D2"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore

export { auth, db }; // Export auth and db