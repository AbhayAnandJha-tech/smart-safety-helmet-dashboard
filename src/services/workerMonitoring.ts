import { database } from "../firebase";
import { ref, onValue, off, DataSnapshot } from "firebase/database";
import { WorkerSafetyData, Alert } from "../types";
import { notificationService } from "./NotificationService";
import { emergencyResponseService } from "./EmergencyResponseService";

export class WorkerMonitoringService {
  private workersRef = ref(database, "workers");
  private listeners: { [key: string]: () => void } = {};

  monitorWorker(workerId: string, callback: (data: WorkerSafetyData) => void) {
    const workerRef = ref(database, `workers/${workerId}`);

    const listener = onValue(workerRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val() as Omit<WorkerSafetyData, "id">;
      if (data) {
        callback({ ...data, id: workerId });
      }
    });

    this.listeners[workerId] = () => off(workerRef);
    return () => this.stopMonitoring(workerId);
  }

  stopMonitoring(workerId: string) {
    if (this.listeners[workerId]) {
      this.listeners[workerId]();
      delete this.listeners[workerId];
    }
  }

  async checkSafetyStatus(data: WorkerSafetyData): Promise<void> {
    const alerts: Array<{
      type: Alert["type"];
      severity: Alert["severity"];
      message: string;
    }> = [];

    // Check temperature
    if (data.readings.temperature > 38.5) {
      alerts.push({
        type: "safety",
        severity: "critical",
        message: `High temperature detected: ${data.readings.temperature}°C`,
      });
    }

    // Check oxygen level
    if (data.readings.oxygenLevel < 90) {
      alerts.push({
        type: "safety",
        severity: "critical",
        message: `Low oxygen level: ${data.readings.oxygenLevel}%`,
      });
    }

    // Process alerts
    alerts.forEach(async (alert) => {
      const fullAlert: Omit<Alert, "id"> = {
        ...alert,
        workerId: data.id,
        timestamp: Date.now(),
        acknowledged: false,
        resolved: false,
      };

      await notificationService.sendAlert(fullAlert);

      if (alert.severity === "critical") {
        await emergencyResponseService.handleEmergency(data.id, alert.type);
      }
    });
  }
}

export const workerMonitoringService = new WorkerMonitoringService();
