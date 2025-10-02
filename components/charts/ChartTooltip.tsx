import {
  Group,
  RoundedRect,
  Text as SkiaText,
  matchFont,
} from "@shopify/react-native-skia";
import React from "react";
import { Platform } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { ChartConfig, ChartDimensions } from "../../types/chart.types";

interface ChartTooltipProps {
  x: SharedValue<number>;
  y: SharedValue<number>;
  isActive: SharedValue<number>;
  value: string;
  label: string;
  config: ChartConfig;
  dimensions: ChartDimensions;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  x,
  y,
  isActive,
  value,
  label,
  config,
  dimensions,
}) => {
  // Create fonts for text rendering
  const boldFont = matchFont({
    fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }),
    fontSize: 14,
    fontWeight: "bold",
  });

  const regularFont = matchFont({
    fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }),
    fontSize: 11,
  });

  // Measure approximate text width
  const valueWidth = value.length * 8;
  const labelWidth = label.length * 6;
  const tooltipWidth =
    Math.max(valueWidth, labelWidth) + config.tooltip.padding * 2;
  const tooltipHeight = 50;

  // Calculate tooltip position (shift left if too close to right edge)
  const tooltipX = useDerivedValue(() => {
    const defaultX = x.value + config.tooltip.offsetX;
    const maxX = dimensions.width - dimensions.marginRight - tooltipWidth;
    return Math.min(defaultX, maxX);
  });

  const tooltipY = useDerivedValue(() => {
    return y.value + config.tooltip.offsetY;
  });

  return (
    <Group opacity={isActive}>
      {/* Background */}
      <RoundedRect
        x={tooltipX}
        y={tooltipY}
        width={tooltipWidth}
        height={tooltipHeight}
        r={config.tooltip.borderRadius}
        color={config.colors.tooltipBackground}
      />

      {/* Value text */}
      <SkiaText
        x={useDerivedValue(() => tooltipX.value + config.tooltip.padding)}
        y={useDerivedValue(() => tooltipY.value + 20)}
        text={value}
        color={config.colors.tooltipText}
        font={boldFont}
      />

      {/* Label text */}
      <SkiaText
        x={useDerivedValue(() => tooltipX.value + config.tooltip.padding)}
        y={useDerivedValue(() => tooltipY.value + 38)}
        text={label}
        color={config.colors.tooltipText}
        font={regularFont}
      />
    </Group>
  );
};
