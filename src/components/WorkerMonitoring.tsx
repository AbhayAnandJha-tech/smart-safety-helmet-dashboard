import React, { useState } from "react";
import { motion } from "framer-motion";
import { WorkerSafetyData, WorkerStatus } from "../types";
import { DataVisualization } from "./DataVisualization";
import "../styles/WorkerMonitoring.css";

interface WorkerMonitoringProps {
  workers: WorkerSafetyData[];
  onWorkerSelect?: (workerId: string) => void;
}

export const WorkerMonitoring: React.FC<WorkerMonitoringProps> = ({
  workers,
  onWorkerSelect,
}) => {
  const [filter, setFilter] = useState<WorkerStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: WorkerStatus): string => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "warning":
        return "#ff9800";
      case "danger":
        return "#f44336";
      case "inactive":
        return "#9e9e9e";
      case "offline":
        return "#757575";
      default:
        return "#9e9e9e";
    }
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchesFilter = filter === "all" || worker.status === filter;
    const matchesSearch = worker.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="worker-monitoring">
      <div className="controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "active" ? "active" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={filter === "warning" ? "active" : ""}
            onClick={() => setFilter("warning")}
          >
            Warning
          </button>
          <button
            className={filter === "danger" ? "active" : ""}
            onClick={() => setFilter("danger")}
          >
            Danger
          </button>
        </div>
      </div>

      <div className="workers-grid">
        {filteredWorkers.map((worker) => (
          <motion.div
            key={worker.id}
            className="worker-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onWorkerSelect?.(worker.id)}
          >
            <div
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(worker.status) }}
            />
            <div className="worker-info">
              <h3>{worker.name}</h3>
              <div className="readings">
                <div className="reading">
                  <span>Temperature:</span>
                  <span>{worker.readings.temperature.toFixed(1)}°C</span>
                </div>
                <div className="reading">
                  <span>Heart Rate:</span>
                  <span>{worker.readings.heartRate} BPM</span>
                </div>
                <div className="reading">
                  <span>Oxygen Level:</span>
                  <span>{worker.readings.oxygenLevel}%</span>
                </div>
                <div className="reading">
                  <span>Gas Level:</span>
                  <span>{worker.readings.gasLevel}%</span>
                </div>
              </div>
              <div className="last-update">
                Last updated: {new Date(worker.lastUpdate).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
