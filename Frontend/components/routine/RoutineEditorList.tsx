import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { YStack } from 'tamagui';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';

import { AppText } from '@/components/ui/AppText';
import { RoutineExerciseRow } from '@/components/cards/routine-exercise-row';
import { getExerciseName } from '@/utils/exercise';

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
  contentContainerStyle?: object;
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
    () => contentContainerStyle ?? { paddingHorizontal: 16, paddingBottom: 100 },
    [contentContainerStyle]
  );

  const emptyComponent = useMemo(() => (
    <YStack padding="$4xl" alignItems="center">
      <AppText variant="bodyMd" color="textSecondary" textAlign="center">
        Aún no has agregado ejercicios a esta rutina.
      </AppText>
    </YStack>
  ), []);

  return (
    <DraggableFlatList
      data={exercises}
      keyExtractor={keyExtractor}
      contentContainerStyle={resolvedContainerStyle}
      onDragEnd={handleDragEnd}
      ListHeaderComponent={listHeaderComponent ? <View>{listHeaderComponent}</View> : undefined}
      ListFooterComponent={listFooterComponent ? <View>{listFooterComponent}</View> : undefined}
      ListEmptyComponent={emptyComponent}
      renderItem={({ item, getIndex, drag, isActive }) => {
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
              onUpdateSets={(s) => onUpdate(item.id, s, item.reps)}
              onUpdateReps={(r) => onUpdate(item.id, item.sets, r)}
              drag={drag}
              isActive={isActive}
              isLinkedNext={isLinkedNext}
              isLinkedPrev={isLinkedPrev}
              onLinkNext={() => onLinkNext(index)}
              onUnlink={() => onUnlink(index)}
            />
          </ScaleDecorator>
        );
      }}
    />
  );
}
