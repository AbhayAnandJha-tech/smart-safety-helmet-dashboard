import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { Circle } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase.tsx";

export default function LEDAlerts() {
  const [ledStatus, setLedStatus] = useState({
    green: false,
    yellow: false,
    red: false,
  });

  useEffect(() => {
    const ledStatusRef = ref(db, "status/leds");
    const unsubscribe = onValue(ledStatusRef, (snapshot) => {
      const data = snapshot.val();
      setLedStatus(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        LED Alerts
      </Typography>
      <Box display="flex" justifyContent="space-around">
        <Circle
          size={60}
          fill={ledStatus.green ? "#4caf50" : "transparent"}
          color={ledStatus.green ? "#4caf50" : "#ccc"}
        />
        <Circle
          size={60}
          fill={ledStatus.yellow ? "#ffeb3b" : "transparent"}
          color={ledStatus.yellow ? "#ffeb3b" : "#ccc"}
        />
        <Circle
          size={60}
          fill={ledStatus.red ? "#f44336" : "transparent"}
          color={ledStatus.red ? "#f44336" : "#ccc"}
        />
      </Box>
    </Box>
  );
}
