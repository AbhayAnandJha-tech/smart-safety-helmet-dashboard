import { useMemo } from "react";
import { WorkerSafetyData } from "../types";

export type TrendDirection = "up" | "down" | "stable";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
  }[];
}

export const useDataVisualization = (
  workerData: Record<string, WorkerSafetyData>
) => {
  const chartData = useMemo(() => {
    const now = Date.now();
    const cutoffTime = now - 1000 * 60 * 60; // 1 hour ago
    const result: Record<string, ChartData> = {};

    Object.entries(workerData).forEach(([workerId, worker]) => {
      if (!worker.readings) {
        return;
      }

      const timestamp = worker.lastUpdate;
      if (timestamp > cutoffTime) {
        const metrics = [
          "temperature",
          "heartRate",
          "oxygenLevel",
          "gasLevel",
        ] as const;

        result[workerId] = {
          labels: [new Date(timestamp).toLocaleTimeString()],
          datasets: metrics.map((metric) => ({
            label: metric,
            data: [worker.readings[metric]],
            borderColor: getMetricColor(metric),
            tension: 0.1,
          })),
        };
      }
    });

    return result;
  }, [workerData]);

  const getWorkerTrends = (workerId: string) => {
    const worker = workerData[workerId];
    if (!worker) return null;

    return {
      temperature: calculateTrend(worker.readings.temperature),
      humidity: calculateTrend(worker.readings.humidity),
      gasLevel: calculateTrend(worker.readings.gasLevel),
      oxygenLevel: calculateTrend(worker.readings.oxygenLevel),
      heartRate: calculateTrend(worker.readings.heartRate),
    };
  };

  return {
    chartData,
    getWorkerTrends,
  };
};

const getMetricColor = (metric: string): string => {
  const colors: Record<string, string> = {
    temperature: "#ff6384",
    heartRate: "#36a2eb",
    oxygenLevel: "#4bc0c0",
    gasLevel: "#ff9f40",
  };
  return colors[metric] || "#777777";
};

const calculateTrend = (value: number): TrendDirection => {
  // This is a simplified trend calculation
  // In a real application, you'd want to compare with historical data
  const threshold = 0.1;
  if (value > threshold) return "up";
  if (value < -threshold) return "down";
  return "stable";
};
