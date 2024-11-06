import { useState, useEffect, useCallback } from "react";
import { database } from "../firebase";
import { ref, onValue, update, off } from "firebase/database";
import { Alert } from "../types";
import { notificationService } from "../services/NotificationService";

export const useRealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alertsRef = ref(database, "alerts");

    const unsubscribe = onValue(
      alertsRef,
      (snapshot) => {
        const alertsData = snapshot.val();
        if (alertsData) {
          const alertsList = Object.entries(alertsData).map(([id, data]) => ({
            id,
            ...(data as Omit<Alert, "id">),
          }));
          setAlerts(alertsList);
        } else {
          setAlerts([]);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching alerts:", err);
        setError("Failed to fetch alerts");
        setLoading(false);
      }
    );

    return () => off(alertsRef);
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      const alertRef = ref(database, `alerts/${alertId}`);
      await update(alertRef, { acknowledged: true });
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      );
    } catch (err) {
      console.error("Error acknowledging alert:", err);
      throw new Error("Failed to acknowledge alert");
    }
  }, []);

  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      const alertRef = ref(database, `alerts/${alertId}`);
      await update(alertRef, { resolved: true });
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === alertId ? { ...alert, resolved: true } : alert
        )
      );
    } catch (err) {
      console.error("Error resolving alert:", err);
      throw new Error("Failed to resolve alert");
    }
  }, []);

  return {
    alerts,
    loading,
    error,
    acknowledgeAlert,
    resolveAlert,
  };
};
