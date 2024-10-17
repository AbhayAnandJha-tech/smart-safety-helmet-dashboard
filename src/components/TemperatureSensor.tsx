import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase.tsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TemperatureSensor() {
  const [temperatureData, setTemperatureData] = useState<
    { time: string; temp: number }[]
  >([]);

  useEffect(() => {
    const temperatureRef = ref(db, "temperature");
    const unsubscribe = onValue(temperatureRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.entries(data).map(([time, temp]) => ({
          time,
          temp: typeof temp === "number" ? temp : 0,
        }));
        setTemperatureData(formattedData.slice(-6)); // Keep only the last 6 readings
      }
    });

    return () => unsubscribe();
  }, []);

  const data = {
    labels: temperatureData.map((d) => d.time),
    datasets: [
      {
        label: "Temperature",
        data: temperatureData.map((d) => d.temp),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Temperature Sensor",
      },
    },
    scales: {
      x: {
        type: "category" as const,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        type: "linear" as const,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Temperature Sensor
      </Typography>
      <Line options={options} data={data} />
    </Box>
  );
}
