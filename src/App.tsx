import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { DeviceManagement } from "./components/DeviceManagement";
import { WorkerMonitoring } from "./components/WorkerMonitoring";
import "./styles/App.css";

export const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<DeviceManagement />} />
            <Route path="/workers" element={<WorkerMonitoring />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
