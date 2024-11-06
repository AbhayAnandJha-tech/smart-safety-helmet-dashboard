import { database } from "../firebase";
import { ref, push, get } from "firebase/database";
import { Alert } from "../types";

interface AlertRule {
  id: string;
  condition: {
    type: string;
    threshold: number;
    operator: "gt" | "lt" | "eq" | "gte" | "lte";
  };
  actions: AlertAction[];
}

interface AlertAction {
  type: "notification" | "alarm" | "shutdown";
  target: string;
  params?: Record<string, any>;
}

interface AlertContext {
  alertId: string;
  rule: AlertRule;
  data: any;
  deviceId: string;
  timestamp: number;
}

export class AdvancedAlertService {
  private rulesRef = ref(database, "alertRules");
  private alertsRef = ref(database, "alerts");

  async evaluateRules(deviceId: string, data: any): Promise<void> {
    try {
      const rulesSnapshot = await get(this.rulesRef);
      const rules: AlertRule[] = [];

      rulesSnapshot.forEach((child) => {
        rules.push({
          id: child.key!,
          ...child.val(),
        });
      });

      for (const rule of rules) {
        if (this.checkCondition(rule.condition, data)) {
          await this.createAlert(deviceId, rule, data);
        }
      }
    } catch (error) {
      console.error("Failed to evaluate rules:", error);
      throw error;
    }
  }

  private checkCondition(
    condition: AlertRule["condition"],
    data: any
  ): boolean {
    const value = data[condition.type];
    switch (condition.operator) {
      case "gt":
        return value > condition.threshold;
      case "lt":
        return value < condition.threshold;
      case "eq":
        return value === condition.threshold;
      case "gte":
        return value >= condition.threshold;
      case "lte":
        return value <= condition.threshold;
      default:
        return false;
    }
  }

  private async createAlert(
    deviceId: string,
    rule: AlertRule,
    data: any
  ): Promise<void> {
    try {
      const newAlertRef = push(this.alertsRef);
      const alertId = newAlertRef.key!;
      const timestamp = Date.now();

      const alert: Alert = {
        id: alertId,
        type: "system",
        severity: "high",
        message: `Alert triggered by rule ${rule.id}`,
        timestamp,
        workerId: deviceId,
        acknowledged: false,
        resolved: false,
      };

      await push(this.alertsRef, alert);

      for (const action of rule.actions) {
        await this.executeAction(action, {
          alertId,
          rule,
          data,
          deviceId,
          timestamp,
        });
      }
    } catch (error) {
      console.error("Failed to create alert:", error);
      throw error;
    }
  }

  private async executeAction(
    action: AlertAction,
    context: AlertContext
  ): Promise<void> {
    try {
      switch (action.type) {
        case "notification":
          await this.sendNotification(action, context);
          break;
        case "alarm":
          await this.triggerAlarm(action, context);
          break;
        case "shutdown":
          await this.initiateShutdown(action, context);
          break;
        default:
          console.warn("Unknown action type:", action.type);
      }
    } catch (error) {
      console.error("Failed to execute action:", error);
      throw error;
    }
  }

  private async sendNotification(
    action: AlertAction,
    context: AlertContext
  ): Promise<void> {
    // Implement notification logic
    console.log("Sending notification:", action, context);
  }

  private async triggerAlarm(
    action: AlertAction,
    context: AlertContext
  ): Promise<void> {
    // Implement alarm logic
    console.log("Triggering alarm:", action, context);
  }

  private async initiateShutdown(
    action: AlertAction,
    context: AlertContext
  ): Promise<void> {
    // Implement shutdown logic
    console.log("Initiating shutdown:", action, context);
  }
}

export const advancedAlertService = new AdvancedAlertService();
