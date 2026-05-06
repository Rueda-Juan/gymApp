import React from 'react';
import { Screen } from '@/shared/ui';
import { ActiveWorkoutController } from '@/features/activeWorkout';

export default function ActiveWorkoutPage() {
  return (
    <Screen safeAreaEdges={['top', 'bottom', 'left', 'right']}>
      <ActiveWorkoutController />
    </Screen>
  );
}
