import React, { useState } from "react";
import { Device, DeviceType, DeviceStatus } from "../types";
import "../styles/DeviceManagement.css";

export const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (deviceId: string, status: DeviceStatus) => {
    try {
      setDevices(
        devices.map((d) => (d.id === deviceId ? { ...d, status } : d))
      );
    } catch (err) {
      setError("Failed to update device status");
    }
  };

  return (
    <div className="device-management">
      <h2>Device Management</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="device-grid">
        {devices.map((device) => (
          <div key={device.id} className="device-card">
            <h3>{device.name}</h3>
            <div className="device-info">
              <p>Type: {device.type}</p>
              <p>Status: {device.status}</p>
              <p>Battery: {device.batteryLevel}%</p>
            </div>
            <select
              value={device.status}
              onChange={(e) =>
                handleStatusChange(device.id, e.target.value as DeviceStatus)
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
