import { openDB, DBSchema, IDBPDatabase } from "idb";
import { SensorData } from "../types";

interface SensorDB extends DBSchema {
  sensorData: {
    key: number;
    value: SensorData;
    indexes: { "by-timestamp": number };
  };
  pendingUploads: {
    key: number;
    value: {
      data: SensorData;
      attempts: number;
    };
  };
}

class OfflineSyncService {
  private db: IDBPDatabase<SensorDB> | null = null;
  private syncInProgress = false;

  async initialize() {
    this.db = await openDB<SensorDB>("sensor-db", 1, {
      upgrade(db) {
        const sensorStore = db.createObjectStore("sensorData", {
          keyPath: "timestamp",
        });
        sensorStore.createIndex("by-timestamp", "timestamp");

        db.createObjectStore("pendingUploads", {
          keyPath: "timestamp",
        });
      },
    });
  }

  async saveSensorData(data: SensorData) {
    if (!this.db) await this.initialize();

    await this.db!.add("sensorData", data);
    await this.db!.add("pendingUploads", {
      data,
      attempts: 0,
    });

    this.attemptSync();
  }

  private async attemptSync() {
    if (this.syncInProgress || !navigator.onLine) return;

    this.syncInProgress = true;
    try {
      const pendingUploads = await this.db!.getAll("pendingUploads");

      for (const upload of pendingUploads) {
        try {
          await this.uploadData(upload.data);
          await this.db!.delete("pendingUploads", upload.data.timestamp);
        } catch (error) {
          console.error("Sync failed for data point:", error);
          // Increment attempt counter
          await this.db!.put("pendingUploads", {
            ...upload,
            attempts: upload.attempts + 1,
          });
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  private async uploadData(data: SensorData) {
    // Implement your Firebase upload logic here
    // This is just a placeholder
    return Promise.resolve();
  }
}

export const offlineSyncService = new OfflineSyncService();
