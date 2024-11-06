import { database } from "../firebase";
import { ref, set } from "firebase/database";
import { WorkerSafetyData, WorkerStatus } from "../types";

export class DataSimulator {
  private workersRef = ref(database, "workers");

  generateInitialWorkerData(workerId: string): Omit<WorkerSafetyData, "id"> {
    return {
      name: `Worker ${workerId}`,
      status: "active" as WorkerStatus,
      lastUpdate: Date.now(),
      readings: {
        temperature: this.generateRandomReading(36, 38),
        heartRate: this.generateRandomReading(60, 100),
        oxygenLevel: this.generateRandomReading(95, 100),
        gasLevel: this.generateRandomReading(0, 5),
        humidity: this.generateRandomReading(40, 60),
        location: {
          x: this.generateRandomReading(0, 100),
          y: this.generateRandomReading(0, 100),
        },
      },
    };
  }

  generateDangerWorkerData(workerId: string): Omit<WorkerSafetyData, "id"> {
    return {
      name: `Worker ${workerId}`,
      status: "danger" as WorkerStatus,
      lastUpdate: Date.now(),
      readings: {
        temperature: this.generateRandomReading(38.5, 40),
        heartRate: this.generateRandomReading(100, 140),
        oxygenLevel: this.generateRandomReading(85, 90),
        gasLevel: this.generateRandomReading(15, 20),
        humidity: this.generateRandomReading(70, 80),
        location: {
          x: this.generateRandomReading(0, 100),
          y: this.generateRandomReading(0, 100),
        },
      },
    };
  }

  private generateRandomReading(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(1));
  }

  async simulateWorkerData(
    workerId: string,
    isDanger: boolean = false
  ): Promise<void> {
    const workerData = isDanger
      ? this.generateDangerWorkerData(workerId)
      : this.generateInitialWorkerData(workerId);

    try {
      await set(ref(database, `workers/${workerId}`), {
        id: workerId,
        ...workerData,
      });
    } catch (error) {
      console.error("Error simulating worker data:", error);
      throw error;
    }
  }
}

export const dataSimulator = new DataSimulator();
