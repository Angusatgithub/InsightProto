import { DashPathEffect, Group, Line, Text as SkiaText, matchFont } from "@shopify/react-native-skia";
import React from "react";
import { Platform } from "react-native";
import {
  ChartConfig,
  ChartDimensions,
  ChartScales,
} from "../../types/chart.types";
import { formatCurrencyCompact, formatMonth } from "../../utils/formatters";

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

  // Get y-axis domain for horizontal lines
  const yDomain = scales.y.domain();
  const yMin = yDomain[0];
  const yMax = yDomain[1];
  const yMid = (yMin + yMax) / 2;

  // Calculate y positions for horizontal lines (top, middle, bottom)
  const yTop = scales.y(yMax);
  const yMiddle = scales.y(yMid);
  const yBottom = scales.y(yMin);

  // Get x-axis domain dates for month labels
  const xDomain = scales.x.domain();
  const startDate = xDomain[0];
  const endDate = xDomain[1];
  
  // Generate month labels (quarterly - every 3 months for balanced spacing)
  const monthLabels: { date: Date; x: number; label: string }[] = [];
  const currentDate = new Date(startDate);
  
  // Offset by 1 month to center the grid lines (avoids lines on far edges)
  currentDate.setMonth(currentDate.getMonth() + 1);
  
  while (currentDate < endDate) {
    const x = scales.x(currentDate);
    const label = formatMonth(currentDate);
    monthLabels.push({ date: new Date(currentDate), x, label });
    
    // Move to next quarter (every 3 months)
    currentDate.setMonth(currentDate.getMonth() + 3);
  }

  // Format balance values for labels (from domain, not pixel positions)
  // Use compact format for grid labels (e.g., $3.2k instead of $3,200)
  const topString = formatCurrencyCompact(yMax);
  const midString = formatCurrencyCompact(yMid);
  const botString = formatCurrencyCompact(yMin);

  // Measure label widths to position them and grid lines dynamically
  const topWidth = littleFont.getTextWidth(topString);
  const midWidth = littleFont.getTextWidth(midString);
  const botWidth = littleFont.getTextWidth(botString);
  const maxLabelWidth = Math.max(topWidth, midWidth, botWidth);
  
  // Add padding between grid lines and labels
  const labelPadding = 4;
  const gridLineEnd = chartRight - maxLabelWidth - labelPadding;

  return (
    <Group
    color={config.colors.grid}
    style="stroke"
    strokeWidth={1}
    >
      {/* label in-line with each horizontal line - right-aligned */}
      <SkiaText
        x={chartRight - topWidth}
        y={yTop + 2}
        text={topString}
        color={config.colors.grid}
        font={littleFont}
        style="fill"
      />
      <SkiaText
        x={chartRight - midWidth}
        y={yMiddle + 2}
        text={midString}
        color={config.colors.grid}
        font={littleFont}
        style="fill"
      />
      <SkiaText
        x={chartRight - botWidth}
        y={yBottom + 2}
        text={botString}
        color={config.colors.grid}
        font={littleFont}
        style="fill"
      />
      
      <DashPathEffect intervals={[3, 12]} phase={2} />


      {/* Horizontal grid lines */}
      <Line
        p1={{ x: chartLeft, y: yTop }}
        p2={{ x: gridLineEnd, y: yTop }}
      />
      <Line
        p1={{ x: chartLeft, y: yMiddle }}
        p2={{ x: gridLineEnd, y: yMiddle }}
      />
      <Line
        p1={{ x: chartLeft, y: yBottom }}
        p2={{ x: gridLineEnd, y: yBottom }}
      />

      {/* Vertical grid lines aligned to month labels */}
      {monthLabels.map((month, index) => (
        <Line
          key={`vertical-${index}`}
          p1={{ x: month.x, y: chartTop }}
          p2={{ x: month.x, y: chartBottom }}
        />
      ))}

      {/* Month labels at bottom */}
      {monthLabels.map((month, index) => {
        const labelWidth = littleFont.getTextWidth(month.label);
        return (
          <SkiaText
            key={`month-${index}`}
            x={month.x - labelWidth / 2}
            y={chartBottom + 24}
            text={month.label}
            color={config.colors.grid}
            font={littleFont}
            style="fill"
          />
        );
      })}
    </Group>
  );
};