import { useEffect, useCallback, useRef } from "react";
import { Alert } from "../types";

interface AlertSoundConfig {
  critical: string;
  high: string;
  medium: string;
  low: string;
}

const DEFAULT_SOUNDS: AlertSoundConfig = {
  critical: "/sounds/critical-alert.mp3",
  high: "/sounds/high-alert.mp3",
  medium: "/sounds/medium-alert.mp3",
  low: "/sounds/low-alert.mp3",
};

export const useAlertSound = (
  alerts: Alert[],
  enabled: boolean = true,
  sounds: AlertSoundConfig = DEFAULT_SOUNDS
) => {
  const audioRefs = useRef<{
    [K in keyof AlertSoundConfig]?: HTMLAudioElement;
  }>({});
  const lastAlertId = useRef<string | null>(null);

  useEffect(() => {
    // Preload audio files
    Object.entries(sounds).forEach(([severity, url]) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      audioRefs.current[severity as keyof AlertSoundConfig] = audio;
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, [sounds]);

  const playSound = useCallback(
    (severity: Alert["severity"]) => {
      if (!enabled) return;

      const audio = audioRefs.current[severity];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.warn("Failed to play alert sound:", error);
        });
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled || alerts.length === 0) return;

    const latestAlert = alerts[0];
    if (latestAlert.id !== lastAlertId.current && !latestAlert.acknowledged) {
      playSound(latestAlert.severity);
      lastAlertId.current = latestAlert.id;
    }
  }, [alerts, enabled, playSound]);

  return {
    playSound,
  };
};
