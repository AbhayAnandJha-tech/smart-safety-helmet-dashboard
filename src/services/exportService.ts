import { database } from "../firebase";
import {
  ref,
  query,
  orderByChild,
  startAt,
  endAt,
  get,
} from "firebase/database";
import { WorkerSafetyData, Alert } from "../types";

interface ExportData {
  workers: WorkerSafetyData[];
  alerts: Alert[];
  timestamp: number;
  dateRange: {
    start: number;
    end: number;
  };
}

export const exportSafetyData = async (
  startDate: Date,
  endDate: Date
): Promise<void> => {
  try {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    // Get worker data
    const workersRef = ref(database, "workers");
    const workersQuery = query(
      workersRef,
      orderByChild("lastUpdate"),
      startAt(startTime),
      endAt(endTime)
    );
    const workersSnapshot = await get(workersQuery);
    const workers: WorkerSafetyData[] = [];
    workersSnapshot.forEach((child) => {
      workers.push({
        id: child.key!,
        ...child.val(),
      });
    });

    // Get alerts data
    const alertsRef = ref(database, "alerts");
    const alertsQuery = query(
      alertsRef,
      orderByChild("timestamp"),
      startAt(startTime),
      endAt(endTime)
    );
    const alertsSnapshot = await get(alertsQuery);
    const alerts: Alert[] = [];
    alertsSnapshot.forEach((child) => {
      alerts.push({
        id: child.key!,
        ...child.val(),
      });
    });

    // Prepare export data
    const exportData: ExportData = {
      workers,
      alerts,
      timestamp: Date.now(),
      dateRange: {
        start: startTime,
        end: endTime,
      },
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `safety-data-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export safety data:", error);
    throw new Error("Failed to export safety data");
  }
};
