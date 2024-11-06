import { database } from "../firebase";
import { ref, set } from "firebase/database";

type BuzzerMode = "warning" | "emergency" | "off";
type LightColor = "red" | "yellow" | "green" | "off";

export class ActuatorControlService {
  private actuatorsRef = ref(database, "actuators");

  async activateBuzzer(deviceId: string, mode: BuzzerMode): Promise<void> {
    try {
      await set(ref(database, `actuators/${deviceId}/buzzer`), {
        mode,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Failed to activate buzzer:", error);
      throw error;
    }
  }

  async activateLight(deviceId: string, color: LightColor): Promise<void> {
    try {
      await set(ref(database, `actuators/${deviceId}/light`), {
        color,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Failed to activate light:", error);
      throw error;
    }
  }

  async deactivateAll(deviceId: string): Promise<void> {
    try {
      await Promise.all([
        this.activateBuzzer(deviceId, "off"),
        this.activateLight(deviceId, "off"),
      ]);
    } catch (error) {
      console.error("Failed to deactivate actuators:", error);
      throw error;
    }
  }
}

export const actuatorControl = new ActuatorControlService();
