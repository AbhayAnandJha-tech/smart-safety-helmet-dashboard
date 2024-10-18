import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
} from "@mui/material";
import { AlertCircle, Clock } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase.tsx";
import "../styles/AlertHistory.css";

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
        setAlerts(alertList.slice(-5).reverse()); // Keep only the last 5 alerts, reversed for newest first
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Paper elevation={3} className="alert-history-container">
      <Box className="alert-history-header">
        <AlertCircle size={24} color="#f5a623" />
        <Typography variant="h5" component="h2">
          Alert History
        </Typography>
      </Box>
      <List className="alert-list">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <ListItem key={alert.id} className="alert-item">
              <ListItemText
                primary={alert.message}
                secondary={
                  <Box component="span" className="alert-timestamp">
                    <Clock size={16} />
                    {alert.timestamp}
                  </Box>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No recent alerts" />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}
