import React, { useState, useCallback, useEffect } from 'react';
import { YStack, XStack } from 'tamagui';
import { router, useLocalSearchParams } from 'expo-router';

import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';

import { 
  AppText, 
  SearchBar,
  AppButton
} from '@/shared/ui';
import { ExerciseList, useExerciseDb } from '@/entities/exercise';
import { useExerciseFiltering } from '@/shared/ui/hooks/useExerciseFiltering';
import { useRoutineStore } from '@/entities/routine';
import type { Exercise } from '@kernel';

const BACKDROP_COLOR = 'rgba(0,0,0,0.65)';

export default function ExerciseBrowserModal() {
  const { target } = useLocalSearchParams<{ target: string }>();
  const exerciseService = useExerciseDb();
  const addExercise = useRoutineStore(s => s.addExercise);
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    exerciseService.getExercises().then(data => {
      if (mounted) {
        setExercises(data ?? []);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [exerciseService]);

  const { filteredExercises } = useExerciseFiltering(exercises, search, '');

  const handleSelect = useCallback((ex: Exercise) => {
    if (target === 'routine') {
      addExercise({
        id: ex.id,
        name: ex.name,
        muscle: ex.primaryMuscles?.[0] || 'other'
      });
      router.back();
    }
  }, [target, addExercise]);

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeIn} 
        exiting={FadeOut} 
        style={styles.absoluteFill}
      >
        <Pressable style={styles.backdrop} onPress={() => router.back()} />
      </Animated.View>

      <Animated.View 
        entering={SlideInDown}
        style={styles.modalContent}
      >
        <YStack 
          backgroundColor="$surface" 
          flex={1} 
          borderTopLeftRadius={24} 
          borderTopRightRadius={24}
          overflow="hidden"
        >
          <YStack padding="$xl" gap="$md" borderBottomWidth={1} borderBottomColor="$borderColor">
            <XStack justifyContent="space-between" alignItems="center">
              <AppText variant="titleMd">Seleccionar Ejercicio</AppText>
              <AppButton 
                testID="confirm-add-exercise" 
                label="Listo" 
                size="sm" 
                onPress={() => router.back()} 
              />
            </XStack>
            <SearchBar
              placeholder="Buscar ejercicio..."
              value={search}
              onChangeText={setSearch}
            />
          </YStack>

          <ExerciseList
            exercises={filteredExercises}
            loading={loading}
            onExercisePress={handleSelect}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
          />
        </YStack>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  absoluteFill: { ...StyleSheet.absoluteFillObject },
  backdrop: { flex: 1, backgroundColor: BACKDROP_COLOR },
  modalContent: { 
    flex: 1, 
    marginTop: 80,
  }
});

