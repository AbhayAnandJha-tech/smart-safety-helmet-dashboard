import { database } from "../firebase";
import { ref, push, serverTimestamp, set } from "firebase/database";
import { AlertType } from "../types";

export class EmergencyResponseService {
  private emergenciesRef = ref(database, "emergencies");

  async handleEmergency(workerId: string, alertType: AlertType): Promise<void> {
    try {
      const newEmergencyRef = push(this.emergenciesRef);
      await set(newEmergencyRef, {
        workerId,
        alertType,
        timestamp: serverTimestamp(),
        status: "active",
        responseTime: null,
        resolvedTime: null,
      });
    } catch (error) {
      console.error("Error handling emergency:", error);
      throw error;
    }
  }
}

export const emergencyResponseService = new EmergencyResponseService();
