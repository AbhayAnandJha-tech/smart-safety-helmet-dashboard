import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  HardHat,
  Thermometer,
  Wind,
  MapPin,
  Bell,
  Activity,
  Menu,
  ChevronRight,
  Layers,
  BarChart2,
} from "lucide-react";
import { listenForSensorData } from "../firebase.tsx";
import "../styles/Dashboard.css";

export default function MiningDashboard() {
  const [temperature, setTemperature] = useState(0);
  const [gasLevel, setGasLevel] = useState(0);
  const [seismicActivity, setSeismicActivity] = useState(0);
  const [gpsLocation, setGpsLocation] = useState("Unknown");
  const [ventilationStatus, setVentilationStatus] = useState("Normal");
  const [alertStatus, setAlertStatus] = useState("All Clear");
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribeTemperature = listenForSensorData(
      "temperature",
      setTemperature
    );
    const unsubscribeGas = listenForSensorData("gas", setGasLevel);
    const unsubscribeSeismic = listenForSensorData(
      "seismic",
      setSeismicActivity
    );
    const unsubscribeGPS = listenForSensorData("gps", setGpsLocation);
    const unsubscribeVentilation = listenForSensorData(
      "ventilation",
      setVentilationStatus
    );
    const unsubscribeAlert = listenForSensorData("alert", setAlertStatus);

    return () => {
      unsubscribeTemperature();
      unsubscribeGas();
      unsubscribeSeismic();
      unsubscribeGPS();
      unsubscribeVentilation();
      unsubscribeAlert();
    };
  }, []);

  useEffect(() => {
    setTemperatureHistory((prev) =>
      [
        ...prev,
        { time: new Date().toLocaleTimeString(), value: temperature },
      ].slice(-10)
    );
  }, [temperature]);

  const productionData = [
    { name: "Jan", production: 4000 },
    { name: "Feb", production: 3000 },
    { name: "Mar", production: 5000 },
    { name: "Apr", production: 4500 },
    { name: "May", production: 6000 },
    { name: "Jun", production: 5500 },
  ];

  return (
    <div className="mining-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="logo">
            <HardHat size={32} className="logo-icon" />
            <h1>DeepRock Mining</h1>
          </div>
          <nav className={menuOpen ? "active" : ""}>
            <a href="#overview">Overview</a>
            <a href="#safety">Safety</a>
            <a href="#operations">Operations</a>
            <a href="#reports">Reports</a>
          </nav>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h2>Mining Operations Dashboard</h2>
            <p>Real-time insights for optimal performance and safety</p>
            <a href="#dashboard" className="cta-button">
              View Dashboard <ChevronRight size={20} className="ml-2" />
            </a>
          </div>
        </section>

        <section id="dashboard" className="dashboard-grid container">
          <div className="sensor-card">
            <div className="sensor-header">
              <Thermometer size={24} className="sensor-icon" />
              <h3>Shaft Temperature</h3>
            </div>
            <p className={`sensor-value ${temperature > 30 ? "alert" : ""}`}>
              {temperature}°C
            </p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temperatureHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#FFD700"
                    fill="#FFD700"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="sensor-card">
            <div className="sensor-header">
              <Wind size={24} className="sensor-icon" />
              <h3>Gas Levels</h3>
            </div>
            <p className={`sensor-value ${gasLevel > 50 ? "alert" : ""}`}>
              {gasLevel} ppm
            </p>
            <div className="gas-meter">
              <div
                className="gas-level"
                style={{ width: `${Math.min(gasLevel, 100)}%` }}
              />
            </div>
          </div>

          <div className="sensor-card">
            <div className="sensor-header">
              <Activity size={24} className="sensor-icon" />
              <h3>Seismic Activity</h3>
            </div>
            <p className={`sensor-value ${seismicActivity > 4 ? "alert" : ""}`}>
              {seismicActivity} Richter
            </p>
            <div className="seismic-meter">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`seismic-bar ${
                    seismicActivity >= level ? "active" : ""
                  }`}
                  style={{
                    transform: `scaleY(${seismicActivity >= level ? 1 : 0.3})`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="sensor-card">
            <div className="sensor-header">
              <MapPin size={24} className="sensor-icon" />
              <h3>Mining Team Location</h3>
            </div>
            <p className="sensor-value">{gpsLocation}</p>
            <div className="map-placeholder">Interactive Map</div>
          </div>
        </section>

        <section className="control-panel container">
          <div className="control-card">
            <div className="control-header">
              <Wind size={24} className="control-icon" />
              <h3>Ventilation System</h3>
            </div>
            <p
              className={`control-value ${
                ventilationStatus !== "Normal" ? "alert" : ""
              }`}
            >
              {ventilationStatus}
            </p>
            <button className="control-button">Override Ventilation</button>
          </div>

          <div className="control-card">
            <div className="control-header">
              <Bell size={24} className="control-icon" />
              <h3>Alert Status</h3>
            </div>
            <p
              className={`control-value ${
                alertStatus !== "All Clear" ? "alert" : ""
              }`}
            >
              {alertStatus}
            </p>
            <div className="alert-controls">
              <button className="control-button emergency">
                <Bell size={20} className="mr-2" /> Emergency Evacuation
              </button>
              <button className="control-button all-clear">
                <Bell size={20} className="mr-2" /> Sound All Clear
              </button>
            </div>
          </div>
        </section>

        <section className="production-chart container">
          <div className="chart-card">
            <div className="chart-header">
              <BarChart2 size={24} className="chart-icon" />
              <h3>Monthly Production</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="production"
                    stroke="#FFD700"
                    fill="#FFD700"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="key-operations">
          <div className="container">
            <h2>Key Mining Operations</h2>
            <div className="operations-grid">
              <div className="operation-card">
                <Layers size={48} className="operation-icon" />
                <h3>Excavation</h3>
                <p>
                  State-of-the-art excavation techniques for efficient mineral
                  extraction.
                </p>
              </div>
              <div className="operation-card">
                <HardHat size={48} className="operation-icon" />
                <h3>Safety Protocols</h3>
                <p>
                  Rigorous safety measures to ensure the well-being of our
                  mining teams.
                </p>
              </div>
              <div className="operation-card">
                <BarChart2 size={48} className="operation-icon" />
                <h3>Production Analytics</h3>
                <p>
                  Advanced analytics for optimizing mining operations and
                  output.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <div className="container">
          <p>&copy; 2024 DeepRock Mining. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
