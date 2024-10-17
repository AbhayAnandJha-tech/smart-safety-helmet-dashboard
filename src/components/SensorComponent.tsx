import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { listenForSensorData, sendControlCommand } from "../firebase.tsx"; // Adjust path as needed

interface SensorData {
  temperature: number;
  humidity: number;
}

const SensorComponent: React.FC<{ sensorId: string }> = ({ sensorId }) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenForSensorData(
      sensorId,
      (data: SensorData | null) => {
        if (data) {
          setSensorData(data);
        } else {
          setSensorData(null); // Ensure state resets if data is null
        }
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [sensorId]);

  const handleControlCommand = () => {
    sendControlCommand(sensorId, "TOGGLE_LED");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Sensor {sensorId}
        </Typography>
        {sensorData ? (
          <>
            <Typography color="text.secondary" gutterBottom>
              Temperature: {sensorData.temperature.toFixed(2)}°C
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Humidity: {sensorData.humidity.toFixed(2)}%
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">No data available</Typography>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleControlCommand}
          >
            Toggle LED
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SensorComponent;
