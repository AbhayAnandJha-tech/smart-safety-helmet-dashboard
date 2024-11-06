import { useState, useEffect } from "react";
import { Device } from "../types";
import { deviceAuthService } from "../services/DeviceAuthService";

export const useDeviceManagement = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = async () => {
    try {
      const deviceList = await deviceAuthService.getDevices();
      setDevices(deviceList);
      setError(null);
    } catch (err) {
      console.error("Failed to load devices:", err);
      setError("Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const updateDeviceStatus = async (
    deviceId: string,
    status: Device["status"]
  ) => {
    try {
      await deviceAuthService.updateDeviceStatus(deviceId, status);
      setDevices(
        devices.map((d) => (d.id === deviceId ? { ...d, status } : d))
      );
    } catch (err) {
      console.error("Failed to update device status:", err);
      throw err;
    }
  };

  const removeDevice = async (deviceId: string) => {
    try {
      await deviceAuthService.removeDevice(deviceId);
      setDevices(devices.filter((d) => d.id !== deviceId));
    } catch (err) {
      console.error("Failed to remove device:", err);
      throw err;
    }
  };

  const addDevice = async (device: Omit<Device, "id" | "lastSeen">) => {
    try {
      const newDevice = await deviceAuthService.registerDevice(device);
      setDevices([...devices, newDevice]);
      return newDevice;
    } catch (err) {
      console.error("Failed to add device:", err);
      throw err;
    }
  };

  return {
    devices,
    loading,
    error,
    updateDeviceStatus,
    removeDevice,
    addDevice,
    loadDevices,
  };
};
