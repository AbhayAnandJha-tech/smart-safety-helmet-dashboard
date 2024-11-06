import { database } from "../firebase";
import { ref, get, set, push, remove } from "firebase/database";
import { Device } from "../types";

class DeviceService {
  private devicesRef = ref(database, "devices");

  async getDevices(): Promise<Device[]> {
    try {
      const snapshot = await get(this.devicesRef);
      const devices: Device[] = [];

      snapshot.forEach((child) => {
        devices.push({
          id: child.key!,
          ...child.val(),
        });
      });

      return devices;
    } catch (error) {
      console.error("Failed to get devices:", error);
      throw new Error("Failed to get devices");
    }
  }

  async addDevice(device: Omit<Device, "id">): Promise<string> {
    try {
      const newDeviceRef = push(this.devicesRef);
      const deviceId = newDeviceRef.key!;

      await set(newDeviceRef, {
        ...device,
        id: deviceId,
        lastSeen: Date.now(),
      });

      return deviceId;
    } catch (error) {
      console.error("Failed to add device:", error);
      throw new Error("Failed to add device");
    }
  }

  async updateDeviceStatus(
    deviceId: string,
    status: Device["status"]
  ): Promise<void> {
    try {
      const deviceRef = ref(database, `devices/${deviceId}`);
      const snapshot = await get(deviceRef);
      const device = snapshot.val();

      if (!device) {
        throw new Error("Device not found");
      }

      await set(deviceRef, {
        ...device,
        status,
        lastUpdate: Date.now(),
      });
    } catch (error) {
      console.error("Failed to update device status:", error);
      throw new Error("Failed to update device status");
    }
  }

  async removeDevice(deviceId: string): Promise<void> {
    try {
      const deviceRef = ref(database, `devices/${deviceId}`);
      await remove(deviceRef);
    } catch (error) {
      console.error("Failed to remove device:", error);
      throw new Error("Failed to remove device");
    }
  }
}

export const deviceService = new DeviceService();
