import { DashPathEffect, Group, Line, Text as SkiaText, matchFont } from "@shopify/react-native-skia";
import React from "react";
import { Platform } from "react-native";
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

  const littleFont = matchFont({
    fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }),
    fontSize: 11,
  });

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

  // Calculate x positions for vertical sections
  const verticalLines = [];
  const sections = 3;
  for (let i = 0; i < sections; i++) {
    const x = (chartLeft + 64) + ((chartWidth - 32) / sections) * i;
    verticalLines.push(x);
  }

  const topString = yTop.toString();
  const midString = yMid.toString();
  const botString = yBottom.toString();

  return (
    <Group
    color={config.colors.grid}
    style="stroke"
    strokeWidth={1}
    opacity={0.3}
    >
      {/* label in-line with each horizontal line */}
      <SkiaText
        x={chartRight - 24}
        y={yTop + 2}
        text={"fix this"}
        color={config.colors.grid}
        font={littleFont}
        style="fill"
      />
      <SkiaText
        x={chartRight - 24}
        y={yMiddle + 2}
        text={midString}
        color={config.colors.grid}
        font={littleFont}
        style="fill"
      />
      <SkiaText
        x={chartRight - 24}
        y={yBottom + 2}
        text={"fix this"}
        color={config.colors.grid}
        font={littleFont}
        style="fill"
      />
      
      <DashPathEffect intervals={[2, 10]} phase={0} />


      {/* Horizontal grid lines */}
      <Line
        p1={{ x: chartLeft, y: yTop }}
        p2={{ x: chartRight - 28, y: yTop }}
      />
      <Line
        p1={{ x: chartLeft, y: yMiddle }}
        p2={{ x: chartRight - 28, y: yMiddle }}
      />
      <Line
        p1={{ x: chartLeft, y: yBottom }}
        p2={{ x: chartRight - 28, y: yBottom }}
      />

      {/* Vertical grid lines*/}
      {verticalLines.map((x, index) => (
        <Line
          key={`vertical-${index}`}
          p1={{ x, y: chartTop }}
          p2={{ x, y: chartBottom }}
        />
      ))}
    </Group>
  );
};