import { WorkerSafetyData, WorkerStatus } from "../types";

export const formatAlertTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const calculateRiskLevel = (
  readings: WorkerSafetyData["readings"]
): WorkerStatus => {
  const { temperature, heartRate, oxygenLevel, gasLevel } = readings;

  // Critical conditions (danger)
  if (
    temperature > 38.5 ||
    heartRate > 120 ||
    oxygenLevel < 90 ||
    gasLevel > 30
  ) {
    return "danger";
  }

  // Warning conditions
  if (
    temperature > 37.8 ||
    heartRate > 100 ||
    oxygenLevel < 95 ||
    gasLevel > 20
  ) {
    return "warning";
  }

  // Normal conditions
  return "active";
};

export const getStatusColor = (status: WorkerStatus): string => {
  switch (status) {
    case "active":
      return "#4CAF50";
    case "warning":
      return "#FFC107";
    case "danger":
      return "#F44336";
    case "inactive":
      return "#9E9E9E";
    case "offline":
      return "#757575";
    default:
      return "#9E9E9E";
  }
};

export const formatReading = (
  value: number,
  metric: keyof WorkerSafetyData["readings"]
): string => {
  switch (metric) {
    case "temperature":
      return `${value.toFixed(1)}°C`;
    case "heartRate":
      return `${Math.round(value)} BPM`;
    case "oxygenLevel":
    case "gasLevel":
    case "humidity":
      return `${Math.round(value)}%`;
    default:
      return value.toString();
  }
};

export const getMetricThresholds = (
  metric: keyof WorkerSafetyData["readings"]
): { warning: number; danger: number } => {
  switch (metric) {
    case "temperature":
      return { warning: 37.8, danger: 38.5 };
    case "heartRate":
      return { warning: 100, danger: 120 };
    case "oxygenLevel":
      return { warning: 95, danger: 90 };
    case "gasLevel":
      return { warning: 20, danger: 30 };
    case "humidity":
      return { warning: 70, danger: 80 };
    default:
      return { warning: Infinity, danger: Infinity };
  }
};

export const calculateSafetyScore = (
  readings: WorkerSafetyData["readings"]
): number => {
  const metrics = [
    "temperature",
    "heartRate",
    "oxygenLevel",
    "gasLevel",
  ] as const;
  let totalScore = 100;

  metrics.forEach((metric) => {
    const value = readings[metric];
    const thresholds = getMetricThresholds(metric);

    if (value >= thresholds.danger) {
      totalScore -= 25;
    } else if (value >= thresholds.warning) {
      totalScore -= 10;
    }
  });

  return Math.max(0, totalScore);
};
