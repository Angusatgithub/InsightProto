import { ChartConfig } from "../types/chart.types";

export const CHART_CONFIG: ChartConfig = {
  dimensions: {
    width: 390,
    height: 380,
    marginTop: 0,
    marginRight: 10,
    marginBottom: 0,
    marginLeft: 10,
  },
  colors: {
    line: "#FF7A64",
    cursor: "#fff",
    grid: "#e5e7eb",
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
