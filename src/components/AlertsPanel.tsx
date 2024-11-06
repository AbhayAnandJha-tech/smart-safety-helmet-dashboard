import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert } from "../types";
import { formatAlertTime } from "../utils/safety";
import { notificationService } from "../services/NotificationService";
import "../styles/AlertsPanel.css";

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onAlertClick,
}) => {
  const handleAcknowledge = async (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.acknowledgeAlert(alertId);
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  };

  return (
    <div className="alerts-panel">
      <h2>Active Alerts</h2>
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            className={`alert-item ${alert.severity}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => onAlertClick?.(alert)}
          >
            <div className="alert-header">
              <span className="alert-type">{alert.type}</span>
              <span className="alert-time">
                {formatAlertTime(alert.timestamp)}
              </span>
            </div>
            <p className="alert-message">{alert.message}</p>
            <div className="alert-footer">
              <span className="worker-id">Worker: {alert.workerId}</span>
              {!alert.acknowledged && (
                <button
                  className="acknowledge-btn"
                  onClick={(e) => handleAcknowledge(alert.id, e)}
                >
                  Acknowledge
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
