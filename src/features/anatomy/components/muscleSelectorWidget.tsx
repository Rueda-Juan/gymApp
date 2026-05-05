import React, { useState } from 'react';
import { YStack, XStack } from 'tamagui';
import { AppButton } from '@/shared/ui/AppButton';
import type { MuscleGroup } from '@kernel';
import { BodyAnatomySvg } from '@/entities/anatomy';

export const MuscleSelectorWidget = () => {
  const [view, setView] = useState<'front' | 'back' | 'both'>('both');
  
  // These should ideally come from a parent component or store
  const primaryMuscles: MuscleGroup[] = [];
  const secondaryMuscles: MuscleGroup[] = [];

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
      <XStack justifyContent="center" gap="$2">
        <AppButton 
          size="sm" 
          appVariant={view === 'front' ? 'primary' : 'ghost'}
          onPress={() => setView('front')}
          label="Frente"
          fullWidth={false}
        />
        <AppButton 
          size="sm" 
          appVariant={view === 'both' ? 'primary' : 'ghost'}
          onPress={() => setView('both')}
          label="Ambos"
          fullWidth={false}
        />
        <AppButton 
          size="sm" 
          appVariant={view === 'back' ? 'primary' : 'ghost'}
          onPress={() => setView('back')}
          label="Espalda"
          fullWidth={false}
        />
      </XStack>

      <YStack flex={1} alignItems="center" justifyContent="center">
        <BodyAnatomySvg 
          viewType={view} 
          primaryMuscles={primaryMuscles}
          secondaryMuscles={secondaryMuscles}
        />
      </YStack>
    </YStack>
  );
};

