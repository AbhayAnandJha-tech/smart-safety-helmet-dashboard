import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { WorkerSafetyData } from "../types";
import "../styles/Analytics.css";

interface AnalyticsProps {
  workers: WorkerSafetyData[];
  timeRange?: number; // in hours
}

export const Analytics: React.FC<AnalyticsProps> = ({
  workers,
  timeRange = 24,
}) => {
  const hourlyData = useMemo(() => {
    const now = Date.now();
    const interval = 1000 * 60 * 60; // 1 hour in milliseconds
    const data = {
      labels: [] as string[],
      temperatures: [] as number[],
      oxygenLevels: [] as number[],
      heartRates: [] as number[],
      activeWorkers: [] as number[],
    };

    for (let i = 0; i < timeRange; i++) {
      const timestamp = now - (timeRange - 1 - i) * interval;
      const relevantWorkers = workers.filter(
        (w) => w.lastUpdate >= timestamp - interval && w.lastUpdate < timestamp
      );

      if (relevantWorkers.length === 0) continue;

      // Calculate averages
      const avgTemp =
        relevantWorkers.reduce((sum, w) => sum + w.readings.temperature, 0) /
        relevantWorkers.length;
      const avgOxy =
        relevantWorkers.reduce((sum, w) => sum + w.readings.oxygenLevel, 0) /
        relevantWorkers.length;
      const avgHR =
        relevantWorkers.reduce((sum, w) => sum + w.readings.heartRate, 0) /
        relevantWorkers.length;

      data.labels.push(new Date(timestamp).toLocaleTimeString());
      data.temperatures.push(Number(avgTemp.toFixed(1)));
      data.oxygenLevels.push(Number(avgOxy.toFixed(1)));
      data.heartRates.push(Math.round(avgHR));
      data.activeWorkers.push(relevantWorkers.length);
    }

    return data;
  }, [workers, timeRange]);

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const chartData = {
    labels: hourlyData.labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: hourlyData.temperatures,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Oxygen Level (%)",
        data: hourlyData.oxygenLevels,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
      {
        label: "Heart Rate (BPM)",
        data: hourlyData.heartRates,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Active Workers",
        data: hourlyData.activeWorkers,
        borderColor: "rgb(153, 102, 255)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="analytics">
      <h2>Safety Metrics Over Time</h2>
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
