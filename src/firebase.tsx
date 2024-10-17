// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
