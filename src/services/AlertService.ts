import { database } from "../firebase";
import { ref, onValue, push, update, get } from "firebase/database";
import { Alert } from "../types";

export class AlertService {
  private alertsRef = ref(database, "alerts");

  subscribeToAlerts(callback: (alerts: Alert[]) => void) {
    onValue(this.alertsRef, (snapshot) => {
      const alerts: Alert[] = [];
      snapshot.forEach((child) => {
        alerts.push({
          id: child.key!,
          ...child.val(),
        });
      });
      callback(alerts);
    });

    return () => {
      // Return cleanup function
    };
  }

  async acknowledgeAlert(alertId: string) {
    const alertRef = ref(database, `alerts/${alertId}`);
    await update(alertRef, {
      acknowledged: true,
      acknowledgedAt: Date.now(),
    });
  }

  async createAlert(alert: Omit<Alert, "id">) {
    await push(this.alertsRef, {
      ...alert,
      timestamp: Date.now(),
      acknowledged: false,
    });
  }
}

export const alertService = new AlertService();
