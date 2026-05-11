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
  Screen,
  IconButton
} from '@/shared/ui';
import { ExerciseList, MuscleFilterSheet, useExerciseDb } from '@/entities/exercise';
import { useExerciseFiltering } from '@/shared/ui/hooks/useExerciseFiltering';
import { ROUTES } from '@/shared/constants/routes';
import type { Exercise } from '@kernel';

export default function ExerciseListPage() {
  const { getExercises } = useExerciseDb();
  const muscleSheetRef = useRef<BottomSheetModal>(null);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');

  const loadExercises = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getExercises();
      setExercises(data ?? []);
    } catch (error) {
      console.error('[ExerciseListPage] Failed to load exercises:', error);
    } finally {
      setLoading(false);
    }
  }, [getExercises]);

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
    <Screen safeAreaEdges={['top','bottom','left','right']}>
      <YStack flex={1}>
        <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$md">
          <AppText variant="titleLg">Ejercicios</AppText>
          <IconButton
            icon={<AppIcon icon={Plus} color="color" size={24} />}
            size={44}
            backgroundColor="$primary"
            onPress={() => router.push(ROUTES.EXERCISE_CREATE)}
            accessibilityLabel="Crear ejercicio"
          />
        </XStack>

        <YStack paddingHorizontal="$lg" gap="$sm" paddingBottom="$md">
          <SearchBar
            placeholder="Buscar ejercicio..."
            value={search}
            onChangeText={setSearch}
          />

          <XStack>
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
