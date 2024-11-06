import { useMemo } from "react";
import {
  ChartOptions,
  ScaleOptions,
  Scale,
  CoreScaleOptions,
  Tick,
} from "chart.js";

interface ChartConfigOptions {
  min?: number;
  max?: number;
  unit?: string;
  decimals?: number;
  gridColor?: string;
  tickColor?: string;
}

export const useChartConfig = (options: ChartConfigOptions = {}) => {
  const chartOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750,
        easing: "easeInOutQuart",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              return `${value.toFixed(options.decimals || 1)}${
                options.unit || ""
              }`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: options.gridColor || "rgba(255, 255, 255, 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: options.tickColor || "rgba(255, 255, 255, 0.5)",
            maxRotation: 0,
          },
        },
        y: {
          min: options.min,
          max: options.max,
          grid: {
            color: options.gridColor || "rgba(255, 255, 255, 0.1)",
            drawBorder: false,
          },
          ticks: {
            color: options.tickColor || "rgba(255, 255, 255, 0.5)",
            callback: function (
              this: Scale<CoreScaleOptions>,
              value: number | string
            ) {
              if (typeof value === "number") {
                return `${value}${options.unit || ""}`;
              }
              return value;
            },
          },
        },
      },
    }),
    [options]
  );

  return chartOptions;
};
