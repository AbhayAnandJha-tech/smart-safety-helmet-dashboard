import { database } from "../firebase";
import {
  ref,
  push,
  set,
  get,
  query,
  orderByChild,
  startAt,
} from "firebase/database";
import { Alert } from "../types";

export class NotificationService {
  private alertsRef = ref(database, "alerts");

  async sendAlert(alert: Omit<Alert, "id">): Promise<string> {
    try {
      const newAlertRef = push(this.alertsRef);
      const alertId = newAlertRef.key!;

      const newAlert: Alert = {
        ...alert,
        id: alertId,
        timestamp: Date.now(),
      };

      await set(newAlertRef, newAlert);

      // Additional notification logic can be added here
      // For example: sending push notifications, emails, SMS, etc.

      return alertId;
    } catch (error) {
      console.error("Failed to send alert:", error);
      throw new Error("Failed to send alert");
    }
  }

  async getRecentAlerts(hours: number = 24): Promise<Alert[]> {
    try {
      const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
      const alertsQuery = query(
        this.alertsRef,
        orderByChild("timestamp"),
        startAt(cutoffTime)
      );

      const snapshot = await get(alertsQuery);
      const alerts: Record<string, Alert> = snapshot.val() || {};
      return Object.values(alerts);
    } catch (error) {
      console.error("Failed to get recent alerts:", error);
      throw new Error("Failed to get recent alerts");
    }
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      const alertRef = ref(database, `alerts/${alertId}`);
      await set(alertRef, { acknowledged: true });
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
      throw new Error("Failed to acknowledge alert");
    }
  }

  async resolveAlert(alertId: string): Promise<void> {
    try {
      const alertRef = ref(database, `alerts/${alertId}`);
      await set(alertRef, { resolved: true });
    } catch (error) {
      console.error("Failed to resolve alert:", error);
      throw new Error("Failed to resolve alert");
    }
  }

  subscribeToAlerts(callback: (alert: Alert) => void) {
    // Implement real-time subscription logic here
    // This is a placeholder and should be replaced with actual Firebase Realtime Database subscription
    console.warn("Alert subscription not implemented");
    return () => {};
  }
}

export const notificationService = new NotificationService();
