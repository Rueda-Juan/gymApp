import React, { useCallback, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { YStack } from 'tamagui';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { RoutineExerciseRow } from '@/components/cards/RoutineExerciseRow';
import { EmptyStateIcon } from '@/components/feedback/EmptyStateIcon';
import { getExerciseName } from '@/utils/exercise';
import { Dumbbell } from 'lucide-react-native';

const DEFAULT_CONTENT_PADDING_HORIZONTAL = 16;
const DEFAULT_CONTENT_PADDING_BOTTOM = 100;
const DEFAULT_CONTENT_STYLE: ViewStyle = {
  paddingHorizontal: DEFAULT_CONTENT_PADDING_HORIZONTAL,
  paddingBottom: DEFAULT_CONTENT_PADDING_BOTTOM,
};

interface RoutineExercise {
  id: string;
  name: string;
  nameEs?: string | null;
  muscle: string;
  sets: number;
  reps: string;
  supersetGroup?: number | null;
}

interface RoutineEditorListProps {
  exercises: RoutineExercise[];
  onReorder: (data: RoutineExercise[]) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, sets: number, reps: string) => void;
  onLinkNext: (index: number) => void;
  onUnlink: (index: number) => void;
  listHeaderComponent?: React.ReactElement | null;
  listFooterComponent?: React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const keyExtractor = (item: RoutineExercise) => item.id;

export function RoutineEditorList({
  exercises,
  onReorder,
  onRemove,
  onUpdate,
  onLinkNext,
  onUnlink,
  listHeaderComponent,
  listFooterComponent,
  contentContainerStyle,
}: RoutineEditorListProps) {
  const handleDragEnd = useCallback(({ data }: { data: RoutineExercise[] }) => {
    onReorder(data);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [onReorder]);

  const resolvedContainerStyle = useMemo(
    () => contentContainerStyle ?? DEFAULT_CONTENT_STYLE,
    [contentContainerStyle]
  );

  const emptyComponent = useMemo(() => (
    <YStack padding="$4xl" alignItems="center" gap="$md">
      <EmptyStateIcon icon={Dumbbell} size={40} color="textTertiary" />
      <AppText variant="bodyMd" color="textSecondary" textAlign="center">
        Aún no has agregado ejercicios a esta rutina.
      </AppText>
      <AppText variant="bodySm" color="textTertiary" textAlign="center">
        Tocá "Agregar ejercicio" para empezar.
      </AppText>
    </YStack>
  ), []);

  const renderItem = useCallback(({ item, getIndex, drag, isActive }: {
    item: RoutineExercise;
    getIndex: () => number | undefined;
    drag: () => void;
    isActive: boolean;
  }) => {
    const index = getIndex() ?? 0;
    const isLinkedNext =
      index < exercises.length - 1 &&
      exercises[index]?.supersetGroup != null &&
      exercises[index].supersetGroup === exercises[index + 1]?.supersetGroup;
    const isLinkedPrev =
      index > 0 &&
      exercises[index]?.supersetGroup != null &&
      exercises[index].supersetGroup === exercises[index - 1]?.supersetGroup;

    return (
      <ScaleDecorator>
        <RoutineExerciseRow
          exerciseName={getExerciseName(item)}
          muscleGroup={item.muscle}
          sets={item.sets}
          reps={item.reps}
          onRemove={() => onRemove(item.id)}
          onUpdateSets={(sets) => onUpdate(item.id, sets, item.reps)}
          onUpdateReps={(reps) => onUpdate(item.id, item.sets, reps)}
          drag={drag}
          isActive={isActive}
          isLinkedNext={isLinkedNext}
          isLinkedPrev={isLinkedPrev}
          onLinkNext={() => onLinkNext(index)}
          onUnlink={() => onUnlink(index)}
        />
      </ScaleDecorator>
    );
  }, [exercises, onRemove, onUpdate, onLinkNext, onUnlink]);

  return (
    <DraggableFlatList
      data={exercises}
      keyExtractor={keyExtractor}
      contentContainerStyle={resolvedContainerStyle}
      onDragEnd={handleDragEnd}
      ListHeaderComponent={listHeaderComponent ? <View>{listHeaderComponent}</View> : undefined}
      ListFooterComponent={listFooterComponent ? <View>{listFooterComponent}</View> : undefined}
      ListEmptyComponent={emptyComponent}
      renderItem={renderItem}
    />
  );
}
