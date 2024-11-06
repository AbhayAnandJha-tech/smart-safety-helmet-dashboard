import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sensorService } from "../services/SensorService";
import { SensorData } from "../types";
import "../styles/SensorMonitoring.css";

interface Props {
  helmetId: string;
}

const SensorMonitoring: React.FC<Props> = ({ helmetId }) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const thresholds = sensorService.getThresholds();

  useEffect(() => {
    const unsubscribe = sensorService.listenToSensorData(
      helmetId,
      (data: SensorData) => {
        setSensorData(data);
        setLoading(false);
        checkThresholds(data);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [helmetId]);

  const checkThresholds = (data: SensorData) => {
    const { readings } = data;
    let alerts = [];

    if (readings.temperature > thresholds.temperature.max) {
      alerts.push(`High temperature: ${readings.temperature}°C`);
    }

    if (readings.gasLevel > thresholds.gasLevel.max) {
      alerts.push(`High gas level: ${readings.gasLevel}%`);
    }

    if (readings.oxygenLevel < thresholds.oxygenLevel.min) {
      alerts.push(`Low oxygen level: ${readings.oxygenLevel}%`);
    }

    if (alerts.length > 0) {
      handleAlerts(alerts);
    }
  };

  const handleAlerts = async (alerts: string[]) => {
    try {
      await sensorService.sendCommandToSensor(helmetId, "ALERT");
      // Additional alert handling logic here
    } catch (error) {
      console.error("Failed to send alerts:", error);
    }
  };

  if (loading) {
    return <div className="sensor-loading">Loading sensor data...</div>;
  }

  if (error) {
    return <div className="sensor-error">{error}</div>;
  }

  if (!sensorData) {
    return <div className="sensor-error">No sensor data available</div>;
  }

  return (
    <div className="sensor-monitoring">
      <AnimatePresence>
        <motion.div
          className="sensor-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3>Sensor Readings</h3>
          <div className="readings-grid">
            <ReadingItem
              label="Temperature"
              value={`${sensorData.readings.temperature}°C`}
              isAlert={
                sensorData.readings.temperature > thresholds.temperature.max
              }
            />
            <ReadingItem
              label="Humidity"
              value={`${sensorData.readings.humidity}%`}
              isAlert={
                sensorData.readings.humidity < thresholds.humidity.min ||
                sensorData.readings.humidity > thresholds.humidity.max
              }
            />
            <ReadingItem
              label="Gas Level"
              value={`${sensorData.readings.gasLevel}%`}
              isAlert={sensorData.readings.gasLevel > thresholds.gasLevel.max}
            />
            <ReadingItem
              label="Oxygen Level"
              value={`${sensorData.readings.oxygenLevel}%`}
              isAlert={
                sensorData.readings.oxygenLevel < thresholds.oxygenLevel.min
              }
            />
          </div>
          <div className="last-update">
            Last updated: {new Date(sensorData.timestamp).toLocaleTimeString()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

interface ReadingItemProps {
  label: string;
  value: string;
  isAlert: boolean;
}

const ReadingItem: React.FC<ReadingItemProps> = ({ label, value, isAlert }) => (
  <div className={`reading-item ${isAlert ? "alert" : ""}`}>
    <span className="reading-label">{label}</span>
    <span className="reading-value">{value}</span>
  </div>
);

export default SensorMonitoring;
