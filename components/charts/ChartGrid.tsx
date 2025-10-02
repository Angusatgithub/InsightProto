import { Group, Line } from "@shopify/react-native-skia";
import React from "react";
import {
  ChartConfig,
  ChartDimensions,
  ChartScales,
} from "../../types/chart.types";

interface ChartGridProps {
  scales: ChartScales;
  config: ChartConfig;
  dimensions: ChartDimensions;
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  scales,
  config,
  dimensions,
}) => {
  const chartLeft = dimensions.marginLeft;
  const chartRight = dimensions.width - dimensions.marginRight;
  const chartTop = dimensions.marginTop;
  const chartBottom = dimensions.height - dimensions.marginBottom;
  const chartWidth = chartRight - chartLeft;

  // Get y-axis domain for horizontal lines
  const yDomain = scales.y.domain();
  const yMin = yDomain[0];
  const yMax = yDomain[1];
  const yMid = (yMin + yMax) / 2;

  // Calculate y positions for horizontal lines (top, middle, bottom)
  const yTop = scales.y(yMax);
  const yMiddle = scales.y(yMid);
  const yBottom = scales.y(yMin);

  // Calculate x positions for 6 vertical sections (7 lines total including start and end)
  const verticalLines = [];
  const sections = 6;
  for (let i = 0; i <= sections; i++) {
    const x = chartLeft + (chartWidth / sections) * i;
    verticalLines.push(x);
  }

  return (
    <Group>
      {/* Horizontal grid lines */}
      <Line
        p1={{ x: chartLeft, y: yTop }}
        p2={{ x: chartRight, y: yTop }}
        color={config.colors.grid}
        style="stroke"
        strokeWidth={0.5}
        opacity={0.2}
        //strokeDash={[4, 4]}
      />
      <Line
        p1={{ x: chartLeft, y: yMiddle }}
        p2={{ x: chartRight, y: yMiddle }}
        color={config.colors.grid}
        style="stroke"
        strokeWidth={0.5}
        opacity={0.2}
        //strokeDash={[4, 4]}
      />
      <Line
        p1={{ x: chartLeft, y: yBottom }}
        p2={{ x: chartRight, y: yBottom }}
        color={config.colors.grid}
        style="stroke"
        strokeWidth={0.5}
        opacity={0.2}
        //strokeDash={[4, 4]}
      />

      {/* Vertical grid lines*/}
      {verticalLines.map((x, index) => (
        <Line
          key={`vertical-${index}`}
          p1={{ x, y: chartTop }}
          p2={{ x, y: chartBottom }}
          color={config.colors.grid}
          style="stroke"
          strokeWidth={0.5}
          opacity={0.2}
          //strokeDash={[4, 4]}
        />
      ))}
    </Group>
  );
};
