// Basic types
export type WorkerStatus =
  | "active"
  | "inactive"
  | "warning"
  | "danger"
  | "offline";
export type DeviceType = "helmet" | "sensor" | "beacon";
export type DeviceStatus = "active" | "inactive";
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertType = "safety" | "system" | "maintenance";

// Worker interfaces
export interface WorkerSafetyData {
  id: string;
  name: string;
  status: WorkerStatus;
  lastUpdate: number;
  readings: {
    temperature: number;
    heartRate: number;
    oxygenLevel: number;
    gasLevel: number;
    humidity: number;
    location: {
      x: number;
      y: number;
    };
  };
}

// Device interface
export interface Device {
  id: string;
  type: DeviceType;
  status: DeviceStatus;
  name: string;
  batteryLevel: number;
  firmwareVersion: string;
  lastSeen: number;
}

// Alert interface
export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  workerId: string;
  timestamp: number;
  acknowledged: boolean;
  resolved: boolean;
}

// Stats interfaces
export interface SafetyStats {
  activeWorkers: number;
  alerts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  temperature: {
    avg: number;
    max: number;
    min: number;
  };
  oxygenLevel: {
    avg: number;
    min: number;
  };
}
