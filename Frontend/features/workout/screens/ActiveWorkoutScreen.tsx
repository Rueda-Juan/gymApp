
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useWorkoutStore, useOfflineQueue } from '@features/workout';
import LoadingSkeleton from '../../../components/shared/LoadingSkeleton';
import ErrorState from '../../../components/shared/ErrorState';
import OfflineBanner from '../../../components/shared/OfflineBanner';
import WorkoutSetRow from '../../../components/ui/WorkoutSetRow';

import { useRouter } from 'expo-router';

const ActiveWorkoutScreenState = {
  LOADING: 'loading',
  SUCCESS: 'success',
  PAUSED: 'paused',
  OFFLINE: 'offline',
  SYNC_PENDING: 'syncPending',
  ERROR: 'error',
} as const;
type ActiveWorkoutScreenStateType = typeof ActiveWorkoutScreenState[keyof typeof ActiveWorkoutScreenState];

const ActiveWorkoutScreen = () => {
  const { session } = useWorkoutStore();
  const { queue } = useOfflineQueue();
  const [state, setState] = useState<ActiveWorkoutScreenStateType>(ActiveWorkoutScreenState.LOADING);

  // Simulación de lógica de estado (reemplazar por lógica real)
  React.useEffect(() => {
    setTimeout(() => {
      if (queue.length > 0) setState(ActiveWorkoutScreenState.OFFLINE);
      else if (!session) setState(ActiveWorkoutScreenState.LOADING);
      else setState(ActiveWorkoutScreenState.SUCCESS);
    }, 1000);
  }, [queue, session]);

  const router = useRouter();

  if (state === ActiveWorkoutScreenState.LOADING) return <LoadingSkeleton />;
  if (state === ActiveWorkoutScreenState.OFFLINE) return <OfflineBanner />;
  if (state === ActiveWorkoutScreenState.ERROR) return <ErrorState message="Error en sesión activa" />;
  if (state === ActiveWorkoutScreenState.PAUSED) return <Text>Sesión pausada</Text>;
  if (state === ActiveWorkoutScreenState.SYNC_PENDING) return <Text>Sincronizando con la nube...</Text>;

  // success
  return (
    <View>
      <WorkoutSetRow setNumber={1} weight={50} reps={10} />
      <Pressable
        onPress={() => router.push('/(workouts)/summary')}
        accessibilityRole="button"
        accessibilityLabel="Finalizar y ver resumen"
      >
        <Text style={{ color: 'blue' }}>Finalizar y ver resumen</Text>
      </Pressable>
      {/* Agregar más UI y lógica según contrato */}
    </View>
  );
};

export default ActiveWorkoutScreen;
