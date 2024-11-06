import { useState, useEffect } from "react";
import { WorkerSafetyData, Alert } from "../types";
import { calculateRiskLevel, calculateSafetyScore } from "../utils/safety";
import { notificationService } from "../services/NotificationService";
import { emergencyResponseService } from "../services/EmergencyResponseService";

interface SafetyState {
  workers: Record<string, WorkerSafetyData>;
  alerts: Alert[];
  overallSafetyScore: number;
}

export const useSafetyMonitoring = (
  initialWorkers: Record<string, WorkerSafetyData>
) => {
  const [state, setState] = useState<SafetyState>({
    workers: initialWorkers,
    alerts: [],
    overallSafetyScore: 100,
  });

  useEffect(() => {
    const updateSafetyState = async () => {
      const workerEntries = Object.entries(initialWorkers);
      const newAlerts: Alert[] = [];
      let totalSafetyScore = 0;

      workerEntries.forEach(([workerId, workerData]) => {
        const status = calculateRiskLevel(workerData.readings);
        const safetyScore = calculateSafetyScore(workerData.readings);
        totalSafetyScore += safetyScore;

        if (
          status === "danger" &&
          (!state.workers[workerId] ||
            state.workers[workerId].status !== "danger")
        ) {
          notificationService.sendAlert({
            type: "safety",
            severity: "critical",
            message: `Worker ${workerId} entered danger state`,
            workerId,
            timestamp: Date.now(),
            acknowledged: false,
            resolved: false,
          });

          emergencyResponseService.handleEmergency(workerId, "safety");
        }
      });

      const averageSafetyScore = totalSafetyScore / workerEntries.length;

      setState({
        workers: initialWorkers,
        alerts: newAlerts,
        overallSafetyScore: averageSafetyScore,
      });
    };

    updateSafetyState();
  }, [initialWorkers]);

  return state;
};
