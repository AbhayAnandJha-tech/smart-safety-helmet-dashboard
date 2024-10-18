import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress, Paper } from "@mui/material";
import { Bell } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase.tsx";
import "../styles/BuzzerAlerts.css";

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
    <Paper elevation={3} className="buzzer-alerts-container">
      <Box className="buzzer-alerts-header">
        <Bell size={24} color="#f5a623" />
        <Typography variant="h5" component="h2">
          Buzzer Alerts
        </Typography>
      </Box>
      <Box className="buzzer-status">
        <CircularProgress
          variant="determinate"
          value={buzzerStatus.level}
          color={buzzerStatus.active ? "error" : "primary"}
          size={80}
          thickness={5}
          className="buzzer-progress"
        />
        <Box className="buzzer-info">
          <Typography
            variant="h4"
            className={buzzerStatus.active ? "active" : "inactive"}
          >
            {buzzerStatus.active ? "ACTIVE" : "INACTIVE"}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Level: {buzzerStatus.level}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
