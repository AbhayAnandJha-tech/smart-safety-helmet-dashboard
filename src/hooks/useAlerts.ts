import { useState, useEffect } from "react";
import { Alert } from "../types";
import { notificationService } from "../services/NotificationService";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = async () => {
    try {
      const recentAlerts = await notificationService.getRecentAlerts();
      setAlerts(recentAlerts.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setError("Failed to load alerts");
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await notificationService.acknowledgeAlert(alertId);
      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      );
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
      setError("Failed to acknowledge alert");
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await notificationService.resolveAlert(alertId);
      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId ? { ...alert, resolved: true } : alert
        )
      );
    } catch (err) {
      console.error("Failed to resolve alert:", err);
      setError("Failed to resolve alert");
    }
  };

  useEffect(() => {
    loadAlerts();
    const unsubscribe = notificationService.subscribeToAlerts((newAlert) => {
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });

    return () => unsubscribe();
  }, []);

  return { alerts, loading, error, loadAlerts, acknowledgeAlert, resolveAlert };
};
