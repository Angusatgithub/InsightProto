import { useCallback, useMemo, useRef } from "react";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import {
  BalanceDataPoint,
  ChartDimensions,
  ChartScales,
} from "../types/chart.types";
import {
  triggerDataPointHaptic,
  triggerGestureEndHaptic,
  triggerGestureStartHaptic,
} from "../utils/haptics";

interface UseChartGestureResult {
  gesture: any;
  touchX: any;
  touchY: any;
  isActive: any;
}

export const useChartGesture = (
  data: BalanceDataPoint[],
  scales: ChartScales,
  dimensions: ChartDimensions,
  onPointSelected?: (point: BalanceDataPoint | null) => void
): UseChartGestureResult => {
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const isActive = useSharedValue(0);

  // Track the last point index to detect when we move to a new point
  const lastPointIndex = useRef<number | null>(null);

  // Pre-compute all point positions to avoid scale calculations in worklet
  const pointPositions = useMemo(() => {
    return data.map((point) => ({
      x: scales.x(point.date),
      y: scales.y(point.balance),
      data: point,
    }));
  }, [data, scales]);

  const findClosestPointJS = useCallback(
    (touchXValue: number) => {
      if (pointPositions.length === 0) return null;

      // Clamp touchX to chart bounds
      const clampedX = Math.max(
        dimensions.marginLeft,
        Math.min(touchXValue, dimensions.width - dimensions.marginRight)
      );

      // Find closest point by x position
      let closest = pointPositions[0];
      let closestIndex = 0;
      let minDistance = Math.abs(clampedX - closest.x);

      for (let i = 1; i < pointPositions.length; i++) {
        const point = pointPositions[i];
        const distance = Math.abs(clampedX - point.x);
        if (distance < minDistance) {
          minDistance = distance;
          closest = point;
          closestIndex = i;
        }
      }

      return { point: closest, index: closestIndex };
    },
    [pointPositions, dimensions]
  );

  const triggerHaptic = useCallback(() => {
    triggerDataPointHaptic();
  }, []);

  const updatePointJS = useCallback(
    (x: number) => {
      const result = findClosestPointJS(x);

      if (result) {
        const { point: closest, index } = result;

        // Trigger haptic only when moving to a new point
        if (lastPointIndex.current !== index) {
          triggerHaptic();
          lastPointIndex.current = index;
        }

        touchX.value = closest.x;
        touchY.value = closest.y;

        if (onPointSelected) {
          onPointSelected(closest.data);
        }
      }
    },
    [findClosestPointJS, touchX, touchY, onPointSelected, triggerHaptic]
  );

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      isActive.value = 1;
      lastPointIndex.current = null; // Reset on new gesture
      runOnJS(triggerGestureStartHaptic)();
      runOnJS(updatePointJS)(event.x);
    })
    .onUpdate((event) => {
      runOnJS(updatePointJS)(event.x);
    })
    .onEnd(() => {
      isActive.value = 0;
      lastPointIndex.current = null; // Reset when gesture ends
      runOnJS(triggerGestureEndHaptic)();
      if (onPointSelected) {
        runOnJS(onPointSelected)(null);
      }
    });

  return { gesture, touchX, touchY, isActive };
};
