import { useState, useEffect } from "react";
import { WorkerSafetyData, Alert } from "../types";
import { workerMonitoringService } from "../services/WorkerMonitoringService";
import { notificationService } from "../services/NotificationService";

export const useWorkerData = (workerId: string) => {
  const [data, setData] = useState<WorkerSafetyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const cleanup = workerMonitoringService.monitorWorker(
      workerId,
      (workerData) => {
        setData(workerData);
        setLoading(false);
      }
    );

    return cleanup;
  }, [workerId]);

  const sendAlert = async (alert: Omit<Alert, "id">) => {
    try {
      await notificationService.sendAlert({
        ...alert,
        workerId,
        timestamp: Date.now(),
        acknowledged: false,
        resolved: false,
      });
    } catch (err) {
      console.error("Failed to send alert:", err);
      setError("Failed to send alert");
    }
  };

  return { data, loading, error, sendAlert };
};
