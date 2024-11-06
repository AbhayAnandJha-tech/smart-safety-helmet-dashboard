export const SENSOR_TYPES = {
  GPS: {
    id: "GPS_SENSOR",
    updateInterval: 5000, // 5 seconds
    thresholds: {
      geofence: {
        radius: 100, // meters
        checkInterval: 10000, // 10 seconds
      },
    },
  },
  TEMPERATURE: {
    id: "TEMP_SENSOR",
    updateInterval: 2000, // 2 seconds
    thresholds: {
      critical: { min: 10, max: 35 }, // °C
      warning: { min: 15, max: 30 },
    },
  },
  HEAT: {
    id: "HEAT_SENSOR",
    updateInterval: 2000,
    thresholds: {
      critical: { max: 50 }, // °C
      warning: { max: 40 },
    },
  },
  GAS: {
    id: "GAS_SENSOR",
    updateInterval: 1000,
    thresholds: {
      critical: { max: 100 }, // ppm
      warning: { max: 50 },
    },
  },
  OXYGEN: {
    id: "O2_SENSOR",
    updateInterval: 2000,
    thresholds: {
      critical: { min: 19.5 }, // %
      warning: { min: 20.0 },
    },
  },
  MOTION: {
    id: "MOTION_SENSOR",
    updateInterval: 1000,
    thresholds: {
      noMotion: 300000, // 5 minutes without motion
    },
  },
};

export const ACTUATOR_TYPES = {
  BUZZER: {
    id: "BUZZER",
    patterns: {
      emergency: "LONG_CONTINUOUS",
      warning: "INTERMITTENT",
      alert: "SHORT_BURST",
    },
  },
  LED: {
    id: "LED",
    colors: {
      red: "EMERGENCY",
      yellow: "WARNING",
      green: "NORMAL",
    },
  },
  VIBRATION: {
    id: "VIBRATION_MOTOR",
    patterns: {
      emergency: "STRONG_CONTINUOUS",
      warning: "MEDIUM_BURST",
      notification: "GENTLE_PULSE",
    },
  },
};
