import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { Search, X } from 'lucide-react-native';
import { XStack, useTheme } from 'tamagui';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { EmptyState } from '@/components/ui/EmptyState';
import { getExerciseName } from '@/utils/exercise';
import { useBottomSheetStyles } from '@/hooks/ui/useBottomSheetStyles';
import { FONT_SCALE } from '@/tamagui.config';
import type { Exercise } from 'backend/shared/types';

const SHEET_PADDING = 12;
const SEARCH_INPUT_HEIGHT = 48;
const UNKNOWN_MUSCLE_LABEL = 'Sin datos';

interface ActiveWorkoutExercisePickerSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  search: string;
  filteredExercises: Exercise[];
  onChangeSearch: (value: string) => void;
  onClose: () => void;
  onSelectExercise: (item: Exercise) => void;
}

export function ActiveWorkoutExercisePickerSheet({
  sheetRef,
  search,
  filteredExercises,
  onChangeSearch,
  onClose,
  onSelectExercise,
}: ActiveWorkoutExercisePickerSheetProps) {
  const theme = useTheme();
  const { backgroundStyle, handleIndicatorStyle } = useBottomSheetStyles();

  const keyExtractor = useCallback((item: Exercise) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => {
      const muscleLabel = item.primaryMuscles?.length
        ? item.primaryMuscles.join(', ')
        : UNKNOWN_MUSCLE_LABEL;

      return (
        <Pressable
          onPress={() => onSelectExercise(item)}
          accessibilityRole="button"
          accessibilityLabel={getExerciseName(item)}
        >
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <XStack flex={1}>
              <AppText variant="subtitle">{getExerciseName(item)}</AppText>
            </XStack>
            <AppText variant="label" color="textSecondary" flex={1.2} numberOfLines={1}>
              {muscleLabel} · {item.equipment}
            </AppText>
          </XStack>
        </Pressable>
      );
    },
    [onSelectExercise],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['50%', '90%']}
      enablePanDownToClose
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
    >
      <BottomSheetView style={{ flex: 1, padding: SHEET_PADDING }}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
          <AppText variant="titleSm">Añadir Ejercicio</AppText>
          <Pressable onPress={onClose} accessibilityLabel="Cerrar">
            <AppIcon icon={X} color="textSecondary" size={24} />
          </Pressable>
        </XStack>

        <XStack
          alignItems="center"
          gap="$sm"
          height={SEARCH_INPUT_HEIGHT}
          borderRadius="$lg"
          paddingHorizontal="$md"
          backgroundColor="$surface"
          marginBottom="$md"
        >
          <AppIcon icon={Search} color="textTertiary" size={20} />
          <BottomSheetTextInput
            style={{ flex: 1, color: theme.color?.val as string, fontSize: FONT_SCALE.sizes[3] }}
            placeholder="Ej. Press de banca..."
            placeholderTextColor={theme.textTertiary?.val as string}
            value={search}
            onChangeText={onChangeSearch}
            accessibilityLabel="Buscar ejercicio"
          />
        </XStack>

        <BottomSheetFlatList
          data={filteredExercises}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          removeClippedSubviews
          maxToRenderPerBatch={12}
          windowSize={8}
          initialNumToRender={10}
          ListEmptyComponent={
            <EmptyState
              icon={Search}
              title="Sin resultados"
              description="No se encontraron ejercicios con ese filtro"
            />
          }
        />
      </BottomSheetView>
    </BottomSheet>
  );
}