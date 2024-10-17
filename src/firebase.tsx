// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import Firestore
import { ref } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoAuemUlnwthEoqUQAIUilFzDEHXcnFo4",
  authDomain: "smart-safety-helmet-68f5d.firebaseapp.com",
  databaseURL: "https://smart-safety-helmet-68f5d-default-rtdb.firebaseio.com",
  projectId: "smart-safety-helmet-68f5d",
  storageBucket: "smart-safety-helmet-68f5d.appspot.com",
  messagingSenderId: "567005942298",
  appId: "1:567005942298:web:aed8d75875ed5e70dc37a3",
  measurementId: "G-6EZ62V1RM9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Corrected here

export { auth, db };
