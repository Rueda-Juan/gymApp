import { XStack, YStack } from 'tamagui';
import React, { useState, useCallback, useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '@/components/ui/Screen';
import { Plus, Play, Dumbbell } from 'lucide-react-native';
import { CardBase } from '@/components/ui/Card';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/Badge';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { useRoutines } from '@/hooks/domain/useRoutines';
import { useWorkout } from '@/hooks/domain/useWorkout';
import { router } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { RoutineCardSkeleton } from '@/components/cards/Loaders';
import { ContentReveal } from '@/components/feedback/ContentReveal';
import { EmptyStateIcon } from '@/components/feedback/EmptyStateIcon';
import { useStartWorkout } from '@/hooks/domain/useStartWorkout';
import { SearchBar } from '@/components/ui/SearchBar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { animatedCardShadow, elevation } from '@/constants/elevation';
import Toast from 'react-native-toast-message';
import type { Routine, Workout } from 'backend/shared/types';
import { formatRoutineExerciseNames } from '@/utils/routine';

interface RoutineWithLastPerformed extends Routine {
  lastPerformed: string | null;
}

const STATIC_FILTER_CHIPS = ['Todos', 'Recientes'] as const;
const MAX_ANIMATION_DELAY_MS = 500;
const CHIP_BAR_HEIGHT = 52;
const LIST_BOTTOM_PADDING = 100;

const ItemSeparator = () => <YStack height={16} />;

export default function RoutinesScreen() {
  const routineService = useRoutines();
  const workoutService = useWorkout();
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
        if (!existing || new Date(workout.date) > new Date(existing.date)) {
          latestHistoryByRoutine.set(workout.routineId, workout);
        }
      }

      const routinesWithLastPerformed = data.map((routine: Routine) => {
        const lastWorkout = latestHistoryByRoutine.get(routine.id);
        return {
          ...routine,
          lastPerformed: lastWorkout ? formatLastPerformed(lastWorkout.date) : null,
        };
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

  const handleStartWorkout = useStartWorkout();

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

  const renderRoutineCard = useCallback(({ item: routine, index }: { item: RoutineWithLastPerformed; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 100, MAX_ANIMATION_DELAY_MS)).springify()}
      style={animatedCardShadow}
    >
      <CardBase gap="$md" padding="$md" {...elevation.flat}>
        <XStack justifyContent="space-between" alignItems="stretch" flex={1}>
          <Pressable
            style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.7 : 1 })}
            onPress={() => router.push(`/routine/${routine.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Abrir rutina ${routine.name}`}
          >
            <YStack padding="$md" gap="$xs" flex={1}>
              <AppText variant="label" color="textTertiary">
                {routine.lastPerformed ? `Última vez: ${routine.lastPerformed}` : 'Aún sin datos'}
              </AppText>
              <AppText variant="titleMd" numberOfLines={1}>{routine.name}</AppText>
              <AppText variant="bodyMd" color="textSecondary" numberOfLines={2}>
                {formatRoutineExerciseNames(routine.exercises)}
              </AppText>
              {routine.muscles && routine.muscles.length > 0 && (
                <XStack flexWrap="wrap" gap="$sm" marginTop="$sm">
                  {routine.muscles.map((muscle: string) => (
                    <Badge key={muscle} label={muscle} variant="primary" />
                  ))}
                </XStack>
              )}
            </YStack>
          </Pressable>

          <YStack
            width={64}
            alignSelf="stretch"
            alignItems="center"
            justifyContent="center"
            borderLeftWidth={1}
            borderLeftColor="$borderColor"
          >
            <Pressable
              onPress={() => handleStartWorkout(routine)}
              accessibilityLabel={`Iniciar ${routine.name}`}
              accessibilityRole="button"
            >
              <YStack width={48} height={48} alignItems="center" justifyContent="center">
                <AppIcon icon={Play} color="primary" size={24} />
              </YStack>
            </Pressable>
          </YStack>
        </XStack>
      </CardBase>
    </Animated.View>
  ), [handleStartWorkout]);

  const renderEmptyList = useCallback(() => (
    <YStack padding="$4xl" alignItems="center" marginTop="$xl">
      <EmptyStateIcon icon={Dumbbell} size={48} color="textTertiary" />
      <AppText variant="bodyMd" color="textSecondary" textAlign="center" marginTop="$md">
        {routines.length === 0 ? 'Aún no tienes rutinas guardadas.' : 'No se encontraron rutinas'}
      </AppText>
      {routines.length === 0 && (
        <AppButton
          label="Crear primera rutina"
          onPress={() => router.push(ROUTES.ROUTINE_CREATE)}
          marginTop="$lg"
        />
      )}
    </YStack>
  ), [routines.length]);

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Rutinas</AppText>
        <IconButton
          icon={<AppIcon icon={Plus} color="background" size={24} />}
          size={44}
          backgroundColor="$primary"
          onPress={() => router.push(ROUTES.ROUTINE_CREATE)}
          accessibilityLabel="Crear rutina"
        />
      </XStack>

      {/* Barra de búsqueda */}
      <YStack paddingHorizontal="$lg" paddingBottom="$sm">
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar rutinas..."
        />
      </YStack>

      {/* Chips de filtro */}
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

      {/* Lista de rutinas */}
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
    </Screen>
  );
}