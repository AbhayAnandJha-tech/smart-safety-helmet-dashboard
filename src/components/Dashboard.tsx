import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import { AlertCircle } from "lucide-react";
import SensorComponent from "./SensorComponent"; // Import the SensorComponent
import { listenForSensorData } from "../firebase.tsx"; // Adjust path as needed

const Dashboard = () => {
  const [temperature, setTemperature] = useState<number>(0);
  const [gasLevel, setGasLevel] = useState<number>(0);
  const [fireDetected, setFireDetected] = useState<boolean>(false);
  const [gpsLocation, setGpsLocation] = useState<string>("Unknown");
  const [buzzerStatus, setBuzzerStatus] = useState<boolean>(false);

  // Initialize ledStatus with default values
  const [ledStatus, setLedStatus] = useState<{ red: boolean; green: boolean }>({
    red: false,
    green: true,
  });

  useEffect(() => {
    const unsubscribeTemperature = listenForSensorData(
      "temperature",
      setTemperature
    );
    const unsubscribeGas = listenForSensorData("gas", setGasLevel);
    const unsubscribeFire = listenForSensorData("fire", setFireDetected);
    const unsubscribeGPS = listenForSensorData("gps", setGpsLocation);
    const unsubscribeBuzzer = listenForSensorData("buzzer", setBuzzerStatus);
    const unsubscribeLed = listenForSensorData("led", (data) => {
      // Ensure ledStatus is always an object
      setLedStatus(data || { red: false, green: true }); // Default values if data is null
    });

    // Cleanup function to unsubscribe
    return () => {
      unsubscribeTemperature();
      unsubscribeGas();
      unsubscribeFire();
      unsubscribeGPS();
      unsubscribeBuzzer();
      unsubscribeLed();
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: "background.default" }}>
      {/* Dashboard Header */}
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Mine Safety Monitoring Dashboard
      </Typography>

      {/* Dashboard Content */}
      <Grid container spacing={3}>
        {/* Temperature Sensor */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Temperature Sensor</Typography>
            <Typography
              variant="h4"
              color={temperature > 50 ? "error" : "primary"}
            >
              {temperature}°C
            </Typography>
            <div className="temperature-chart">
              {/* Real-time temperature chart can go here */}
            </div>
          </Paper>
        </Grid>

        {/* Gas Sensor */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Gas Level</Typography>
            <Typography
              variant="h4"
              color={gasLevel > 80 ? "error" : "primary"}
            >
              {gasLevel} ppm
            </Typography>
          </Paper>
        </Grid>

        {/* Fire Detection */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, display: "flex", alignItems: "center" }}
          >
            <AlertCircle size={24} color={fireDetected ? "red" : "green"} />
            <Typography variant="h6" ml={1}>
              Fire Detection: {fireDetected ? "Detected" : "Safe"}
            </Typography>
          </Paper>
        </Grid>

        {/* GPS Module */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Current GPS Location</Typography>
            <Typography variant="h4">{gpsLocation}</Typography>
            <div className="map">{/* Integrate GPS map here */}</div>
          </Paper>
        </Grid>

        {/* Buzzer & LED Control */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Alerts & Buzzer</Typography>
            <Button
              variant="contained"
              color={buzzerStatus ? "error" : "primary"}
              onClick={() => setBuzzerStatus(!buzzerStatus)}
            >
              {buzzerStatus ? "Deactivate Buzzer" : "Activate Buzzer"}
            </Button>
            <div>
              {/* Null check before accessing ledStatus properties */}
              <Typography
                variant="h6"
                color={ledStatus.red ? "error" : "primary"}
              >
                Red LED: {ledStatus.red ? "On" : "Off"}
              </Typography>
              <Typography
                variant="h6"
                color={ledStatus.green ? "success" : "primary"}
              >
                Green LED: {ledStatus.green ? "On" : "Off"}
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
