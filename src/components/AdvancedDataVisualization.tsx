import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { SensorData } from "../types";
import { sensorService } from "../services/SensorService";
import "../styles/AdvancedDataVisualization.css";

interface DataPoint {
  timestamp: number;
  temperature: number;
  humidity: number;
  gasLevel: number;
  oxygenLevel: number;
}

const AdvancedDataVisualization: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "temperature",
  ]);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const readings = await sensorService.getLatestReadings(100);
      const transformedData = transformData(readings);
      setData(transformedData);
    } catch (error) {
      console.error("Failed to fetch sensor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const transformData = (sensorData: SensorData[]): DataPoint[] => {
    return sensorData.map((data) => ({
      timestamp: data.timestamp,
      temperature: data.readings.temperature,
      humidity: data.readings.humidity,
      gasLevel: data.readings.gasLevel,
      oxygenLevel: data.readings.oxygenLevel,
    }));
  };

  const renderCharts = () => {
    return selectedMetrics.map((metric) => (
      <div key={metric} className="chart-container">
        <Line
          data={{
            labels: data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
            datasets: [
              {
                label: metric.charAt(0).toUpperCase() + metric.slice(1),
                data: data.map((d) => d[metric as keyof DataPoint]),
                borderColor: getMetricColor(metric),
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Time",
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: getMetricUnit(metric),
                },
              },
            },
          }}
        />
      </div>
    ));
  };

  const getMetricColor = (metric: string): string => {
    const colors: { [key: string]: string } = {
      temperature: "#ff6b6b",
      humidity: "#4dabf7",
      gasLevel: "#ffd43b",
      oxygenLevel: "#69db7c",
    };
    return colors[metric] || "#000000";
  };

  const getMetricUnit = (metric: string): string => {
    const units: { [key: string]: string } = {
      temperature: "°C",
      humidity: "%",
      gasLevel: "ppm",
      oxygenLevel: "%",
    };
    return units[metric] || "";
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="advanced-visualization">
      <div className="controls">
        <div className="control-group">
          <label>Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div className="control-group">
          <label>Metrics:</label>
          <select
            multiple
            value={selectedMetrics}
            onChange={(e) =>
              setSelectedMetrics(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="gasLevel">Gas Level</option>
            <option value="oxygenLevel">Oxygen Level</option>
          </select>
        </div>
      </div>
      <div className="charts">{renderCharts()}</div>
    </div>
  );
};

export default AdvancedDataVisualization;
