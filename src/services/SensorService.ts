import { database } from "../firebase";
import {
  ref,
  onValue,
  off,
  push,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { SensorData } from "../types";

export class SensorService {
  private sensorsRef = ref(database, "sensors");

  listenToSensorData(helmetId: string, callback: (data: SensorData) => void) {
    const sensorRef = ref(database, `sensors/${helmetId}/readings`);

    onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback({
          helmetId,
          ...data,
          timestamp: Date.now(),
        });
      }
    });

    return () => off(sensorRef);
  }

  async getLatestReadings(limit: number = 100): Promise<SensorData[]> {
    const readingsQuery = query(
      this.sensorsRef,
      orderByChild("timestamp"),
      limitToLast(limit)
    );

    return new Promise((resolve, reject) => {
      onValue(
        readingsQuery,
        (snapshot) => {
          const readings: SensorData[] = [];
          snapshot.forEach((child) => {
            readings.push({
              id: child.key!,
              ...child.val(),
            });
          });
          resolve(readings.reverse());
        },
        (error) => {
          reject(error);
        },
        { onlyOnce: true }
      );
    });
  }

  async sendCommandToSensor(helmetId: string, command: string) {
    const commandRef = ref(database, `sensors/${helmetId}/commands`);
    await push(commandRef, {
      type: command,
      timestamp: Date.now(),
    });
  }

  getThresholds() {
    return {
      temperature: { min: 10, max: 40 },
      humidity: { min: 30, max: 70 },
      gasLevel: { max: 10 },
      oxygenLevel: { min: 19.5 },
      heartRate: { min: 60, max: 100 },
    };
  }
}

export const sensorService = new SensorService();
