import { database } from "../firebase";
import { ref, push, set, get, remove, update } from "firebase/database";
import { Device } from "../types";

export class DeviceAuthService {
  private devicesRef = ref(database, "devices");

  async registerDevice(
    device: Omit<Device, "id" | "lastSeen">
  ): Promise<Device> {
    try {
      const newDeviceRef = push(this.devicesRef);
      const deviceId = newDeviceRef.key!;

      const newDevice: Device = {
        ...device,
        id: deviceId,
        lastSeen: Date.now(),
      };

      await set(newDeviceRef, newDevice);
      return newDevice;
    } catch (error) {
      console.error("Error registering device:", error);
      throw error;
    }
  }

  async updateDeviceStatus(
    deviceId: string,
    status: Device["status"]
  ): Promise<void> {
    try {
      const deviceRef = ref(database, `devices/${deviceId}`);
      await update(deviceRef, {
        status,
        lastSeen: Date.now(),
      });
    } catch (error) {
      console.error("Error updating device status:", error);
      throw error;
    }
  }

  async removeDevice(deviceId: string): Promise<void> {
    try {
      const deviceRef = ref(database, `devices/${deviceId}`);
      await remove(deviceRef);
    } catch (error) {
      console.error("Error removing device:", error);
      throw error;
    }
  }

  async getDevices(): Promise<Device[]> {
    try {
      const snapshot = await get(this.devicesRef);
      if (!snapshot.exists()) return [];

      return Object.entries(snapshot.val()).map(([id, device]) => ({
        ...(device as Omit<Device, "id">),
        id,
      }));
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  }
}

export const deviceAuthService = new DeviceAuthService();
