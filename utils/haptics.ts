import * as Haptics from "expo-haptics";

/**
 * Haptics configuration and utilities for the chart
 */

// Configuration - customize these values to change haptic behavior
export const HAPTIC_CONFIG = {
  // Enable/disable haptics globally
  enabled: true,

  // Haptic style for moving between data points
  dataPointStyle: Haptics.ImpactFeedbackStyle.Heavy,

  // Haptic for when gesture starts
  gestureStartStyle: Haptics.ImpactFeedbackStyle.Heavy,

  // Haptic for when gesture ends
  gestureEndEnabled: true,
};

/**
 * Trigger haptic feedback when moving to a new data point
 */
export const triggerDataPointHaptic = async () => {
  if (!HAPTIC_CONFIG.enabled) return;

  try {
    await Haptics.impactAsync(HAPTIC_CONFIG.dataPointStyle);
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }
};

/**
 * Trigger haptic feedback when gesture starts
 */
export const triggerGestureStartHaptic = async () => {
  if (!HAPTIC_CONFIG.enabled) return;

  try {
    await Haptics.impactAsync(HAPTIC_CONFIG.gestureStartStyle);
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }
};

/**
 * Trigger haptic feedback when gesture ends
 */
export const triggerGestureEndHaptic = async () => {
  if (!HAPTIC_CONFIG.enabled || !HAPTIC_CONFIG.gestureEndEnabled) return;

  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }
};

/**
 * Trigger a custom haptic pattern
 * Useful for experimenting with different feedback styles
 */
export const triggerCustomHaptic = async (
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium
) => {
  if (!HAPTIC_CONFIG.enabled) return;

  try {
    await Haptics.impactAsync(style);
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }
};

/**
 * Trigger notification-style haptic (success/warning/error)
 */
export const triggerNotificationHaptic = async (
  type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType
    .Success
) => {
  if (!HAPTIC_CONFIG.enabled) return;

  try {
    await Haptics.notificationAsync(type);
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }
};

/**
 * Trigger selection haptic (lighter, for picker-style interactions)
 */
export const triggerSelectionHaptic = async () => {
  if (!HAPTIC_CONFIG.enabled) return;

  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.warn("Haptic feedback failed:", error);
  }
};

// Available haptic styles for reference:
// - Haptics.ImpactFeedbackStyle.Light (subtle)
// - Haptics.ImpactFeedbackStyle.Medium (moderate)
// - Haptics.ImpactFeedbackStyle.Heavy (strong)
// - Haptics.ImpactFeedbackStyle.Rigid (crisp and firm)
// - Haptics.ImpactFeedbackStyle.Soft (very gentle)
//
// Notification types:
// - Haptics.NotificationFeedbackType.Success
// - Haptics.NotificationFeedbackType.Warning
// - Haptics.NotificationFeedbackType.Error
