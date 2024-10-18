import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import "leaflet/dist/leaflet.css";
import "./GPSMap.css";

const mineIcon = new Icon({
  iconUrl: "/mine-icon.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function GPSMap() {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gpsRef = ref(db, "status/gps");
    const unsubscribe = onValue(gpsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.lat && data.lng) {
        setPosition([data.lat, data.lng]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="gps-map-container">
      <div className="gps-map-header">
        <svg className="map-icon" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <h2>Real-Time Mining Location</h2>
      </div>
      <div className="map-wrapper">
        {loading ? (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading map data...</p>
          </div>
        ) : (
          <MapContainer center={position} zoom={13} className="leaflet-map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={mineIcon}>
              <Popup>Active mining site</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
      <div className="coordinates">
        <p>Latitude: {position[0].toFixed(6)}</p>
        <p>Longitude: {position[1].toFixed(6)}</p>
      </div>
      <div className="map-footer">
        <p>Tracking active mining operations in real-time</p>
        <button className="update-button">Refresh Location</button>
      </div>
    </div>
  );
}
