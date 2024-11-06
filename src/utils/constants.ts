export const SAFETY_THRESHOLDS = {
  temperature: { min: 10, max: 35 },
  gasLevel: { max: 100 },
  oxygenLevel: { min: 19.5 },
  heartRate: { min: 60, max: 100 },
  batteryLevel: { min: 20 },
};

export const ALERT_TYPES = {
  HIGH_TEMPERATURE: "HIGH_TEMPERATURE",
  LOW_OXYGEN: "LOW_OXYGEN",
  HIGH_GAS: "HIGH_GAS",
  IRREGULAR_HEARTRATE: "IRREGULAR_HEARTRATE",
} as const;

export const ALERT_SEVERITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  WORKERS: "/workers",
  ALERTS: "/alerts",
  SETTINGS: "/settings",
};
