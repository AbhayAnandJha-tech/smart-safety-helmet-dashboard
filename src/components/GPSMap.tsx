import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase.tsx";

export default function GPSMap() {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

  useEffect(() => {
    const gpsRef = ref(db, "status/gps");
    const unsubscribe = onValue(gpsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.lat && data.lng) {
        setPosition([data.lat, data.lng]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        GPS Location
      </Typography>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "200px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>Helmet location</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
