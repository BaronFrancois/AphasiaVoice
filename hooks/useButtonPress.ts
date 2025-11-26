import { useRef, useCallback } from 'react';

export interface ButtonPressConfig {
  onPress?: () => void;
  onPressStart?: () => void;
  onPressCancel?: () => void;
  minPressDuration?: number; // milliseconds
  moveThreshold?: number; // pixels
  verticalTolerance?: number; // ratio (0-1), allows some vertical drift
}

export interface ButtonPressHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
}

/**
 * Custom hook to handle button press with tremor filtering and haptic feedback
 *
 * Features:
 * - Soft hold: requires minimum press duration (150-250ms) to validate
 * - Tremor filtering: ignores micro-taps
 * - Vertical tolerance: allows finger drift downward without canceling
 * - Haptic feedback: vibrates on successful press and errors
 */
export const useButtonPress = (config: ButtonPressConfig): ButtonPressHandlers => {
  const {
    onPress,
    onPressStart,
    onPressCancel,
    minPressDuration = 200, // Default 200ms soft hold
    moveThreshold = 30, // 30px horizontal threshold
    verticalTolerance = 0.7 // 70% more tolerance for downward movement
  } = config;

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const isPressValidRef = useRef(false);
  const hasMovedTooMuchRef = useRef(false);

  const clearPressTimer = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }, []);

  const triggerHapticFeedback = useCallback((pattern: number | number[] = 50) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Capture the pointer to receive all events even if cursor leaves element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    // Store initial position
    startPosRef.current = { x: e.clientX, y: e.clientY };
    isPressValidRef.current = false;
    hasMovedTooMuchRef.current = false;

    // Trigger press start callback
    if (onPressStart) {
      onPressStart();
    }

    // Start timer for minimum press duration
    pressTimerRef.current = setTimeout(() => {
      if (!hasMovedTooMuchRef.current) {
        isPressValidRef.current = true;
        // Light haptic feedback to indicate press is being registered
        triggerHapticFeedback(30);
      }
    }, minPressDuration);
  }, [minPressDuration, onPressStart, triggerHapticFeedback]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!startPosRef.current) return;

    const deltaX = Math.abs(e.clientX - startPosRef.current.x);
    const deltaY = e.clientY - startPosRef.current.y; // Positive = downward

    // Calculate effective threshold with vertical tolerance
    // Allow more movement if it's downward (natural finger slide)
    const effectiveThresholdY = deltaY > 0
      ? moveThreshold * (1 + verticalTolerance)
      : moveThreshold;

    // Check if moved too much
    if (deltaX > moveThreshold || Math.abs(deltaY) > effectiveThresholdY) {
      if (!hasMovedTooMuchRef.current) {
        hasMovedTooMuchRef.current = true;
        clearPressTimer();

        if (onPressCancel) {
          onPressCancel();
        }
      }
    }
  }, [moveThreshold, verticalTolerance, clearPressTimer, onPressCancel]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    // Release pointer capture
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    clearPressTimer();

    // Only trigger press if it was validated
    if (isPressValidRef.current && !hasMovedTooMuchRef.current && onPress) {
      // Success haptic feedback
      triggerHapticFeedback(50);
      onPress();
      // Reset pressing state after successful press
      if (onPressCancel) {
        onPressCancel();
      }
    } else if (!isPressValidRef.current && !hasMovedTooMuchRef.current && onPressCancel) {
      // Press was cancelled because it was released too quickly (before validation)
      onPressCancel();
    } else if (hasMovedTooMuchRef.current && onPressCancel) {
      // Cancel haptic feedback (optional, different pattern)
      // triggerHapticFeedback([30, 50, 30]);
    }

    // Reset refs
    startPosRef.current = null;
    isPressValidRef.current = false;
    hasMovedTooMuchRef.current = false;
  }, [clearPressTimer, onPress, onPressCancel, triggerHapticFeedback]);

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    // Release pointer capture
    if (e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }

    clearPressTimer();

    if (onPressCancel) {
      onPressCancel();
    }

    // Reset refs
    startPosRef.current = null;
    isPressValidRef.current = false;
    hasMovedTooMuchRef.current = false;
  }, [clearPressTimer, onPressCancel]);

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel
  };
};
