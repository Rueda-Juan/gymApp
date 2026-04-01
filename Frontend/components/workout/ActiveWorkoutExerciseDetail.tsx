import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { MoreVertical, Plus, SkipForward, TrendingUp } from 'lucide-react-native';
import { SetRow } from '@/components/cards/set-row';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge } from '@/components/ui/badge';
import { getExerciseName } from '@/utils/exercise';
import type { WorkoutExerciseState, WorkoutSetState } from '@/store/useActiveWorkout';

interface ActiveWorkoutExerciseDetailProps {
  exercise: WorkoutExerciseState;
  focusedSetId: string | null;
  suggestedWeight: string | null;
  suggestionMessage: string | null;
  onSkipExercise: (exerciseId: string) => void;
  onOpenOptions: (exerciseId: string) => void;
  onUpdateSetValues: (exerciseId: string, setId: string, values: Partial<WorkoutSetState>) => void;
  onToggleSet: (exerciseId: string, setId: string, isCompleted: boolean) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  onAddSet: (exerciseId: string) => void;
  resolvePreviousWeight: (exercise: WorkoutExerciseState, setIndex: number) => number;
}

export function ActiveWorkoutExerciseDetail({
  exercise,
  focusedSetId,
  suggestedWeight,
  suggestionMessage,
  onSkipExercise,
  onOpenOptions,
  onUpdateSetValues,
  onToggleSet,
  onRemoveSet,
  onAddSet,
  resolvePreviousWeight,
}: ActiveWorkoutExerciseDetailProps) {
  const isSkipped = exercise.status === 'skipped';

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 140, flexGrow: 1, justifyContent: 'center' }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$xl"
        paddingTop="$lg"
        paddingBottom="$sm"
      >
        <YStack flex={1} marginRight="$md">
          <AppText variant="titleMd" numberOfLines={2}>
            {getExerciseName(exercise)}
          </AppText>
          <AppText variant="bodySm" color="textSecondary" marginTop="$xs">
            {exercise.sets.filter((set) => set.isCompleted).length}/{exercise.sets.length} sets completados
          </AppText>
        </YStack>

        <XStack alignItems="center" gap="$sm">
          {!isSkipped && (
            <Pressable onPress={() => onSkipExercise(exercise.id)} accessibilityLabel="Saltar ejercicio">
              <XStack
                alignItems="center"
                gap="$xs"
                backgroundColor="$surfaceSecondary"
                paddingHorizontal="$sm"
                paddingVertical="$xs"
                borderRadius="$md"
              >
                <AppIcon icon={SkipForward} color="textTertiary" size={14} />
                <AppText variant="label" color="textTertiary">Saltar</AppText>
              </XStack>
            </Pressable>
          )}
          {isSkipped && <Badge label="OMITIDO" variant="danger" size="sm" />}
          <Pressable onPress={() => onOpenOptions(exercise.id)} accessibilityLabel="Opciones del ejercicio">
            <YStack padding="$xs">
              <AppIcon icon={MoreVertical} color="textTertiary" size={20} />
            </YStack>
          </Pressable>
        </XStack>
      </XStack>

      {suggestedWeight != null && !isSkipped && (
        <XStack
          marginHorizontal="$xl"
          marginBottom="$sm"
          paddingHorizontal="$md"
          paddingVertical="$sm"
          backgroundColor="$primarySubtle"
          borderRadius="$lg"
          borderCurve="continuous"
          alignItems="center"
          gap="$sm"
        >
          <AppIcon icon={TrendingUp} color="primary" size={14} />
          <YStack flex={1}>
            <AppText variant="label" color="primary" fontWeight="700">
              Sugerido: {suggestedWeight}
            </AppText>
            {suggestionMessage != null && (
              <AppText variant="label" color="textSecondary">
                {suggestionMessage}
              </AppText>
            )}
          </YStack>
        </XStack>
      )}

      {!isSkipped && (
        <YStack paddingHorizontal="$xl">
          <XStack marginBottom="$xs" paddingHorizontal={4} alignItems="center">
            <AppText variant="label" color="textTertiary" width={32} textAlign="center">SET</AppText>
            <AppText variant="label" color="textTertiary" flex={1.2} textAlign="center">KG</AppText>
            <AppText variant="label" color="textTertiary" flex={1} textAlign="center">REPS</AppText>
            <YStack width={44} />
          </XStack>

          <YStack gap="$xs">
            {exercise.sets.map((set, setIndex) => (
              <SetRow
                key={set.id}
                index={setIndex}
                setRef={set}
                previousWeight={resolvePreviousWeight(exercise, setIndex)}
                autoFocus={set.id === focusedSetId}
                onUpdate={(values) => onUpdateSetValues(exercise.id, set.id, values)}
                onToggleComplete={() => onToggleSet(exercise.id, set.id, set.isCompleted)}
                onRemove={() => onRemoveSet(exercise.id, set.id)}
              />
            ))}
          </YStack>

          <Pressable onPress={() => onAddSet(exercise.id)} accessibilityLabel="Añadir nuevo set">
            <XStack
              alignItems="center"
              justifyContent="center"
              borderWidth={1.5}
              borderStyle="dashed"
              borderColor="$borderColor"
              borderRadius="$lg"
              borderCurve="continuous"
              paddingVertical="$md"
              marginTop="$md"
              gap="$xs"
            >
              <AppIcon icon={Plus} color="textTertiary" size={16} />
              <AppText variant="bodyMd" color="textTertiary" fontWeight="600">
                Añadir set
              </AppText>
            </XStack>
          </Pressable>
        </YStack>
      )}
    </ScrollView>
  );
}