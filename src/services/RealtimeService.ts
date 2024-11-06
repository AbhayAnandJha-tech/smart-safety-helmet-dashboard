import { database } from "../firebase";
import { ref, onValue, off } from "firebase/database";
import { SensorData, WorkerSafetyData } from "../types";

type DataCallback<T> = (data: T) => void;

export class RealtimeService {
  private subscriptions: { [key: string]: () => void } = {};

  subscribeToWorkerData(
    workerId: string,
    callback: DataCallback<WorkerSafetyData>
  ) {
    const workerRef = ref(database, `workers/${workerId}`);

    onValue(workerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    });

    this.subscriptions[`worker_${workerId}`] = () => off(workerRef);
  }

  subscribeToBulkSensorData(callback: DataCallback<SensorData[]>) {
    const sensorRef = ref(database, "sensorData");

    onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(Object.values(data));
      }
    });

    this.subscriptions["bulk_sensor"] = () => off(sensorRef);
  }

  unsubscribe(subscriptionKey: string) {
    if (this.subscriptions[subscriptionKey]) {
      this.subscriptions[subscriptionKey]();
      delete this.subscriptions[subscriptionKey];
    }
  }

  unsubscribeAll() {
    Object.values(this.subscriptions).forEach((unsubscribe) => unsubscribe());
    this.subscriptions = {};
  }

  monitorWorker(workerId: string, callback: (data: WorkerSafetyData) => void) {
    const workerRef = ref(database, `workers/${workerId}`);

    onValue(workerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    });

    return () => off(workerRef);
  }
}

export const realtimeService = new RealtimeService();
