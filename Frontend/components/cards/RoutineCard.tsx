import React, { useCallback } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { CardBase } from '@/components/ui/Card';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge } from '@/components/ui/Badge';
import { Play } from 'lucide-react-native';
import { animatedCardShadow, elevation } from '@/constants/elevation';
import { formatRoutineExerciseNames } from '@/utils/routine';
import type { Routine } from 'backend/shared/types';

export interface RoutineWithLastPerformed extends Routine {
  lastPerformed: string | null;
}

interface RoutineCardProps {
  routine: RoutineWithLastPerformed;
  index: number;
  onOpen: (r: RoutineWithLastPerformed) => void;
  onStart: (r: RoutineWithLastPerformed) => void;
}

function RoutineCard({ routine, index, onOpen, onStart }: RoutineCardProps) {
  const pressStyle = useCallback(({ pressed }: { pressed: boolean }) => ({ flex: 1, opacity: pressed ? 0.7 : 1 }), []);

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index * 100, 500)).springify()} style={animatedCardShadow}>
      <CardBase gap="$md" padding="$md" {...elevation.flat}>
        <XStack justifyContent="space-between" alignItems="stretch" flex={1}>
          <Pressable
            style={pressStyle}
            onPress={() => onOpen(routine)}
            accessibilityRole="button"
            accessibilityLabel={`Abrir rutina ${routine.name}`}
          >
            <YStack padding="$md" gap="$xs" flex={1}>
              <AppText variant="label" color="textTertiary">
                {routine.lastPerformed ? `Última vez: ${routine.lastPerformed}` : 'Aún sin datos'}
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
          </Pressable>

          <YStack
            width={64}
            alignSelf="stretch"
            alignItems="center"
            justifyContent="center"
            borderLeftWidth={1}
            borderLeftColor="$borderColor"
          >
            <Pressable
              onPress={() => onStart(routine)}
              accessibilityLabel={`Iniciar ${routine.name}`}
              accessibilityRole="button"
            >
              <YStack width={48} height={48} alignItems="center" justifyContent="center">
                <AppIcon icon={Play} color="primary" size={24} />
              </YStack>
            </Pressable>
          </YStack>
        </XStack>
      </CardBase>
    </Animated.View>
  );
}

export default React.memo(RoutineCard);
