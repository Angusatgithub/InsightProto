import { ChartConfig } from "../types/chart.types";

export const CHART_CONFIG: ChartConfig = {
  dimensions: {
    width: 360,
    height: 360,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 30,
    marginLeft: 10,
  },
  colors: {
    line: "#FF7A64",
    cursor: "#fff",
    grid: "#4A4A53",
    text: "#374151",
    tooltipBackground: "#1f2937",
    tooltipText: "#ffffff",
  },
  cursor: {
    radius: 3,
    strokeWidth: 2,
  },
  line: {
    strokeWidth: 2,
  },
  tooltip: {
    padding: 8,
    borderRadius: 6,
    offsetX: 10,
    offsetY: -30,
  },
};
