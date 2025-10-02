import * as d3 from "d3";
import { useMemo } from "react";
import {
  BalanceDataPoint,
  ChartDimensions,
  ChartScales,
} from "../types/chart.types";

export const useChartScale = (
  data: BalanceDataPoint[],
  dimensions: ChartDimensions
): ChartScales => {
  const xScale = useMemo(() => {
    const dates = data.map((d) => d.date);
    const [minDate, maxDate] = d3.extent(dates) as [Date, Date];

    return d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([
        dimensions.marginLeft,
        dimensions.width - dimensions.marginRight,
      ]);
  }, [data, dimensions]);

  const yScale = useMemo(() => {
    const balances = data.map((d) => d.balance);
    const maxBalance = d3.max(balances) || 0;
    const minBalance = d3.min(balances) || 0;

    // Add padding to y-axis (10% above and below)
    const padding = (maxBalance - minBalance) * 0.1;

    return d3
      .scaleLinear()
      .domain([minBalance - padding, maxBalance + padding])
      .range([
        dimensions.height - dimensions.marginBottom,
        dimensions.marginTop,
      ])
      .nice(); // Round to nice numbers
  }, [data, dimensions]);

  return { x: xScale, y: yScale };
};
