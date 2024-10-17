import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase.tsx";

export default function AlertHistory() {
  const [alerts, setAlerts] = useState<
    { id: string; message: string; timestamp: string }[]
  >([]);

  useEffect(() => {
    const alertsRef = ref(db, "alerts");
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alertList = Object.entries(data).map(
          ([id, alert]: [string, any]) => ({
            id,
            message: alert.message,
            timestamp: alert.timestamp,
          })
        );
        setAlerts(alertList.slice(-5)); // Keep only the last 5 alerts
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Alert History
      </Typography>
      <List>
        {alerts.map((alert) => (
          <ListItem key={alert.id}>
            <ListItemText primary={alert.message} secondary={alert.timestamp} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
