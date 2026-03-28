import { XStack, YStack, ScrollView } from 'tamagui';
import React, { useState, useCallback } from 'react';
import { TextInput, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '@/components/ui/Screen';
import { Search, Plus, Play } from 'lucide-react-native';
import { CardBase } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { useRoutines } from '@/hooks/useRoutines';
import { useWorkout } from '@/hooks/useWorkout';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { router } from 'expo-router';
import { RoutineCardSkeleton } from '@/components/feedback/skeleton-loader';
import { getExerciseName } from '@/utils/exercise';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RoutinesScreen() {
  const routineService = useRoutines();
  const workoutService = useWorkout();
  const { startWorkout } = useActiveWorkout();

  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const formatLastPerformed = useCallback((date: string | Date) =>
    formatDistanceToNow(new Date(date), { addSuffix: true, locale: es }),
  []);

  const attachLastPerformedToRoutine = useCallback((routine: any, history: any[]) => {
    const routineHistory = history.filter((workout) => workout.routineId === routine.id);
    if (!routineHistory.length) {
      return { ...routine, lastPerformed: null };
    }

    const lastWorkout = routineHistory.reduce((latest, workout) => {
      return new Date(workout.date) > new Date(latest.date) ? workout : latest;
    }, routineHistory[0]);

    return {
      ...routine,
      lastPerformed: formatLastPerformed(lastWorkout.date),
    };
  }, [formatLastPerformed]);

  const loadRoutines = useCallback(async () => {
    try {
      setLoading(true);
      const [data, history] = await Promise.all([
        routineService.getRoutines(),
        workoutService.getHistory(100),
      ]);

      const routinesWithLastPerformed = data.map((routine: any) =>
        attachLastPerformedToRoutine(routine, history),
      );

      setRoutines(routinesWithLastPerformed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [routineService, workoutService, attachLastPerformedToRoutine]);

  useFocusEffect(
    useCallback(() => {
      void loadRoutines();
    }, [loadRoutines])
  );

  const handleStartWorkout = async (routine: any) => {
    try {
      const workout = await workoutService.startWorkout(routine.id);

      const initialExercises = routine.exercises.map((re: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        exerciseId: re.exercise.id,
        name: re.exercise.name,
        nameEs: re.exercise.nameEs,
        sets: Array.from({ length: re.targetSets }).map(() => ({
          id: Math.random().toString(36).substr(2, 9),
          weight: 0,
          reps: parseInt(re.maxReps) || 0,
          isCompleted: false,
          type: 'normal' as const,
        })),
      }));

      startWorkout(workout.id, routine.id, routine.name, initialExercises);
      router.push({ pathname: '/(workouts)/[active]' as any, params: { active: workout.id } });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRoutines = routines.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Rutinas</AppText>
        <IconButton
          icon={<AppIcon icon={Plus} color="background" size={24} />}
          size={44}
          backgroundColor="$primary"
          onPress={() => router.push('/routine/create')}
        />
      </XStack>

      {/* Barra de búsqueda */}
      <YStack paddingHorizontal="$lg" paddingBottom="$md">
        <XStack
          alignItems="center"
          gap="$sm"
          height={48}
          borderRadius="$lg"
          borderWidth={1}
          paddingHorizontal="$md"
          backgroundColor="$surface"
          borderColor="$borderColor"
        >
          <AppIcon icon={Search} color="textTertiary" size={20} />
          <TextInput
            style={{ flex: 1, color: '#FFFFFF', fontSize: 16, fontWeight: '500' }} // Asumiendo color puro en tu tema para el input
            placeholder="Buscar rutinas..."
            placeholderTextColor="#808080" // Valor por defecto si theme.textTertiary no está disponible directo en style
            value={search}
            onChangeText={setSearch}
          />
        </XStack>
      </YStack>

      {/* Lista de rutinas */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingTop: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <YStack gap="$md">
            <RoutineCardSkeleton />
            <RoutineCardSkeleton />
            <RoutineCardSkeleton />
          </YStack>
        ) : (
          filteredRoutines.map((routine, index) => (
            <Animated.View key={routine.id} entering={FadeInDown.delay(index * 100).springify()}>
              <CardBase gap="$md" padding="$md">

                <XStack justifyContent="space-between" alignItems="center">
                  <AppText variant="label" color="textTertiary">
                    {routine.lastPerformed ? `ÚLTIMA VEZ: ${routine.lastPerformed}` : 'Aún sin datos de último entrenamiento'}
                  </AppText>
                </XStack>

                <Pressable onPress={() => router.push({ pathname: '/routine/[id]' as any, params: { id: routine.id } })}>
                  <XStack alignItems="center" gap="$md" marginBottom="$xs">
                    <YStack gap="$xs">
                      <AppText variant="titleMd">{routine.name}</AppText>
                      <AppText variant="bodyMd" color="textSecondary" numberOfLines={2}>
                        {routine.exercises.map((e: any) => getExerciseName(e.exercise)).join(', ')}
                      </AppText>

                    </YStack>
                    <IconButton
                      icon={<AppIcon icon={Play} color="primary" fill="primary" size={20} />}
                      backgroundColor="$primarySubtle"
                      onPress={() => handleStartWorkout(routine)}
                    />
                  </XStack>

                  {routine.muscles && routine.muscles.length > 0 && (
                    <XStack flexWrap="wrap" gap="$sm" marginTop="$sm">
                      {routine.muscles.map((muscle: string) => (
                        <Badge key={muscle} label={muscle} variant="primary" />
                      ))}
                    </XStack>
                  )}
                </Pressable>

              </CardBase>
            </Animated.View>
          ))
        )}

        {filteredRoutines.length === 0 && !loading && (
          <YStack padding="$4xl" alignItems="center" marginTop="$xl">
            <AppText variant="bodyMd" color="textSecondary">No se encontraron rutinas</AppText>
          </YStack>
        )}
      </ScrollView>
    </Screen>
  );
}