import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { alertService } from "../services/AlertService";
import { Alert } from "../types";
import "../styles/AlertManagement.css";

const AlertManagement: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const unsubscribe = alertService.subscribeToAlerts(setAlerts);
    return () => unsubscribe();
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    await alertService.acknowledgeAlert(alertId);
  };

  return (
    <div className="alert-management">
      <h2>Alert Management</h2>
      <div className="alerts-container">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              className={`alert-item ${alert.severity}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <div className="alert-header">
                <span className="alert-type">{alert.type}</span>
                <span className="alert-severity">{alert.severity}</span>
              </div>
              <p className="alert-message">{alert.message}</p>
              <div className="alert-footer">
                <span className="alert-time">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="acknowledge-btn"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertManagement;
