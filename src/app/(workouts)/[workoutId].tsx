import React from 'react';
import { Screen } from '@/shared/ui';
import { ActiveWorkoutController } from '@/features/activeWorkout';

export default function ActiveWorkoutPage() {
  return (
    <Screen safeAreaEdges={['top', 'left', 'right', 'bottom']}>
      <ActiveWorkoutController />
    </Screen>
  );
}
