import { database } from "../firebase";
import {
  ref,
  push,
  set,
  query,
  orderByChild,
  onValue,
  off,
  update,
} from "firebase/database";
import { Alert } from "../types";

export class AlertManagementService {
  private alertsRef = ref(database, "alerts");

  async createAlert(alert: Omit<Alert, "id">): Promise<string> {
    try {
      const newAlertRef = push(this.alertsRef);
      await set(newAlertRef, {
        ...alert,
        timestamp: Date.now(),
        acknowledged: false,
      });
      return newAlertRef.key!;
    } catch (error) {
      console.error("Failed to create alert:", error);
      throw new Error("Failed to create alert");
    }
  }

  subscribeToAlerts(callback: (alerts: Alert[]) => void): () => void {
    const alertsQuery = query(this.alertsRef, orderByChild("timestamp"));

    const unsubscribe = onValue(alertsQuery, (snapshot) => {
      const alerts: Alert[] = [];
      snapshot.forEach((child) => {
        alerts.push({
          id: child.key!,
          ...child.val(),
        });
      });
      callback(alerts);
    });

    return () => off(this.alertsRef);
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      await update(ref(database, `alerts/${alertId}`), {
        acknowledged: true,
      });
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
      throw new Error("Failed to acknowledge alert");
    }
  }

  async resolveAlert(alertId: string): Promise<void> {
    try {
      await update(ref(database, `alerts/${alertId}`), {
        resolved: true,
      });
    } catch (error) {
      console.error("Failed to resolve alert:", error);
      throw new Error("Failed to resolve alert");
    }
  }
}

export const alertManagementService = new AlertManagementService();
