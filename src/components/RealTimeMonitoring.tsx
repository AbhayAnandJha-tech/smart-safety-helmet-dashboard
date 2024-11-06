import React, { useEffect, useState } from "react";
import { realtimeService } from "../services/RealtimeService";
import { WorkerSafetyData } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/RealTimeMonitoring.css";

interface WorkerDataMap {
  [key: string]: WorkerSafetyData;
}

const RealTimeMonitoring: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerDataMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const workerIds = ["worker1", "worker2", "worker3"]; // Replace with dynamic worker IDs
    const unsubscribes = workerIds.map((workerId) =>
      realtimeService.monitorWorker(workerId, (data: WorkerSafetyData) => {
        setWorkers((prev) => ({
          ...prev,
          [workerId]: data,
        }));
        setLoading(false);
      })
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading worker data...</div>;
  }

  return (
    <div className="real-time-monitoring">
      <AnimatePresence>
        {Object.entries(workers).map(([workerId, data]) => (
          <motion.div
            key={workerId}
            className="worker-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <h3>{data.name}</h3>
            <div className="readings">
              <div className="reading">
                <span>Temperature</span>
                <span>{data.readings.temperature}°C</span>
              </div>
              <div className="reading">
                <span>Heart Rate</span>
                <span>{data.readings.heartRate} BPM</span>
              </div>
              <div className="reading">
                <span>Oxygen Level</span>
                <span>{data.readings.oxygenLevel}%</span>
              </div>
              <div className="reading">
                <span>Gas Level</span>
                <span>{data.readings.gasLevel}%</span>
              </div>
            </div>
            <div className="status">
              Status: <span className={data.status}>{data.status}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeMonitoring;
