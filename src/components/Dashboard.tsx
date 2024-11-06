import React from "react";
import { SafetyStats } from "./SafetyStats";
import { WorkerOverview } from "./WorkerOverview";
import "../styles/Dashboard.css";

export const Dashboard: React.FC = () => {
  const mockStats = {
    activeWorkers: 12,
    alerts: {
      critical: 1,
      high: 2,
      medium: 3,
      low: 4,
    },
    temperature: {
      avg: 36.5,
      max: 37.8,
      min: 36.1,
    },
    oxygenLevel: {
      avg: 98,
      min: 95,
    },
  };

  const mockWorkers = [
    {
      id: "1",
      name: "John Doe",
      status: "active",
      lastUpdate: Date.now(),
      readings: {
        temperature: 36.5,
        heartRate: 75,
        oxygenLevel: 98,
        gasLevel: 2,
        humidity: 45,
        location: { x: 0, y: 0 },
      },
    },
  ];

  return (
    <div className="dashboard">
      <h1>Safety Dashboard</h1>
      <SafetyStats stats={mockStats} />
      <WorkerOverview workers={mockWorkers} />
    </div>
  );
};
