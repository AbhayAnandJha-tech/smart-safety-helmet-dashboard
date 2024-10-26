import React, { useState } from "react";
import { Shield, Bell, Settings, Users, Cpu } from "lucide-react";
import "../styles/AdminControls.css";

const AdminControls: React.FC = () => {
  const [alertThreshold, setAlertThreshold] = useState(50);
  const [maintenanceInterval, setMaintenanceInterval] = useState(30);

  const handleAlertThresholdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAlertThreshold(Number(event.target.value));
  };

  const handleMaintenanceIntervalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaintenanceInterval(Number(event.target.value));
  };

  return (
    <div className="admin-controls">
      <h1 className="page-title">Admin Controls</h1>
      <div className="admin-grid">
        <div className="admin-card">
          <h2>
            <Bell size={24} /> Alert Settings
          </h2>
          <div className="setting-group">
            <label htmlFor="alertThreshold">Alert Threshold (%)</label>
            <input
              type="range"
              id="alertThreshold"
              min="0"
              max="100"
              value={alertThreshold}
              onChange={handleAlertThresholdChange}
            />
            <span>{alertThreshold}%</span>
          </div>
          <button className="save-button">Save Alert Settings</button>
        </div>
        <div className="admin-card">
          <h2>
            <Settings size={24} /> Maintenance Settings
          </h2>
          <div className="setting-group">
            <label htmlFor="maintenanceInterval">
              Maintenance Interval (days)
            </label>
            <input
              type="number"
              id="maintenanceInterval"
              min="1"
              max="365"
              value={maintenanceInterval}
              onChange={handleMaintenanceIntervalChange}
            />
          </div>
          <button className="save-button">Save Maintenance Settings</button>
        </div>
        <div className="admin-card">
          <h2>
            <Users size={24} /> User Management
          </h2>
          <p>Manage user accounts and permissions</p>
          <button className="action-button">Manage Users</button>
        </div>
        <div className="admin-card">
          <h2>
            <Cpu size={24} /> System Diagnostics
          </h2>
          <p>Run system checks and view logs</p>
          <button className="action-button">Run Diagnostics</button>
        </div>
      </div>
    </div>
  );
};

export default AdminControls;
