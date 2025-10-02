import * as d3 from "d3";
import { BalanceDataPoint, ChartDimensions } from "../types/chart.types";

export const findClosestDataPoint = (
  touchX: number,
  data: BalanceDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  dimensions: ChartDimensions
): BalanceDataPoint | null => {
  if (data.length === 0) return null;

  // Clamp touchX to chart bounds
  const clampedX = Math.max(
    dimensions.marginLeft,
    Math.min(touchX, dimensions.width - dimensions.marginRight)
  );

  // Convert touch X to date domain
  const xDate = xScale.invert(clampedX);

  // Find closest data point by comparing dates
  let closest = data[0];
  let minDistance = Math.abs(xDate.getTime() - closest.date.getTime());

  for (const point of data) {
    const distance = Math.abs(xDate.getTime() - point.date.getTime());
    if (distance < minDistance) {
      minDistance = distance;
      closest = point;
    }
  }

  return closest;
};

export const createLinePath = (
  data: BalanceDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
): string => {
  const lineGenerator = d3
    .line<BalanceDataPoint>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.balance))
    .curve(d3.curveMonotoneX); // Smooth curve

  return lineGenerator(data) || "";
};

export const clampValue = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};
