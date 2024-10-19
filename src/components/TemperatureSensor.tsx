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
import { db } from "../firebase.tsx";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const generateRandomTemperature = () => {
  return Math.round((Math.random() * 10 + 20) * 10) / 10; // Random temperature between 20°C and 30°C
};

const generateTimeString = () => {
  const now = new Date();
  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function TemperatureSensor() {
  const [temperatureData, setTemperatureData] = useState([
    { time: "12:00:00", temp: 24.5 },
    { time: "12:01:00", temp: 25.2 },
    { time: "12:02:00", temp: 25.7 },
    { time: "12:03:00", temp: 26.1 },
    { time: "12:04:00", temp: 25.8 },
    { time: "12:05:00", temp: 25.3 },
  ]);

  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Firebase is configured
    if (db) {
      setIsFirebaseConfigured(true);
    }
  }, []);

  useEffect(() => {
    let unsubscribe;

    if (isFirebaseConfigured) {
      // Firebase logic
      const tempCollection = collection(db, "temperatures");
      const q = query(tempCollection, orderBy("timestamp", "desc"), limit(6));

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const temperatures = querySnapshot.docs
          .map((doc) => ({
            time: new Date(doc.data().timestamp.toDate()).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit", second: "2-digit" }
            ),
            temp: doc.data().temperature,
          }))
          .reverse();
        setTemperatureData(temperatures);
      });
    } else {
      // Fallback to hardcoded data updates
      const interval = setInterval(() => {
        setTemperatureData((prevData) => {
          const newData = [
            ...prevData.slice(1),
            { time: generateTimeString(), temp: generateRandomTemperature() },
          ];
          return newData;
        });
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isFirebaseConfigured]);

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
        Temperature Sensor{" "}
        {isFirebaseConfigured ? "(Live Data)" : "(Simulated Data)"}
      </Typography>
      <Line options={options} data={data} />
    </Box>
  );
}
