export interface Device {
  id: string;
  type: "helmet" | "sensor" | "beacon";
  status: "active" | "inactive" | "maintenance";
  batteryLevel: number;
  firmwareVersion: string;
  lastSeen: number;
  location?: {
    x: number;
    y: number;
  };
  assignedTo?: string; // Worker ID
  settings: {
    updateInterval: number;
    alertThresholds: {
      temperature: number;
      gasLevel: number;
      batteryLevel: number;
    };
  };
}

export interface DeviceRegistration {
  type: Device["type"];
  settings: Device["settings"];
}

export interface DeviceUpdate {
  status?: Device["status"];
  batteryLevel?: number;
  firmwareVersion?: string;
  location?: Device["location"];
  settings?: Partial<Device["settings"]>;
}
