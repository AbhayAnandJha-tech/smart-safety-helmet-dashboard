import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import "../styles/MiningLocationTracker.css";

interface Location {
  x: number;
  y: number;
  z: number;
  workerId: string;
  timestamp: number;
}

const MiningLocationTracker: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const locationsRef = ref(database, "locations");

    const unsubscribe = onValue(locationsRef, (snapshot) => {
      const locationData: Location[] = [];
      snapshot.forEach((child) => {
        locationData.push({
          ...child.val(),
          workerId: child.key as string,
        });
      });
      setLocations(locationData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading location data...</div>;
  }

  return (
    <div className="location-tracker">
      <h2>Worker Locations</h2>
      <div className="location-grid">
        {locations.map((location) => (
          <div key={location.workerId} className="location-card">
            <h3>Worker {location.workerId}</h3>
            <div className="coordinates">
              <div>X: {location.x.toFixed(2)}m</div>
              <div>Y: {location.y.toFixed(2)}m</div>
              <div>Z: {location.z.toFixed(2)}m</div>
            </div>
            <div className="timestamp">
              Last updated: {new Date(location.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiningLocationTracker;
