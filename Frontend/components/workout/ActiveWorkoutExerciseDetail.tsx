import React from 'react';
import Animated from 'react-native-reanimated';
import { Pressable, ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { useBottomBarHeightContext } from '@/context/BottomBarHeightContext';
import { MoreVertical, Plus, SkipForward, TrendingUp } from 'lucide-react-native';
import { SetRow } from '@/components/cards/set-row';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge } from '@/components/ui/badge';
import { getExerciseName } from '@/utils/exercise';
import type { WorkoutExerciseState, WorkoutSetState } from '@/store/useActiveWorkout';

const SCROLL_BOTTOM_PADDING = 140;
const SET_HEADER_HORIZONTAL_PADDING = 4;
const SET_NUMBER_COLUMN_WIDTH = 32;
const SET_ACTION_COLUMN_WIDTH = 44;

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
  scrollEnabled?: boolean;
  onLayout?: (y: number) => void;
  isSupersetMember?: boolean;
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
  scrollEnabled = true,
  onLayout,
  isSupersetMember = false,
}: ActiveWorkoutExerciseDetailProps) {
  const isSkipped = exercise.status === 'skipped';
  const completedSets = exercise.sets.filter(set => set.isCompleted).length;
  const totalSets = exercise.sets.length;
  const { bottomBarHeight } = useBottomBarHeightContext();

  return (
    <ScrollView
      contentContainerStyle={{ 
        paddingBottom: isSupersetMember ? 20 : Math.max(SCROLL_BOTTOM_PADDING, bottomBarHeight || SCROLL_BOTTOM_PADDING), 
        flexGrow: 1, 
        justifyContent: isSupersetMember ? 'flex-start' : 'center' 
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={scrollEnabled}
      onLayout={(e) => onLayout?.(e.nativeEvent.layout.y, e.nativeEvent.layout.height)}
    >
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$xl"
        paddingTop="$lg"
        paddingBottom="$sm"
      >
        <YStack flex={1} marginRight="$md">
          {/* @ts-ignore - sharedTransitionTag exists at runtime but might be missing in @types/react-native-reanimated for SDK 54 */}
          <Animated.View sharedTransitionTag={`ex-name-${exercise.exerciseId}`}>
            <AppText variant="titleMd" numberOfLines={1}>
              {getExerciseName(exercise)}
            </AppText>
          </Animated.View>
          <AppText variant="bodySm" color="textSecondary" marginTop="$xs">
            {completedSets}/{totalSets} sets completados
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
          <XStack marginBottom="$xs" paddingHorizontal={SET_HEADER_HORIZONTAL_PADDING} alignItems="center">
            <AppText variant="label" color="textTertiary" width={SET_NUMBER_COLUMN_WIDTH} textAlign="center">SET</AppText>
            <AppText variant="label" color="textTertiary" flex={1.2} textAlign="center">KG</AppText>
            <AppText variant="label" color="textTertiary" flex={1} textAlign="center">REPS</AppText>
            <YStack width={SET_ACTION_COLUMN_WIDTH} />
          </XStack>

          <YStack gap="$xs">
            {exercise.sets.map((set, setIndex) => (
              <SetRow
                key={set.id}
                index={setIndex}
                set={set}
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