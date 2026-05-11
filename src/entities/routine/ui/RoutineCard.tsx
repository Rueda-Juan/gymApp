import React, { useEffect } from 'react';
// import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { CardBase } from '@/shared/ui/Card';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { Badge } from '@/shared/ui/Badge';
import { Play } from 'lucide-react-native';
import { animatedCardShadow, elevation } from '@/shared/ui/theme/elevation';
import { formatRoutineExerciseNames } from '../lib/routine';
import { RoutineWithLastPerformed } from '@kernel';

interface RoutineCardProps {
  routine: RoutineWithLastPerformed;
  index: number;
  onOpen: (r: RoutineWithLastPerformed) => void;
  onStart: (r: RoutineWithLastPerformed) => void;
  testID?: string;
}

const FADE_IN_DURATION_MS = 300;
const FADE_IN_STAGGER_MS = 100;
const MAX_STAGGER_MS = 500;

export function RoutineCard({ routine, index, onOpen, onStart, testID }: RoutineCardProps) {
  // Fade-in escalonado explícito — reemplaza FadeInDown que requiere LayoutAnimationConfig global
  const fadeOpacity = useSharedValue(0);
  const fadeTranslateY = useSharedValue(20);

  useEffect(() => {
    const stagger = Math.min(index * FADE_IN_STAGGER_MS, MAX_STAGGER_MS);
    const duration = FADE_IN_DURATION_MS + stagger;
    fadeOpacity.value = withTiming(1, { duration });
    fadeTranslateY.value = withSpring(0, { damping: 15, stiffness: 120 });
  }, [fadeOpacity, fadeTranslateY, index]);

  const fadeInStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    transform: [{ translateY: fadeTranslateY.value }],
  }));

  return (
    <Animated.View style={[animatedCardShadow, fadeInStyle]}>
      <CardBase gap="$md" padding="$md" {...elevation.flat} testID={testID}>
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
                {routine.lastPerformed ? ` Ultima vez: ${routine.lastPerformed}` : 'A n sin datos'}
              </AppText>
              <AppText variant="titleMd" numberOfLines={1}>{routine.name}</AppText>
              <AppText variant="bodyMd" color="textSecondary" numberOfLines={2}>
                {formatRoutineExerciseNames(routine.exercises || [])}
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

