import { database } from "../firebase";
import {
  ref,
  query,
  orderByChild,
  get,
  startAt,
  endAt,
} from "firebase/database";
import { SensorData, WorkerSafetyData } from "../types";

export class DataExportService {
  private sensorDataRef = ref(database, "sensorData");
  private workersRef = ref(database, "workers");

  async exportData(startDate: Date, endDate: Date): Promise<Blob> {
    try {
      const [sensorData, workerData] = await Promise.all([
        this.getSensorData(startDate, endDate),
        this.getWorkerData(startDate, endDate),
      ]);

      const exportData = {
        sensorData,
        workerData,
        exportDate: new Date().toISOString(),
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      };

      return new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
    } catch (error) {
      console.error("Failed to export data:", error);
      throw new Error("Failed to export data");
    }
  }

  private async getSensorData(
    startDate: Date,
    endDate: Date
  ): Promise<SensorData[]> {
    const sensorQuery = query(
      this.sensorDataRef,
      orderByChild("timestamp"),
      startAt(startDate.getTime()),
      endAt(endDate.getTime())
    );

    const snapshot = await get(sensorQuery);
    const data: SensorData[] = [];

    snapshot.forEach((child) => {
      data.push({
        id: child.key!,
        ...child.val(),
      });
    });

    return data;
  }

  private async getWorkerData(
    startDate: Date,
    endDate: Date
  ): Promise<WorkerSafetyData[]> {
    const workerQuery = query(
      this.workersRef,
      orderByChild("lastUpdate"),
      startAt(startDate.getTime()),
      endAt(endDate.getTime())
    );

    const snapshot = await get(workerQuery);
    const data: WorkerSafetyData[] = [];

    snapshot.forEach((child) => {
      data.push({
        workerId: child.key!,
        ...child.val(),
      });
    });

    return data;
  }

  async validateExport(data: any): Promise<boolean> {
    // Add validation logic here
    if (!data || !data.sensorData || !data.workerData) {
      return false;
    }

    // Add more specific validation as needed
    return true;
  }
}

export const dataExportService = new DataExportService();
