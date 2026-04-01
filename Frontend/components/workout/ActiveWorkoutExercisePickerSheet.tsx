import React from 'react';
import { Pressable } from 'react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { Search, X } from 'lucide-react-native';
import { XStack, useTheme } from 'tamagui';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { getExerciseName } from '@/utils/exercise';
import { FONT_SCALE } from '@/tamagui.config';
import type { Exercise } from 'backend/shared/types';

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

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['50%', '90%']}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: theme.surfaceSecondary?.val as string }}
      handleIndicatorStyle={{ backgroundColor: theme.textTertiary?.val as string }}
    >
      <BottomSheetView style={{ flex: 1, padding: 12 }}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
          <AppText variant="titleSm">Añadir Ejercicio</AppText>
          <Pressable onPress={onClose} accessibilityLabel="Cerrar">
            <AppIcon icon={X} color="textSecondary" size={24} />
          </Pressable>
        </XStack>

        <XStack
          alignItems="center"
          gap="$sm"
          height={48}
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
          />
        </XStack>

        <BottomSheetFlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Exercise }) => (
            <Pressable onPress={() => onSelectExercise(item)}>
              <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
                <XStack flex={1}>
                  <AppText variant="subtitle">{getExerciseName(item)}</AppText>
                </XStack>
                <AppText variant="label" color="textSecondary" flex={1.2} numberOfLines={1}>
                  {item.primaryMuscles?.join(', ') || 'other'} · {item.equipment}
                </AppText>
              </XStack>
            </Pressable>
          )}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}