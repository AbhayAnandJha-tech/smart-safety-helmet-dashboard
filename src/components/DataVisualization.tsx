import React from "react";
import { Line } from "react-chartjs-2";
import { useDataVisualization } from "../hooks/useDataVisualization";
import { WorkerSafetyData } from "../types";
import "../styles/DataVisualization.css";

interface DataVisualizationProps {
  workerData: Record<string, WorkerSafetyData>;
  selectedWorkerId?: string;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  workerData,
  selectedWorkerId,
}) => {
  const { chartData, getWorkerTrends } = useDataVisualization(workerData);

  const renderWorkerChart = (workerId: string) => {
    const trends = getWorkerTrends(workerId);
    if (!trends) return null;

    const options = {
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
        title: {
          display: true,
          text: `Worker ${workerId} Metrics`,
        },
      },
    };

    return (
      <div className="worker-chart">
        <Line data={chartData[workerId]} options={options} />
        <div className="trends-summary">
          <h4>Trends</h4>
          <div className="trend-grid">
            {Object.entries(trends).map(([metric, direction]) => (
              <div key={metric} className={`trend-item ${direction}`}>
                <span className="metric-name">{metric}</span>
                <span className="trend-arrow">
                  {direction === "up" ? "↑" : direction === "down" ? "↓" : "→"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-visualization">
      {selectedWorkerId ? (
        renderWorkerChart(selectedWorkerId)
      ) : (
        <div className="all-workers-charts">
          {Object.keys(workerData).map((workerId) => (
            <div key={workerId} className="chart-container">
              {renderWorkerChart(workerId)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
