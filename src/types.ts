export interface SensorData {
  id: string;
  helmetId: string;
  readings: {
    temperature: number;
    humidity: number;
    gasLevel: number;
    oxygenLevel: number;
    heartRate: number;
    location: {
      x: number;
      y: number;
    };
  };
  timestamp: number;
}

export interface Device {
  id: string;
  name: string;
  status: "active" | "inactive";
  batteryLevel: number;
  version: string;
  lastSeen: number;
  helmetId: string;
  firmware: string;
  lastUpdate: number;
}

export interface SafetyStats {
  activeWorkers: number;
  alerts: number;
  temperature: number;
  oxygenLevel: number;
}

export interface Alert {
  id: string;
  type: "safety" | "system" | "maintenance";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: number;
  acknowledged: boolean;
  resolved: boolean;
  workerId?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: string;
  department: string;
  lastLogin: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface WorkerSafetyData {
  workerId: string;
  name: string;
  helmetId: string;
  status: "active" | "inactive";
  readings: {
    temperature: number;
    humidity: number;
    gasLevel: number;
    oxygenLevel: number;
    heartRate: number;
    location: {
      x: number;
      y: number;
    };
  };
  timestamp: number;
}

export interface DeviceRegistration {
  helmetId: string;
  workerId: string;
  initialStatus: Device["status"];
}

export interface FirmwareUpdate {
  version: string;
  url: string;
  releaseNotes: string;
  mandatory: boolean;
}

export interface DataPoint {
  timestamp: number;
  temperature: number;
  humidity: number;
  gasLevel: number;
  oxygenLevel: number;
  heartRate: number;
}
