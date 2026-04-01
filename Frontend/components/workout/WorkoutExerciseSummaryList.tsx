import React, { useMemo } from 'react';
import { XStack, YStack, View } from 'tamagui';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Star, Link2 } from 'lucide-react-native';

import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { getExerciseName } from '@/utils/exercise';
import { FONT_SCALE } from '@/tamagui.config';

const MAX_ANIMATION_DELAY_MS = 1300;

interface SummaryPersonalRecord {
  exerciseId: string;
  recordType: string;
  value: number;
}

interface SummarySet {
  id: string;
  weight: number;
  reps: number;
  isCompleted?: boolean;
}

interface SummaryExercise {
  id: string;
  exerciseId: string;
  name?: string;
  nameEs?: string | null;
  supersetGroup?: number | null;
  sets: SummarySet[];
}

interface WorkoutExerciseSummaryListProps {
  exercises: SummaryExercise[];
  newRecords: SummaryPersonalRecord[];
}

export function WorkoutExerciseSummaryList({ exercises, newRecords }: WorkoutExerciseSummaryListProps) {
  const supersetGroups = useMemo(() => {
    const groups = new Set<number>();
    exercises.forEach(ex => {
      if (ex.supersetGroup != null) groups.add(ex.supersetGroup);
    });
    return groups;
  }, [exercises]);

  const isInSuperset = (ex: SummaryExercise) => ex.supersetGroup != null && supersetGroups.has(ex.supersetGroup!);
  const isFirstInGroup = (ex: SummaryExercise, idx: number) =>
    isInSuperset(ex) && (idx === 0 || exercises[idx - 1]?.supersetGroup !== ex.supersetGroup);
  const isLastInGroup = (ex: SummaryExercise, idx: number) =>
    isInSuperset(ex) && (idx === exercises.length - 1 || exercises[idx + 1]?.supersetGroup !== ex.supersetGroup);

  return (
    <Animated.View entering={FadeIn.delay(800)}>
      <AppText variant="titleSm" marginBottom="$md">Resumen de Ejercicios</AppText>

      <YStack gap="$md">
        {exercises.map((ex, exIdx) => {
          const exerciseName = getExerciseName({ name: ex.name ?? '', nameEs: ex.nameEs });
          const sessionSets = (ex.sets || []).filter((s) => Number(s.reps) > 0);
          const exercisePRs = newRecords.filter(
            (r) => r.exerciseId === ex.exerciseId || r.exerciseId === ex.id,
          );
          const inSuperset = isInSuperset(ex);
          const firstInGroup = isFirstInGroup(ex, exIdx);
          const lastInGroup = isLastInGroup(ex, exIdx);

          return (
            <Animated.View
              key={ex.id}
              entering={FadeInDown.delay(
                Math.min(900 + exIdx * 100, MAX_ANIMATION_DELAY_MS),
              ).springify()}
            >
              {firstInGroup && (
                <XStack alignItems="center" gap="$xs" marginBottom="$xs">
                  <AppIcon icon={Link2} size={12} color="primary" />
                  <AppText variant="label" color="primary" fontWeight="700">SUPERSET</AppText>
                </XStack>
              )}
              <XStack>
                {inSuperset && (
                  <View
                    width={3}
                    backgroundColor="$primary"
                    borderTopLeftRadius={firstInGroup ? 4 : 0}
                    borderTopRightRadius={firstInGroup ? 4 : 0}
                    borderBottomLeftRadius={lastInGroup ? 4 : 0}
                    borderBottomRightRadius={lastInGroup ? 4 : 0}
                    marginRight="$sm"
                  />
                )}
                <YStack flex={1}>
                  <CardBase padding="$md">
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
                      <AppText variant="titleSm" flex={1}>{exerciseName}</AppText>
                      {exercisePRs.length > 0 && (
                        <YStack alignItems="flex-end" gap={2}>
                          <XStack
                            alignItems="center"
                            gap="$xs"
                            backgroundColor="$goldSubtle"
                            paddingHorizontal="$sm"
                            paddingVertical="$xs"
                            borderRadius="$md"
                          >
                            <AppIcon icon={Star} size={12} color="gold" />
                            <AppText variant="label" color="gold" fontWeight="700">PR</AppText>
                          </XStack>
                          <AppText color="gold" fontSize={FONT_SCALE.sizes[1]} fontWeight="600">
                            {`+${exercisePRs[0].value} kg`}
                          </AppText>
                        </YStack>
                      )}
                    </XStack>

                    {sessionSets.length === 0 ? (
                      <AppText variant="bodySm" color="textSecondary">
                        No se registraron repeticiones en esta sesión.
                      </AppText>
                    ) : (
                      <YStack gap="$sm">
                        <XStack paddingBottom="$xs" borderBottomWidth={1} borderBottomColor="$borderColor">
                          <AppText variant="label" color="textTertiary" flex={1}>SET</AppText>
                          <AppText variant="label" color="textTertiary" flex={2} textAlign="center">REPS</AppText>
                          <AppText variant="label" color="textTertiary" flex={2} textAlign="center">PESO</AppText>
                          <AppText variant="label" color="textTertiary" flex={2} textAlign="right">VOL</AppText>
                        </XStack>

                        {sessionSets.map((set: SummarySet, sIdx: number) => (
                          <XStack key={sIdx} paddingVertical="$xs">
                            <AppText variant="bodySm" color="textSecondary" flex={1} fontWeight="700">
                              {sIdx + 1}
                            </AppText>
                            <AppText variant="bodySm" flex={2} textAlign="center">{set.reps}</AppText>
                            <AppText variant="bodySm" flex={2} textAlign="center">{set.weight} kg</AppText>
                            <AppText variant="bodySm" color="textSecondary" flex={2} textAlign="right">
                              {set.weight * set.reps} kg
                            </AppText>
                          </XStack>
                        ))}
                      </YStack>
                    )}
                  </CardBase>
                </YStack>
              </XStack>
            </Animated.View>
          );
        })}
      </YStack>
    </Animated.View>
  );
}
