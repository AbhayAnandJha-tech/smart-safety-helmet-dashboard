import { useState, useEffect } from "react";
import { WorkerSafetyData } from "../types";
import { notificationService } from "../services/NotificationService";
import { workerMonitoringService } from "../services/WorkerMonitoringService";

export const useRealTimeMonitoring = (workerId: string) => {
  const [workerData, setWorkerData] = useState<WorkerSafetyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = workerMonitoringService.monitorWorker(
      workerId,
      async (data) => {
        setWorkerData(data);
        setLoading(false);

        // Check for dangerous conditions
        if (
          data.status === "danger" &&
          (!workerData || workerData.status !== "danger")
        ) {
          await notificationService.sendAlert({
            type: "safety",
            severity: "critical",
            message: `Worker ${data.name} is in danger!`,
            workerId: data.id,
            timestamp: Date.now(),
            acknowledged: false,
            resolved: false,
          });
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [workerId]);

  return { workerData, loading, error };
};
