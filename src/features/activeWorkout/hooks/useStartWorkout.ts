import { useCallback } from 'react';
import { Alert } from 'react-native';
import { router, Href } from 'expo-router';

import { useActiveWorkout } from '@/entities/workout';
import { useWorkoutDb } from '@/entities/workout';
import { createClientId } from '@/shared/lib/clientId';

type NavigationMode = 'push' | 'replace';

interface RoutineExerciseForWorkout {
  exercise?: { id: string; name: string; nameEs?: string | null };
  targetSets: number;
  maxReps: string | number;
  supersetGroup?: number | null;
}

export interface StartableRoutine {
  id: string;
  name: string;
  exercises: RoutineExerciseForWorkout[];
}

function buildInitialExercises(routineExercises: RoutineExerciseForWorkout[]) {
  return (routineExercises || [])
    .filter((re) => !!re.exercise)
    .map((re) => ({
      id: createClientId(),
      exerciseId: re.exercise!.id,
      name: re.exercise!.name,
      nameEs: re.exercise!.nameEs,
      supersetGroup: re.supersetGroup ?? null,
      sets: Array.from({ length: re.targetSets || 3 }).map(() => ({
        id: createClientId(),
        weight: 0,
        reps: 10, // Default to 10 if not specified
        isCompleted: false,
        type: 'normal' as const,
      })),
    }));
}

/**
 * Returns an async function that starts a workout from a given routine object.
 * Guards against starting a new session while one is already active.
 */
export function useStartWorkout(navigationMode: NavigationMode = 'push') {
  const workoutService = useWorkoutDb();
  const { startWorkout: startActiveWorkout } = useActiveWorkout();

  return useCallback(
    async (routine: StartableRoutine) => {
      if (useActiveWorkout.getState().isActive) {
        Alert.alert(
          'Entreno en curso',
          'Termina o cancela el entrenamiento actual antes de empezar uno nuevo.',
        );
        return;
      }
      try {
        const workout = await workoutService.startWorkout(routine.id);
        const initialExercises = buildInitialExercises(routine.exercises);
        startActiveWorkout(workout.id, routine.id, routine.name, initialExercises);
        
        const pathname = '/(workouts)/[workoutId]' as const;
        const params = { workoutId: workout.id };
        
        if (navigationMode === 'replace') {
          router.replace({ pathname, params } as Href<string>);
        } else {
          router.push({ pathname, params } as Href<string>);
        }
      } catch (e) {
        console.error('[useStartWorkout]', e);
        Alert.alert('Error', 'No se pudo iniciar el entrenamiento. Intenta de nuevo.');
      }
    },
    [workoutService, startActiveWorkout, navigationMode],
  );
}

