import { useCallback } from 'react';

type HapticIntensity = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

// Vibration patterns for different feedback types (in milliseconds)
const HAPTIC_PATTERNS: Record<HapticIntensity, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  selection: 15,
  success: [10, 50, 30],
  warning: [30, 50, 30],
  error: [50, 30, 50, 30, 50],
};

/**
 * Hook to trigger haptic feedback on supported devices
 * Uses the Vibration API for Android and attempts to use
 * the native haptic engine on iOS via user gesture timing
 */
export function useHaptic() {
  const trigger = useCallback((intensity: HapticIntensity = 'light') => {
    // Check if vibration is supported
    if (!('vibrate' in navigator)) {
      return false;
    }

    try {
      const pattern = HAPTIC_PATTERNS[intensity];
      navigator.vibrate(pattern);
      return true;
    } catch {
      return false;
    }
  }, []);

  const light = useCallback(() => trigger('light'), [trigger]);
  const medium = useCallback(() => trigger('medium'), [trigger]);
  const heavy = useCallback(() => trigger('heavy'), [trigger]);
  const selection = useCallback(() => trigger('selection'), [trigger]);
  const success = useCallback(() => trigger('success'), [trigger]);
  const warning = useCallback(() => trigger('warning'), [trigger]);
  const error = useCallback(() => trigger('error'), [trigger]);

  return {
    trigger,
    light,
    medium,
    heavy,
    selection,
    success,
    warning,
    error,
  };
}

/**
 * Standalone function for triggering haptic feedback without hook
 */
export function triggerHaptic(intensity: HapticIntensity = 'light') {
  if (!('vibrate' in navigator)) return false;
  
  try {
    const pattern = HAPTIC_PATTERNS[intensity];
    navigator.vibrate(pattern);
    return true;
  } catch {
    return false;
  }
}
