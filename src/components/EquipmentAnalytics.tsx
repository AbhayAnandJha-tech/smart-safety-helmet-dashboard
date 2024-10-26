import React from "react";
import { Battery, Cpu, AlertTriangle } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import "../styles/EquipmentAnalytics.css";

const equipmentData = [
  {
    id: 1,
    name: "Drill A",
    batteryLevel: 85,
    status: "Operational",
    maintenanceDue: "2024-05-15",
  },
  {
    id: 2,
    name: "Conveyor B",
    batteryLevel: 72,
    status: "Maintenance Required",
    maintenanceDue: "2024-03-20",
  },
  {
    id: 3,
    name: "Ventilator C",
    batteryLevel: 95,
    status: "Operational",
    maintenanceDue: "2024-06-30",
  },
  {
    id: 4,
    name: "Excavator D",
    batteryLevel: 60,
    status: "Low Battery",
    maintenanceDue: "2024-04-10",
  },
];

const EquipmentAnalytics: React.FC = () => {
  return (
    <div className="equipment-analytics">
      <h1 className="page-title">Equipment Analytics</h1>
      <div className="equipment-grid">
        {equipmentData.map((equipment) => (
          <div key={equipment.id} className="equipment-card">
            <h2 className="equipment-name">{equipment.name}</h2>
            <div className="equipment-status">
              <Cpu size={24} />
              <span
                className={`status-indicator ${
                  equipment.status === "Operational"
                    ? "operational"
                    : "maintenance"
                }`}
              >
                {equipment.status}
              </span>
            </div>
            <div className="battery-level">
              <Battery size={24} />
              <div className="battery-bar">
                <div
                  className="battery-fill"
                  style={{ width: `${equipment.batteryLevel}%` }}
                ></div>
              </div>
              <span>{equipment.batteryLevel}%</span>
            </div>
            <p className="maintenance-due">
              <AlertTriangle size={16} />
              Next maintenance: {equipment.maintenanceDue}
            </p>
          </div>
        ))}
      </div>
      <div className="equipment-usage-chart">
        <h2>Equipment Usage Overview</h2>
        <Player
          autoplay
          loop
          src="https://assets2.lottiefiles.com/private_files/lf30_F6EtR7.json"
          style={{ height: "300px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default EquipmentAnalytics;
