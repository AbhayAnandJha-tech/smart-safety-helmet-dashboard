import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertSeverity } from "../types";
import { useAlerts } from "../hooks/useAlerts";
import "../styles/AlertSystem.css";

interface AlertSystemProps {
  onAlertClick?: (alert: Alert) => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ onAlertClick }) => {
  const { alerts, acknowledgeAlert, resolveAlert } = useAlerts();
  const [filter, setFilter] = useState<AlertSeverity | "all">("all");
  const [showResolved, setShowResolved] = useState(false);

  const getSeverityColor = (severity: AlertSeverity): string => {
    switch (severity) {
      case "critical":
        return "#f44336";
      case "high":
        return "#ff9800";
      case "medium":
        return "#ffeb3b";
      case "low":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = filter === "all" || alert.severity === filter;
    const matchesResolved = showResolved || !alert.resolved;
    return matchesSeverity && matchesResolved;
  });

  const handleAcknowledge = async (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await acknowledgeAlert(alertId);
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  };

  const handleResolve = async (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await resolveAlert(alertId);
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    }
  };

  return (
    <div className="alert-system">
      <div className="alert-controls">
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "critical" ? "active" : ""}
            onClick={() => setFilter("critical")}
          >
            Critical
          </button>
          <button
            className={filter === "high" ? "active" : ""}
            onClick={() => setFilter("high")}
          >
            High
          </button>
          <button
            className={filter === "medium" ? "active" : ""}
            onClick={() => setFilter("medium")}
          >
            Medium
          </button>
          <button
            className={filter === "low" ? "active" : ""}
            onClick={() => setFilter("low")}
          >
            Low
          </button>
        </div>
        <label className="show-resolved">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
          />
          Show Resolved
        </label>
      </div>

      <AnimatePresence>
        {filteredAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            className={`alert-card ${alert.severity} ${
              alert.resolved ? "resolved" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => onAlertClick?.(alert)}
          >
            <div
              className="severity-indicator"
              style={{ backgroundColor: getSeverityColor(alert.severity) }}
            />
            <div className="alert-content">
              <div className="alert-header">
                <span className="alert-type">{alert.type}</span>
                <span className="alert-time">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="alert-message">{alert.message}</p>
              <div className="alert-footer">
                <span className="worker-id">Worker: {alert.workerId}</span>
                <div className="alert-actions">
                  {!alert.acknowledged && (
                    <button
                      className="acknowledge"
                      onClick={(e) => handleAcknowledge(alert.id, e)}
                    >
                      Acknowledge
                    </button>
                  )}
                  {!alert.resolved && (
                    <button
                      className="resolve"
                      onClick={(e) => handleResolve(alert.id, e)}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
