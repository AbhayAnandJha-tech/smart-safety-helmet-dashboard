import React from "react";
import "../styles/SafetyStats.css";

interface Stats {
  activeWorkers: number;
  alerts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  temperature: {
    avg: number;
    max: number;
    min: number;
  };
  oxygenLevel: {
    avg: number;
    min: number;
  };
}

interface Props {
  stats: Stats;
}

export const SafetyStats: React.FC<Props> = ({ stats }) => {
  return (
    <div className="safety-stats">
      <div className="stat-card">
        <h3>Active Workers</h3>
        <div className="stat-value">{stats.activeWorkers}</div>
      </div>

      <div className="stat-card">
        <h3>Alerts</h3>
        <div className="alerts-grid">
          <div className="alert-item critical">
            <span>Critical</span>
            <span>{stats.alerts.critical}</span>
          </div>
          <div className="alert-item high">
            <span>High</span>
            <span>{stats.alerts.high}</span>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <h3>Temperature</h3>
        <div>Avg: {stats.temperature.avg.toFixed(1)}°C</div>
        <div>Max: {stats.temperature.max.toFixed(1)}°C</div>
      </div>
    </div>
  );
};
