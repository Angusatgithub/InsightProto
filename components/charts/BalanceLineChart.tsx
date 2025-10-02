import { Canvas, Path } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { useChartGesture } from "../../hooks/useChartGesture";
import { useChartScale } from "../../hooks/useChartScale";
import { BalanceDataPoint, ChartConfig } from "../../types/chart.types";
import { createLinePath } from "../../utils/chartHelpers";
import { formatCurrency, formatDateLong } from "../../utils/formatters";
import { ChartCursor } from "./ChartCursor";
import { ChartGrid } from "./ChartGrid";
import { ChartTooltip } from "./ChartTooltip";

interface BalanceLineChartProps {
  data: BalanceDataPoint[];
  config: ChartConfig;
}

export const BalanceLineChart: React.FC<BalanceLineChartProps> = ({
  data,
  config,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<BalanceDataPoint | null>(
    null
  );

  const scales = useChartScale(data, config.dimensions);
  const linePath = createLinePath(data, scales.x, scales.y);

  const { gesture, touchX, touchY, isActive } = useChartGesture(
    data,
    scales,
    config.dimensions,
    setSelectedPoint
  );

  const tooltipValue = selectedPoint
    ? formatCurrency(selectedPoint.balance)
    : "";
  const tooltipLabel = selectedPoint ? formatDateLong(selectedPoint.date) : "";

  return (
    <GestureDetector gesture={gesture}>
      <Canvas
        style={[
          styles.canvas,
          {
            width: config.dimensions.width,
            height: config.dimensions.height,
          },
        ]}
      >
        {/* Grid (rendered first, behind everything) */}
        <ChartGrid
          scales={scales}
          config={config}
          dimensions={config.dimensions}
        />

        {/* Line path */}
        <Path
          path={linePath}
          color={config.colors.line}
          style="stroke"
          strokeWidth={config.line.strokeWidth}
          strokeJoin="round"
          strokeCap="round"
        />

        {/* Cursor and tooltip */}
        <ChartCursor
          x={touchX}
          y={touchY}
          isActive={isActive}
          config={config}
          dimensions={config.dimensions}
        />

        <ChartTooltip
          x={touchX}
          y={touchY}
          isActive={isActive}
          value={tooltipValue}
          label={tooltipLabel}
          config={config}
          dimensions={config.dimensions}
        />
      </Canvas>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: "transparent",
  },
});
