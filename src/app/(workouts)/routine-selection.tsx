import { XStack, YStack } from 'tamagui';
import React, { useState, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { Dumbbell, X } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Screen, AppText, AppIcon, IconButton, ToggleChip, SearchBar } from '@/shared/ui';
import { RoutineCard, useRoutineDb } from '@/entities/routine';
import { useWorkoutDb } from '@/entities/workout';
import { RoutineCardSkeleton } from '@/shared/ui/layout/Loaders';
import { ContentReveal, EmptyStateIcon } from '@/shared/ui/feedback';
import { useStartWorkout } from '@/features/activeWorkout';
import type { Workout, RoutineWithLastPerformed, RoutineExerciseWithExercise, RoutineWithExercises } from '@kernel';

const STATIC_FILTER_CHIPS = ['Todos', 'Recientes'] as const;
const CHIP_BAR_HEIGHT = 52;
const LIST_BOTTOM_PADDING = 100;

const ItemSeparator = () => <YStack height={16} />;

export default function RoutineSelectionPage() {
  const routineService = useRoutineDb();
  const workoutService = useWorkoutDb();
  const [routines, setRoutines] = useState<RoutineWithLastPerformed[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const formatLastPerformed = useCallback((date: string | Date) =>
    formatDistanceToNow(new Date(date), { addSuffix: true, locale: es }),
  []);

  const loadRoutines = useCallback(async (mountedRef?: { current: boolean }) => {
    try {
      if (mountedRef?.current ?? true) setLoading(true);
      const data = await routineService.getRoutines();
      const history = await workoutService.getHistory(30);

      const latestHistoryByRoutine = new Map<string, Workout>();
      for (const workout of history) {
        if (!workout.routineId) continue;
        const existing = latestHistoryByRoutine.get(workout.routineId);
        const wDate = new Date(workout.date);
        const eDate = existing ? new Date(existing.date) : new Date(0);
        if (!existing || wDate > eDate) {
          latestHistoryByRoutine.set(workout.routineId, workout);
        }
      }

      const routinesWithLastPerformed = data.map((routine: RoutineWithExercises) => {
        const lastWorkout = latestHistoryByRoutine.get(routine.id);
        const exercises = (routine.routineExercises || []) as RoutineExerciseWithExercise[];
        const muscles = Array.from(new Set(
          exercises.map((re: RoutineExerciseWithExercise) => re.exercise?.primaryMuscle).filter(Boolean)
        )) as string[];

        return {
          ...routine,
          lastPerformed: lastWorkout ? formatLastPerformed(lastWorkout.date) : null,
          exercises,
          muscles,
        } as RoutineWithLastPerformed;
      });

      if (mountedRef?.current ?? true) setRoutines(routinesWithLastPerformed);
    } catch (error) {
      console.error('[Routines] Failed to load:', error);
      Toast.show({ type: 'error', text1: 'Error al cargar rutinas', position: 'top' });
    } finally {
      if (mountedRef?.current ?? true) setLoading(false);
    }
  }, [routineService, workoutService, formatLastPerformed]);

  useFocusEffect(
    useCallback(() => {
      const mountedRef = { current: true };
      void loadRoutines(mountedRef);
      return () => { mountedRef.current = false; };
    }, [loadRoutines])
  );

  const handleStartWorkoutRaw = useStartWorkout();
  
  const handleStartWorkout = useCallback((routine: RoutineWithLastPerformed) => {
    // Start workout right away when selected
    // @ts-expect-error - compatibility with startable routine
    handleStartWorkoutRaw(routine);
    // the start workout hook handles the navigation usually, but let's make sure
  }, [handleStartWorkoutRaw]);

  const extractRoutineKey = useCallback((routine: RoutineWithLastPerformed) => String(routine.id), []);

  const filterChips = useMemo(() => {
    const muscleChips = [...new Set(routines.flatMap(r => r.muscles ?? []))].sort();
    return [...STATIC_FILTER_CHIPS, ...muscleChips];
  }, [routines]);

  const filteredRoutines = useMemo(() => routines.filter(r => {
    const lowerSearch = search.toLowerCase();
    const matchesSearch = r.name.toLowerCase().includes(lowerSearch);
    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Recientes' && r.lastPerformed != null) ||
      r.muscles?.some((muscle: string) => muscle === activeFilter);
    return matchesSearch && matchesFilter;
  }), [routines, search, activeFilter]);

  // When tapping the card, start the workout instead of opening details
  const renderRoutineCard = useCallback(({ item: routine, index }: { item: RoutineWithLastPerformed; index: number }) => (
    <RoutineCard
      routine={routine}
      index={index}
      onOpen={() => handleStartWorkout(routine)} // changed to onStart
      onStart={handleStartWorkout}
      testID={`routine-card-${index}`}
    />
  ), [handleStartWorkout]);

  const renderEmptyList = useCallback(() => (
    <YStack padding="$4xl" alignItems="center" marginTop="$xl">
      <EmptyStateIcon icon={Dumbbell} size={48} color="textTertiary" />
      <AppText variant="bodyMd" color="textSecondary" textAlign="center" marginTop="$md">
        {routines.length === 0 ? 'Aún no tienes rutinas guardadas.' : 'No se encontraron rutinas'}
      </AppText>
    </YStack>
  ), [routines.length]);

  return (
    <Screen safeAreaEdges={['top','bottom','left','right']}>
      <YStack flex={1}>
        <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$md">
          <IconButton
            icon={<AppIcon icon={X} color="textSecondary" size={24} />}
            onPress={() => router.back()}
            accessibilityLabel="Cerrar"
          />
          <AppText variant="titleSm">Seleccionar Rutina</AppText>
          <YStack width={44} /> {/* Placeholder for alignment */}
        </XStack>

        <YStack paddingHorizontal="$lg" paddingBottom="$sm">
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar rutinas..."
          />
        </YStack>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ height: CHIP_BAR_HEIGHT, flexGrow: 0, flexShrink: 0 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            alignItems: 'center',
            gap: 8,
          }}
        >
          {filterChips.map((chip) => (
            <ToggleChip
              key={chip}
              label={chip}
              isActive={activeFilter === chip}
              onPress={() => setActiveFilter(chip)}
              accessibilityLabel={`Filtro ${chip}`}
            />
          ))}
        </ScrollView>

        <ContentReveal
          loading={loading}
          skeleton={
            <YStack gap="$md" paddingHorizontal="$lg" paddingTop="$sm">
              <RoutineCardSkeleton />
              <RoutineCardSkeleton />
              <RoutineCardSkeleton />
            </YStack>
          }
        >
          <FlashList
            data={filteredRoutines}
            keyExtractor={extractRoutineKey}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: LIST_BOTTOM_PADDING }}
            ItemSeparatorComponent={ItemSeparator}
            showsVerticalScrollIndicator={false}
            renderItem={renderRoutineCard}
            ListEmptyComponent={renderEmptyList}
          />
        </ContentReveal>
      </YStack>
    </Screen>
  );
}

