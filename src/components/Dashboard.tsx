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
  Bell,
  Activity,
  Menu,
  ChevronRight,
  BarChart2,
  Shovel,
  Drill,
  Truck,
} from "lucide-react";
import { listenForSensorData } from "../firebase.tsx";
import "../styles/Dashboard.css";
import PathfindingGrid from "./PathfindingVisualizer.tsx";

export default function MiningDashboard() {
  const [temperature, setTemperature] = useState(0);
  const [gasLevel, setGasLevel] = useState(0);
  const [seismicActivity, setSeismicActivity] = useState(0);
  const [ventilationStatus, setVentilationStatus] = useState("Normal");
  const [alertStatus, setAlertStatus] = useState("All Clear");
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const [gridSize] = useState<number[]>([8, 8]);
  const [start] = useState<number[]>([0, 0]);
  const [goal] = useState<number[]>([7, 7]);
  const [obstacles] = useState<Set<string>>(new Set(["3,3", "4,4"]));

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
    const unsubscribeVentilation = listenForSensorData(
      "ventilation",
      setVentilationStatus
    );
    const unsubscribeAlert = listenForSensorData("alert", setAlertStatus);

    return () => {
      unsubscribeTemperature();
      unsubscribeGas();
      unsubscribeSeismic();
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
        <section
          className="hero"
          style={{
            backgroundImage: `url('https://media.istockphoto.com/id/584595162/photo/extraction-of-coal.jpg?s=612x612&w=0&k=20&c=Em0eOABdsdwRttaNVMxJJcLxi9sVeJoyizM-l9uUYWA=')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container">
            <div className="hero-content">
              <h2>Mining Operations Dashboard</h2>
              <p>Real-time insights for optimal performance and safety</p>
              <a href="#dashboard" className="cta-button">
                View Dashboard <ChevronRight size={20} className="ml-2" />
              </a>
            </div>
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
        </section>

        <div className="sensor-card large">
          <PathfindingGrid
            gridSize={gridSize}
            start={start}
            goal={goal}
            obstacles={obstacles}
          />
        </div>

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

        <section className="operations">
          <div className="container">
            <h2>Mining Operations</h2>
            <div className="detail-cards">
              <div className="detail-card">
                <div className="detail-header">
                  <Shovel size={32} className="detail-icon" />
                  <h3>Excavation</h3>
                </div>
                <p>
                  Our advanced excavation techniques ensure efficient and safe
                  material extraction.
                </p>
                <ul>
                  <li>State-of-the-art machinery</li>
                  <li>Precision digging algorithms</li>
                  <li>Real-time geological analysis</li>
                </ul>
                <div className="detail-stats">
                  <div className="stat">
                    <span className="stat-value">1,500</span>
                    <span className="stat-label">Tons/Day</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">99.9%</span>
                    <span className="stat-label">Accuracy</span>
                  </div>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-header">
                  <Drill size={32} className="detail-icon" />
                  <h3>Drilling</h3>
                </div>
                <p>
                  High-precision drilling operations for optimal resource
                  extraction.
                </p>
                <ul>
                  <li>Automated drill bit selection</li>
                  <li>Vibration dampening technology</li>
                  <li>Continuous core sampling</li>
                </ul>
                <div className="detail-stats">
                  <div className="stat">
                    <span className="stat-value">500</span>
                    <span className="stat-label">Meters/Day</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">0.1mm</span>
                    <span className="stat-label">Precision</span>
                  </div>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-header">
                  <Truck size={32} className="detail-icon" />
                  <h3>Haulage</h3>
                </div>
                <p>
                  Efficient material transport systems to maximize productivity.
                </p>
                <ul>
                  <li>Autonomous haulage vehicles</li>
                  <li>Optimized route planning</li>
                  <li>Real-time load monitoring</li>
                </ul>
                <div className="detail-stats">
                  <div className="stat">
                    <span className="stat-value">10,000</span>
                    <span className="stat-label">Tons/Day</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">98%</span>
                    <span className="stat-label">Efficiency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2024 DeepRock Mining. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
