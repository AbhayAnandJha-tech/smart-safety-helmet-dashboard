import React from "react";
import { User, HardHat, Heart, Thermometer, MapPin } from "lucide-react";
import "../styles/WorkerProfiles.css";

const workers = [
  {
    id: 1,
    name: "John Doe",
    role: "Miner",
    heartRate: 72,
    temperature: 36.6,
    location: "Shaft A",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Engineer",
    heartRate: 68,
    temperature: 36.8,
    location: "Shaft B",
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Technician",
    heartRate: 75,
    temperature: 36.7,
    location: "Shaft C",
  },
  {
    id: 4,
    name: "Emily Brown",
    role: "Safety Officer",
    heartRate: 70,
    temperature: 36.5,
    location: "Control Room",
  },
];

const WorkerProfiles: React.FC = () => {
  return (
    <div className="worker-profiles">
      <h1 className="page-title">Worker Profiles</h1>
      <div className="worker-grid">
        {workers.map((worker) => (
          <div key={worker.id} className="worker-card">
            <div className="worker-avatar">
              <User size={48} />
            </div>
            <h2 className="worker-name">{worker.name}</h2>
            <p className="worker-role">{worker.role}</p>
            <div className="worker-stats">
              <div className="stat">
                <Heart size={16} />
                <span>{worker.heartRate} bpm</span>
              </div>
              <div className="stat">
                <Thermometer size={16} />
                <span>{worker.temperature}°C</span>
              </div>
              <div className="stat">
                <MapPin size={16} />
                <span>{worker.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerProfiles;
