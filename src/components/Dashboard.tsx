import React, { useState, useEffect } from "react";
import {
  Thermometer,
  Wind,
  Activity,
  Users,
  HardHat,
  AlertTriangle,
  BarChart2,
} from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { listenForSensorData } from "../firebase.tsx";
import "../styles/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [gasLevel, setGasLevel] = useState<number | null>(null);
  const [seismicActivity, setSeismicActivity] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [temperatureHistory, setTemperatureHistory] = useState<
    { time: string; value: number }[]
  >([]);

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
    const unsubscribeHumidity = listenForSensorData("humidity", setHumidity);

    return () => {
      unsubscribeTemperature();
      unsubscribeGas();
      unsubscribeSeismic();
      unsubscribeHumidity();
    };
  }, []);

  useEffect(() => {
    if (temperature !== null) {
      setTemperatureHistory((prev) =>
        [
          ...prev,
          { time: new Date().toLocaleTimeString(), value: temperature },
        ].slice(-10)
      );
    }
  }, [temperature]);

  const chartData = {
    labels: temperatureHistory.map((data) => data.time),
    datasets: [
      {
        label: "Temperature",
        data: temperatureHistory.map((data) => data.value),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Temperature Trend",
      },
    },
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Mining Operations Dashboard</h1>

      <div className="dashboard-grid">
        <div className="sensor-card">
          <div className="sensor-header">
            <Thermometer size={24} className="sensor-icon" />
            <h3>Shaft Temperature</h3>
          </div>
          <p
            className={`sensor-value ${
              temperature && temperature > 30 ? "alert" : ""
            }`}
          >
            {temperature !== null ? temperature.toFixed(1) : "N/A"}°C
          </p>
          <div className="chart-container">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>

        <div className="sensor-card">
          <div className="sensor-header">
            <Wind size={24} className="sensor-icon" />
            <h3>Gas Levels</h3>
          </div>
          <p
            className={`sensor-value ${
              gasLevel && gasLevel > 50 ? "alert" : ""
            }`}
          >
            {gasLevel !== null ? gasLevel.toFixed(1) : "N/A"} ppm
          </p>
          <div className="gas-meter">
            <div
              className="gas-level"
              style={{ width: `${Math.min(gasLevel ?? 0, 100)}%` }}
            />
          </div>
        </div>

        <div className="sensor-card">
          <div className="sensor-header">
            <Activity size={24} className="sensor-icon" />
            <h3>Seismic Activity</h3>
          </div>
          <p
            className={`sensor-value ${
              seismicActivity && seismicActivity > 4 ? "alert" : ""
            }`}
          >
            {seismicActivity !== null ? seismicActivity.toFixed(2) : "N/A"}{" "}
            Richter
          </p>
          <div className="seismic-meter">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`seismic-bar ${
                  seismicActivity && seismicActivity >= level ? "active" : ""
                }`}
                style={{
                  transform: `scaleY(${
                    seismicActivity && seismicActivity >= level ? 1 : 0.3
                  })`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="sensor-card">
          <div className="sensor-header">
            <Wind size={24} className="sensor-icon" />
            <h3>Humidity</h3>
          </div>
          <p
            className={`sensor-value ${
              humidity && humidity > 70 ? "alert" : ""
            }`}
          >
            {humidity !== null ? humidity.toFixed(1) : "N/A"}%
          </p>
          <div className="humidity-meter">
            <div
              className="humidity-level"
              style={{ height: `${Math.min(humidity ?? 0, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">
          <Users size={24} />
          Worker Status
        </h2>
        <div className="worker-grid">
          {[1, 2, 3].map((worker) => (
            <div key={worker} className="worker-card slide-in">
              <div className="worker-header">
                <HardHat size={24} />
                <h4>Worker {worker}</h4>
              </div>
              <Player
                autoplay
                loop
                src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
                style={{ height: "100px", width: "100px" }}
              />
              <p>Status: Active</p>
              <p>Location: Shaft {String.fromCharCode(64 + worker)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">
          <AlertTriangle size={24} />
          Recent Alerts
        </h2>
        <div className="alert-list">
          <div className="alert-item warning pulse">
            <AlertTriangle size={18} />
            <p>High gas levels detected in Shaft B</p>
            <span className="alert-time">2 min ago</span>
          </div>
          <div className="alert-item danger pulse">
            <AlertTriangle size={18} />
            <p>Seismic activity above threshold</p>
            <span className="alert-time">15 min ago</span>
          </div>
          <div className="alert-item info">
            <AlertTriangle size={18} />
            <p>Maintenance required for Conveyor B</p>
            <span className="alert-time">1 hour ago</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">
          <BarChart2 size={24} />
          Production Overview
        </h2>
        <div className="production-chart">
          <Player
            autoplay
            loop
            src="https://assets9.lottiefiles.com/packages/lf20_xyadoh9h.json"
            style={{ height: "300px", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
