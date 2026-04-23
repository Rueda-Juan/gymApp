import { useEffect, useState, useCallback } from 'react';
import { useActiveWorkout } from '@/entities/workout';
import { useRestTimer } from '@/entities/workout';
import { router } from 'expo-router';
import { getExerciseName } from '@/entities/exercise';
import { triggerLightHaptic } from '@/shared/lib/haptics';

const TIMER_INTERVAL_MS = 1000;
const FALLBACK_EXERCISE_NAME = 'Entrenamiento libre';

export function useMiniPlayerState() {
  const isActive = useActiveWorkout(s => s.isActive);
  const workoutId = useActiveWorkout(s => s.workoutId);
  const currentExerciseName = useActiveWorkout(s => {
    const currentExercise = s.exercises[s.currentExerciseIndex];
    return currentExercise ? getExerciseName(currentExercise) : FALLBACK_EXERCISE_NAME;
  });

  const restIsActive = useRestTimer(s => s.isActive);
  const restEndTime = useRestTimer(s => s.endTime);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);

  useEffect(() => {
    if (!restIsActive || !restEndTime) {
      setRestSecondsLeft(0);
      return;
    }

    const updateRestSecondsLeft = () =>
      setRestSecondsLeft(Math.max(0, Math.ceil((restEndTime - Date.now()) / 1000)));

    updateRestSecondsLeft();
    const intervalId = setInterval(updateRestSecondsLeft, TIMER_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [restIsActive, restEndTime]);

  const handleRetomar = useCallback(() => {
    triggerLightHaptic();
    if (workoutId) {
      // Expo Router typed routes workaround ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â dynamic segment not inferable at compile time
      router.push({ pathname: '/(workouts)/[active]', params: { active: workoutId } } as any);
    }
  }, [workoutId]);

  return { isActive, currentExerciseName, restIsActive, restSecondsLeft, handleRetomar };
}
