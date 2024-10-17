import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase.tsx";

export default function BuzzerAlerts() {
  const [buzzerStatus, setBuzzerStatus] = useState({ level: 0, active: false });

  useEffect(() => {
    const buzzerRef = ref(db, "status/buzzer");
    const unsubscribe = onValue(
      buzzerRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setBuzzerStatus(data);
        }
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Buzzer Alerts
      </Typography>
      <Box display="flex" justifyContent="space-around">
        <CircularProgress
          variant="determinate"
          value={buzzerStatus.level}
          color={buzzerStatus.active ? "error" : "primary"}
          size={60}
        />
        <Typography
          variant="h6"
          color={buzzerStatus.active ? "error" : "textPrimary"}
        >
          {buzzerStatus.active ? "Active" : "Inactive"}
        </Typography>
      </Box>
    </Box>
  );
}
