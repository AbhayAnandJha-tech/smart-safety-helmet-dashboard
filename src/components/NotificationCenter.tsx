import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert } from "../types";
import { alertService } from "../services/AlertService";
import "../styles/NotificationCenter.css";

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = alertService.subscribeToAlerts((alerts: Alert[]) => {
      setNotifications(alerts.filter((alert: Alert) => !alert.acknowledged));
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const handleDismiss = async (alertId: string) => {
    try {
      await alertService.acknowledgeAlert(alertId);
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  };

  return (
    <div className="notification-center">
      <button
        className={`notification-toggle ${
          notifications.length > 0 ? "has-notifications" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="notification-icon">🔔</span>
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notification-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="notification-header">
              <h3>Notifications</h3>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="notification-list">
              <AnimatePresence>
                {notifications.length === 0 ? (
                  <motion.div
                    className="no-notifications"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No new notifications
                  </motion.div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`notification-item ${notification.severity}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                    >
                      <div className="notification-content">
                        <div className="notification-type">
                          {notification.type}
                        </div>
                        <div className="notification-message">
                          {notification.message}
                        </div>
                        <div className="notification-time">
                          {new Date(
                            notification.timestamp
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                      <button
                        className="dismiss-button"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        Dismiss
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
