import { Circle, Line } from "@shopify/react-native-skia";
import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { ChartConfig, ChartDimensions } from "../../types/chart.types";

interface ChartCursorProps {
  x: SharedValue<number>;
  y: SharedValue<number>;
  isActive: SharedValue<number>;
  config: ChartConfig;
  dimensions: ChartDimensions;
}

export const ChartCursor: React.FC<ChartCursorProps> = ({
  x,
  y,
  isActive,
  config,
  dimensions,
}) => {
  const p1 = useDerivedValue(() => ({
    x: x.value,
    y: dimensions.marginTop,
  }));

  const p2 = useDerivedValue(() => ({
    x: x.value,
    y: dimensions.height - dimensions.marginBottom,
  }));

  return (
    <>
      {/* Vertical line */}
      <Line
        p1={p1}
        p2={p2}
        color={config.colors.cursor}
        style="stroke"
        strokeWidth={1}
        opacity={isActive}
      />

      {/* Cursor circle */}
      <Circle
        cx={x}
        cy={y}
        r={config.cursor.radius}
        color={config.colors.cursor}
        opacity={isActive}
      />

      {/* Outer circle ring */}
      <Circle
        cx={x}
        cy={y}
        r={config.cursor.radius + 2}
        color={config.colors.cursor}
        style="stroke"
        strokeWidth={config.cursor.strokeWidth}
        opacity={isActive}
      />
    </>
  );
};
