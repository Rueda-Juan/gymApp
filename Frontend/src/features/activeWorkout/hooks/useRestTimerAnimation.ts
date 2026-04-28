import { useState, useEffect } from "react";
import type { AnimatedStyle } from "react-native-reanimated";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
} from "react-native-reanimated";
import { useRestTimer } from "../model/useRestTimer";
import { motion } from "@/shared/ui/theme/motion";
import { useSensoryFeedback } from "@/entities/settings";

/**
 * Encapsulates the hourglass spin animation and countdown progress bar
 * for the rest timer overlay in the active workout screen.
 */
export function useRestTimerAnimation() {
  const restTimerIsActive = useRestTimer((s) => s.isActive);
  const stopTimer = useRestTimer((s) => s.stopTimer);
  const feedback = useSensoryFeedback();
  const [restDisplaySeconds, setRestDisplaySeconds] = useState(0);

  const hourglassRotation = useSharedValue(0);
  const restProgress = useSharedValue(0);

  const hourglassAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${hourglassRotation.value}deg` }],
  })) as AnimatedStyle<any>;

  const restProgressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: restProgress.value }],
    transformOrigin: ["0%", "50%", 0],
  })) as AnimatedStyle<any>;

  useEffect(() => {
    if (restTimerIsActive) {
      restProgress.value = withTiming(1, { duration: motion.duration.normal });
      hourglassRotation.value = withRepeat(
        withSequence(
          withTiming(180, { duration: motion.duration.hero }),
          withDelay(1500, withTiming(360, { duration: motion.duration.hero })),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(hourglassRotation);
      hourglassRotation.value = 0;
      setRestDisplaySeconds(0);
      restProgress.value = withTiming(0, { duration: motion.duration.slow });
    }
    return () => cancelAnimation(hourglassRotation);
  }, [hourglassRotation, restProgress, restTimerIsActive]);

  useEffect(() => {
    if (!restTimerIsActive) return;
    const interval = setInterval(() => {
      const { getRemainingSeconds, durationSeconds } = useRestTimer.getState();
      const remaining = getRemainingSeconds();
      setRestDisplaySeconds(Math.max(0, remaining));

      if (remaining <= 0) {
        feedback.heavy();
        stopTimer();
      } else if (durationSeconds > 0) {
        restProgress.value = withTiming(
          Math.max(0, remaining / durationSeconds),
          { duration: motion.duration.normal },
        );
      }
    }, 500);
    return () => clearInterval(interval);
  }, [restProgress, restTimerIsActive, feedback, stopTimer]);

  return { restDisplaySeconds, hourglassAnimatedStyle, restProgressStyle };
}
