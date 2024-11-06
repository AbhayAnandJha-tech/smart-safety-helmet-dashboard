import { db } from "./firebase";
import { ref, set } from "firebase/database";
import { SENSOR_TYPES } from "../config/sensorConfig";

class SensorSimulationService {
  private simulationIntervals: { [key: string]: NodeJS.Timer } = {};

  startSimulation(workerId: string) {
    // GPS Simulation
    this.simulationIntervals["gps"] = setInterval(() => {
      const gpsData = this.generateGPSData();
      this.updateSensorData(workerId, "gps", gpsData);
    }, SENSOR_TYPES.GPS.updateInterval);

    // Temperature Simulation
    this.simulationIntervals["temperature"] = setInterval(() => {
      const tempData = this.generateTemperatureData();
      this.updateSensorData(workerId, "temperature", tempData);
    }, SENSOR_TYPES.TEMPERATURE.updateInterval);

    // Other sensors...
  }

  private generateGPSData() {
    // Simulate movement within a defined area
    return {
      latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
      longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
      altitude: 50 + Math.random() * 10,
      accuracy: 5 + Math.random() * 5,
      timestamp: Date.now(),
    };
  }

  private generateTemperatureData() {
    return {
      value: 25 + (Math.random() - 0.5) * 10, // 20-30°C
      unit: "celsius",
      timestamp: Date.now(),
    };
  }

  // ... similar methods for other sensors

  private async updateSensorData(
    workerId: string,
    sensorType: string,
    data: any
  ) {
    const sensorRef = ref(db, `workers/${workerId}/sensors/${sensorType}`);
    await set(sensorRef, data);
  }

  stopSimulation() {
    Object.values(this.simulationIntervals).forEach((interval) => {
      clearInterval(interval);
    });
    this.simulationIntervals = {};
  }
}

export const sensorSimulation = new SensorSimulationService();
