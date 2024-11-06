import React, { createContext, useContext, useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue, get } from "firebase/database";
import { WorkerSafetyData } from "../types";

interface SafetyContextValue {
  workerData: { [key: string]: WorkerSafetyData };
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const SafetyContext = createContext<SafetyContextValue | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [workerData, setWorkerData] = useState<{
    [key: string]: WorkerSafetyData;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    try {
      const workersRef = ref(database, "workers");
      const snapshot = await get(workersRef);
      setWorkerData(snapshot.val() || {});
      setError(null);
    } catch (err) {
      console.error("Error fetching worker data:", err);
      setError("Failed to fetch worker data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const workersRef = ref(database, "workers");

    const unsubscribe = onValue(
      workersRef,
      (snapshot) => {
        setWorkerData(snapshot.val() || {});
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error subscribing to worker data:", error);
        setError("Failed to subscribe to worker data");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <SafetyContext.Provider value={{ workerData, loading, error, refreshData }}>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error("useSafety must be used within a SafetyProvider");
  }
  return context;
};
