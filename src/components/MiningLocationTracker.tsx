import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import "./MiningLocationTracker.css";

const MiningLocationTracker: React.FC = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gpsRef = ref(db, "status/gps");
    const unsubscribe = onValue(gpsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.lat && data.lng) {
        setPosition({ lat: data.lat, lng: data.lng });
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const calculatePositionStyle = () => {
    const x = ((position.lng + 180) / 360) * 100;
    const y = ((90 - position.lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="mining-location-tracker">
      <div className="tracker-header">
        <svg
          className="location-icon"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <h2>Real-Time Mining Location</h2>
      </div>
      <div className="tracker-content">
        {loading ? (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Locating mining operation...</p>
          </div>
        ) : (
          <>
            <div className="location-visualizer">
              <div className="world-map">
                <div className="continent north-america"></div>
                <div className="continent south-america"></div>
                <div className="continent europe"></div>
                <div className="continent africa"></div>
                <div className="continent asia"></div>
                <div className="continent australia"></div>
              </div>
              <div className="location-marker" style={calculatePositionStyle()}>
                <div className="marker-pulse"></div>
                <svg
                  className="marker-icon"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 18c-3.17-3.17-6-7.07-6-11 0-3.31 2.69-6 6-6s6 2.69 6 6c0 3.93-2.83 7.83-6 11z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
            </div>
            <div className="location-details">
              <div className="coordinate-box">
                <h3>Latitude</h3>
                <p>{position.lat.toFixed(6)}°</p>
              </div>
              <div className="coordinate-box">
                <h3>Longitude</h3>
                <p>{position.lng.toFixed(6)}°</p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="tracker-footer">
        <p>Tracking active mining operations globally</p>
        <button className="update-button" onClick={() => setLoading(true)}>
          Refresh Location
        </button>
      </div>
    </div>
  );
};

export default MiningLocationTracker;
