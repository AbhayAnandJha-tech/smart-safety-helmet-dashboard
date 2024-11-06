import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { WorkerSafetyData } from "../types";
import "leaflet/dist/leaflet.css";
import "../styles/SafetyMap.css";

interface SafetyMapProps {
  workers: WorkerSafetyData[];
  onWorkerSelect?: (workerId: string) => void;
}

export const SafetyMap: React.FC<SafetyMapProps> = ({
  workers,
  onWorkerSelect,
}) => {
  return (
    <div className="safety-map">
      <MapContainer
        center={[0, 0]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {workers.map((worker) => (
          <Marker
            key={worker.id}
            position={[worker.readings.location.x, worker.readings.location.y]}
          >
            <Popup>
              <div onClick={() => onWorkerSelect?.(worker.id)}>
                <h3>{worker.name}</h3>
                <p>Status: {worker.status}</p>
                <p>Temperature: {worker.readings.temperature}°C</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
