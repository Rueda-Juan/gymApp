import React, { useCallback } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
// import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { CardBase } from '@/shared/ui/Card';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { Badge } from '@/shared/ui/Badge';
import { Play } from 'lucide-react-native';
import { animatedCardShadow, elevation } from '@/shared/ui/theme/elevation';
import { formatRoutineExerciseNames } from '../lib/routine';
import type { RoutineWithLastPerformed } from '../model/types';

interface RoutineCardProps {
  routine: RoutineWithLastPerformed;
  index: number;
  onOpen: (r: RoutineWithLastPerformed) => void;
  onStart: (r: RoutineWithLastPerformed) => void;
}

export function RoutineCard({ routine, index, onOpen, onStart }: RoutineCardProps) {
  // pressStyle eliminado, usaremos pressStyle Tamagui

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index * 100, 500)).springify()} style={animatedCardShadow}>
      <CardBase gap="$md" padding="$md" {...elevation.flat}>
        <XStack justifyContent="space-between" alignItems="stretch" flex={1}>
          <YStack
            onPress={() => onOpen(routine)}
            accessibilityRole="button"
            accessibilityLabel={`Abrir rutina ${routine.name}`}
            cursor="pointer"
            pressStyle={{ opacity: 0.7 }}
            flex={1}
          >
            <YStack padding="$md" gap="$xs" flex={1}>
              <AppText variant="label" color="textTertiary">
                {routine.lastPerformed ? `Ultima vez: ${routine.lastPerformed}` : 'An sin datos'}
              </AppText>
              <AppText variant="titleMd" numberOfLines={1}>{routine.name}</AppText>
              <AppText variant="bodyMd" color="textSecondary" numberOfLines={2}>
                {formatRoutineExerciseNames(routine.exercises)}
              </AppText>
              {routine.muscles && routine.muscles.length > 0 && (
                <XStack flexWrap="wrap" gap="$sm" marginTop="$sm">
                  {routine.muscles.map((muscle: string) => (
                    <Badge key={muscle} label={muscle} variant="primary" />
                  ))}
                </XStack>
              )}
            </YStack>
          </YStack>

          <YStack
            width={64}
            alignSelf="stretch"
            alignItems="center"
            justifyContent="center"
            borderLeftWidth={1}
            borderLeftColor="$borderColor"
          >
            <YStack
              onPress={() => onStart(routine)}
              accessibilityRole="button"
              accessibilityLabel={`Iniciar ${routine.name}`}
              cursor="pointer"
              pressStyle={{ opacity: 0.7 }}
              width={48}
              height={48}
              alignItems="center"
              justifyContent="center"
            >
              <AppIcon icon={Play} color="primary" size={24} />
            </YStack>
          </YStack>
        </XStack>
      </CardBase>
    </Animated.View>
  );
}

export default React.memo(RoutineCard);
