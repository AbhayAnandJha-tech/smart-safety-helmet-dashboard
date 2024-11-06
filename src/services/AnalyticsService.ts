import { database } from "../firebase";
import {
  ref,
  get,
  query,
  orderByChild,
  startAt,
  endAt,
} from "firebase/database";
import { WorkerSafetyData } from "../types";

export class AnalyticsService {
  private workersRef = ref(database, "workers");
  private alertsRef = ref(database, "alerts");

  async getWorkerStats(timeRange: { start: number; end: number }) {
    try {
      const workersQuery = query(
        this.workersRef,
        orderByChild("lastUpdate"),
        startAt(timeRange.start),
        endAt(timeRange.end)
      );

      const snapshot = await get(workersQuery);
      const workers: WorkerSafetyData[] = [];

      snapshot.forEach((child) => {
        workers.push({
          id: child.key!,
          ...child.val(),
        });
      });

      return this.calculateStats(workers);
    } catch (error) {
      console.error("Failed to fetch worker stats:", error);
      throw new Error("Failed to fetch worker stats");
    }
  }

  private calculateStats(workers: WorkerSafetyData[]) {
    const stats = {
      totalWorkers: workers.length,
      activeWorkers: 0,
      averageTemperature: 0,
      averageHeartRate: 0,
      averageOxygenLevel: 0,
      averageGasLevel: 0,
      dangerousConditions: 0,
    };

    if (workers.length === 0) return stats;

    workers.forEach((worker) => {
      if (worker.status === "active") {
        stats.activeWorkers++;
      }

      stats.averageTemperature += worker.readings.temperature;
      stats.averageHeartRate += worker.readings.heartRate;
      stats.averageOxygenLevel += worker.readings.oxygenLevel;
      stats.averageGasLevel += worker.readings.gasLevel;

      if (
        worker.readings.temperature > 38 ||
        worker.readings.heartRate > 100 ||
        worker.readings.oxygenLevel < 95 ||
        worker.readings.gasLevel > 10
      ) {
        stats.dangerousConditions++;
      }
    });

    const count = workers.length;
    stats.averageTemperature /= count;
    stats.averageHeartRate /= count;
    stats.averageOxygenLevel /= count;
    stats.averageGasLevel /= count;

    return stats;
  }

  async getAlertTrends(days: number = 7) {
    try {
      const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
      const alertsQuery = query(
        this.alertsRef,
        orderByChild("timestamp"),
        startAt(startTime)
      );

      const snapshot = await get(alertsQuery);
      const alerts: any[] = [];

      snapshot.forEach((child) => {
        alerts.push({
          id: child.key,
          ...child.val(),
        });
      });

      return this.analyzeAlertTrends(alerts, days);
    } catch (error) {
      console.error("Failed to fetch alert trends:", error);
      throw new Error("Failed to fetch alert trends");
    }
  }

  private analyzeAlertTrends(alerts: any[], days: number) {
    const trends = {
      daily: Array(days).fill(0),
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
    };

    alerts.forEach((alert) => {
      // Daily counts
      const daysAgo = Math.floor(
        (Date.now() - alert.timestamp) / (24 * 60 * 60 * 1000)
      );
      if (daysAgo < days) {
        trends.daily[daysAgo]++;
      }

      // Counts by type
      trends.byType[alert.type] = (trends.byType[alert.type] || 0) + 1;

      // Counts by severity
      trends.bySeverity[alert.severity] =
        (trends.bySeverity[alert.severity] || 0) + 1;
    });

    return trends;
  }
}

export const analyticsService = new AnalyticsService();
