import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase.tsx";
import { Thermometer } from "lucide-react";

export default function LiveStatus() {
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    const temperatureRef = ref(db, "status/temperature");
    const unsubscribe = onValue(temperatureRef, (snapshot) => {
      const data = snapshot.val();
      setTemperature(data);
    });

    return () => unsubscribe();
  }, []);

  const getTemperatureColor = (temp: number) => {
    if (temp < 25) return "#4caf50";
    if (temp < 30) return "#ffeb3b";
    return "#f44336";
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Live Temperature
      </Typography>
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <Thermometer size={48} color={getTemperatureColor(temperature)} />
        <Typography variant="h3" component="div">
          {temperature.toFixed(1)}°C
        </Typography>
        <CircularProgress
          variant="determinate"
          value={(temperature / 50) * 100}
          color="primary"
          size={80}
          sx={{
            color: getTemperatureColor(temperature),
            transition: "color 0.5s ease",
          }}
        />
      </Box>
    </Box>
  );
}
