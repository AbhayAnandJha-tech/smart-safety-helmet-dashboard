import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onValue,
  DatabaseReference,
} from "firebase/database";

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

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// Function to send sensor data to Firebase
export function sendSensorData(sensorId: string, data: any): void {
  const sensorRef: DatabaseReference = ref(db, "sensors/" + sensorId);
  set(sensorRef, {
    timestamp: Date.now(),
    ...data,
  });
}

// Function to listen for data from Firebase
export function listenForSensorData(
  sensorId: string,
  callback: (data: SensorData | null) => void // Specify expected type
): () => void {
  // Ensure it returns a function
  const sensorRef: DatabaseReference = ref(db, "sensors/" + sensorId);
  const unsubscribe = onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    callback(data); // Send the data to the callback
  });

  return () => unsubscribe(); // Return the unsubscribe function
}

// Function to send control commands from app to sensor
export function sendControlCommand(sensorId: string, command: string): void {
  const commandRef: DatabaseReference = ref(db, "commands/" + sensorId);
  set(commandRef, {
    timestamp: Date.now(),
    command: command,
  });
}

// Export Firebase services for use in other components
export { auth, db };
