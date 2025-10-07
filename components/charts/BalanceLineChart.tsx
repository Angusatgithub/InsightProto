import { Canvas, Path } from "@shopify/react-native-skia";
import React, { useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { useChartGesture } from "../../hooks/useChartGesture";
import { useChartScale } from "../../hooks/useChartScale";
import { BalanceDataPoint, ChartConfig } from "../../types/chart.types";
import { createLinePath } from "../../utils/chartHelpers";
import { formatCurrency, formatDateLong } from "../../utils/formatters";
import { ChartCursor } from "./ChartCursor";
import { ChartGrid } from "./ChartGrid";
import { ChartHeader } from "./ChartHeader";

interface BalanceLineChartProps {
  data: BalanceDataPoint[];
  config: ChartConfig;
}

export const BalanceLineChart: React.FC<BalanceLineChartProps> = ({
  data,
  config,
}) => {
  // Get screen dimensions for responsive width
  const { width: screenWidth } = useWindowDimensions();
  
  // Create responsive dimensions based on screen width
  const responsiveDimensions = useMemo(() => ({
    ...config.dimensions,
    width: screenWidth - 20, // Full width minus small padding
  }), [screenWidth, config.dimensions]);

  // Default to last data point
  const lastPoint = data[data.length - 1];
  const [selectedPoint, setSelectedPoint] = useState<BalanceDataPoint | null>(
    null
  );

  const scales = useChartScale(data, responsiveDimensions);
  const linePath = createLinePath(data, scales.x, scales.y);

  const { gesture, touchX, touchY, isActive } = useChartGesture(
    data,
    scales,
    responsiveDimensions,
    setSelectedPoint
  );

  // Use selected point if active, otherwise show last point
  const displayPoint = selectedPoint || lastPoint;
  const displayValue = formatCurrency(displayPoint.balance);
  const displayLabel = selectedPoint ? formatDateLong(selectedPoint.date) : "Total saved";

  return (
    <View style={styles.container}>
      {/* Fixed header above chart */}
      <ChartHeader value={displayValue} label={displayLabel} />
      
      <GestureDetector gesture={gesture}>
        <Canvas
          style={[
            styles.canvas,
            {
              width: responsiveDimensions.width,
              height: responsiveDimensions.height,
            },
          ]}
        >
          {/* Grid (rendered first, behind everything) */}
          <ChartGrid
            scales={scales}
            config={config}
            dimensions={responsiveDimensions}
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

          {/* Cursor */}
          <ChartCursor
            x={touchX}
            y={touchY}
            isActive={isActive}
            config={config}
            dimensions={responsiveDimensions}
          />
        </Canvas>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  canvas: {
    backgroundColor: "transparent",
  },
});
