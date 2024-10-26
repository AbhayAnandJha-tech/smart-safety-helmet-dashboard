import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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

// Define SensorData type
interface SensorData {
  timestamp: number;
  [key: string]: any;
}

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
  callback: (data: SensorData | null) => void
): () => void {
  const sensorRef: DatabaseReference = ref(db, "sensors/" + sensorId);
  const unsubscribe = onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return () => unsubscribe();
}

// Function to send control commands from app to sensor
export function sendControlCommand(sensorId: string, command: string): void {
  const commandRef: DatabaseReference = ref(db, "commands/" + sensorId);
  set(commandRef, {
    timestamp: Date.now(),
    command: command,
  });
}

// Create a context for Firebase data
interface FirebaseContextType {
  sensorData: SensorData | null;
  alertThresholds: {
    temperature: number;
    gasLevel: number;
    seismicActivity: number;
  };
  updateAlertThresholds: (newThresholds: {
    temperature: number;
    gasLevel: number;
    seismicActivity: number;
  }) => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

// Create a provider component
export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [alertThresholds, setAlertThresholds] = useState({
    temperature: 30,
    gasLevel: 500,
    seismicActivity: 4,
  });

  useEffect(() => {
    const unsubscribe = listenForSensorData("mainSensor", (data) => {
      setSensorData(data);
    });

    return () => unsubscribe();
  }, []);

  const updateAlertThresholds = (newThresholds: {
    temperature: number;
    gasLevel: number;
    seismicActivity: number;
  }) => {
    setAlertThresholds(newThresholds);
    // You might want to send these new thresholds to Firebase here
    // sendSensorData('alertThresholds', newThresholds);
  };

  return (
    <FirebaseContext.Provider
      value={{ sensorData, alertThresholds, updateAlertThresholds }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

// Create a custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

// Export Firebase services for use in other components
export { auth, db };
