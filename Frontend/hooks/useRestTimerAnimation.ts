import { useState, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
} from 'react-native-reanimated';
import { useRestTimer } from '@/store/useRestTimer';

/**
 * Encapsulates the hourglass spin animation and countdown progress bar
 * for the rest timer overlay in the active workout screen.
 */
export function useRestTimerAnimation() {
  const restTimerIsActive = useRestTimer(s => s.isActive);
  const [restDisplaySeconds, setRestDisplaySeconds] = useState(0);

  const hourglassRotation = useSharedValue(0);
  const restProgress = useSharedValue(0);

  const hourglassAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${hourglassRotation.value}deg` }],
  }));

  const restProgressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: restProgress.value }],
    transformOrigin: ['0%', '50%', 0],
  }));

  useEffect(() => {
    if (restTimerIsActive) {
      restProgress.value = withTiming(1, { duration: 200 });
      hourglassRotation.value = withRepeat(
        withSequence(
          withTiming(180, { duration: 600 }),
          withDelay(1500, withTiming(360, { duration: 600 })),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(hourglassRotation);
      hourglassRotation.value = 0;
      setRestDisplaySeconds(0);
      restProgress.value = withTiming(0, { duration: 300 });
    }
    return () => cancelAnimation(hourglassRotation);
  }, [hourglassRotation, restProgress, restTimerIsActive]);

  useEffect(() => {
    if (!restTimerIsActive) return;
    const interval = setInterval(() => {
      const remaining = useRestTimer.getState().getRemainingSeconds();
      const duration = useRestTimer.getState().durationSeconds;
      setRestDisplaySeconds(Math.max(0, remaining));
      if (duration > 0) {
        restProgress.value = withTiming(Math.max(0, remaining / duration), { duration: 250 });
      }
    }, 500);
    return () => clearInterval(interval);
  }, [restProgress, restTimerIsActive]);

  return { restDisplaySeconds, hourglassAnimatedStyle, restProgressStyle };
}
