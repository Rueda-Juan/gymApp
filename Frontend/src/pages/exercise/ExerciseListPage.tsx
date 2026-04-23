import React, { useState, useCallback, useRef } from 'react';
import { YStack, XStack } from 'tamagui';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { 
  AppText, 
  AppButton, 
  AppIcon, 
  SearchBar,
  Screen
} from '@/shared/ui';
import { ExerciseList, MuscleFilterSheet } from '@/entities/exercise';
import { useExerciseApi } from '@/shared/api';
import { useExerciseFiltering } from '@/shared/ui/hooks/useExerciseFiltering';
import { ROUTES } from '@/shared/constants/routes';
import type { Exercise } from '@kernel';

export default function ExerciseListPage() {
  const exerciseService = useExerciseApi();
  const muscleSheetRef = useRef<BottomSheetModal>(null);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');

  const loadExercises = useCallback(async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getAll();
      setExercises(data ?? []);
    } catch (error) {
      console.error('[ExerciseListPage] Failed to load exercises:', error);
    } finally {
      setLoading(false);
    }
  }, [exerciseService]);

  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [loadExercises])
  );

  const { filteredExercises } = useExerciseFiltering(exercises, search, selectedMuscle);

  const handleOpenMuscleFilter = () => {
    muscleSheetRef.current?.present();
  };

  const handleSelectMuscle = (muscle: string) => {
    setSelectedMuscle(muscle);
    muscleSheetRef.current?.dismiss();
  };

  return (
    <Screen safeAreaEdges={['top']}>
      <YStack flex={1}>
        <YStack paddingHorizontal="$xl" paddingTop="$md" gap="$md" paddingBottom="$md">
          <XStack justifyContent="space-between" alignItems="center">
            <AppText variant="titleMd">Ejercicios</AppText>
            <AppButton
              variant="outlined"
              icon={<AppIcon icon={Plus} size={20} color="primary" />}
              onPress={() => router.push(ROUTES.EXERCISE_CREATE)}
            />
          </XStack>

          <SearchBar
            placeholder="Buscar ejercicio..."
            value={search}
            onChangeText={setSearch}
          />

          <XStack gap="$sm">
             <AppButton
               label={selectedMuscle ? selectedMuscle.toUpperCase() : 'Todos los músculos'}
               variant="outlined"
               size="sm"
               onPress={handleOpenMuscleFilter}
             />
          </XStack>
        </YStack>

        <ExerciseList
          exercises={filteredExercises}
          loading={loading}
          onExercisePress={(ex) => router.push(`${ROUTES.EXERCISE_BROWSER}/${ex.id}`)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        />

        <MuscleFilterSheet
          ref={muscleSheetRef}
          selectedMuscle={selectedMuscle}
          onSelect={handleSelectMuscle}
          onClose={() => muscleSheetRef.current?.dismiss()}
        />
      </YStack>
    </Screen>
  );
}
