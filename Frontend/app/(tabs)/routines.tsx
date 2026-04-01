import { XStack, YStack, useTheme } from 'tamagui';
import React, { useState, useCallback, useMemo } from 'react';
import { FlatList, Pressable, View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '@/components/ui/Screen';
import { Plus, Play } from 'lucide-react-native';
import { CardBase } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { useRoutines } from '@/hooks/useRoutines';
import { useWorkout } from '@/hooks/useWorkout';
import { router } from 'expo-router';
import { RoutineCardSkeleton } from '@/components/feedback/skeleton-loader';
import { getExerciseName } from '@/utils/exercise';
import { useStartWorkout } from '@/hooks/useStartWorkout';
import { SearchBar } from '@/components/ui/SearchBar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Routine, Workout } from 'backend/shared/types';

interface RoutineWithLastPerformed extends Routine {
  lastPerformed: string | null;
}

const FILTER_CHIPS = ['Todos', 'Recientes', 'Push', 'Pull', 'Piernas', 'Full Body'];
const MAX_ANIMATION_DELAY_MS = 500;

function formatRoutineExerciseNames(exercises: Routine['exercises']) {
  const segments: string[] = [];
  let i = 0;
  while (i < exercises.length) {
    const ex = exercises[i];
    const name = ex.exercise ? getExerciseName(ex.exercise) : '';
    if (ex.supersetGroup != null) {
      const groupNames = [name];
      let j = i + 1;
      while (j < exercises.length && exercises[j].supersetGroup === ex.supersetGroup) {
        groupNames.push(exercises[j].exercise ? getExerciseName(exercises[j].exercise!) : '');
        j++;
      }
      segments.push(groupNames.filter(Boolean).join(' + '));
      i = j;
    } else {
      if (name) segments.push(name);
      i++;
    }
  }
  return segments.join(', ');
}

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

  const attachLastPerformedToRoutine = useCallback((routine: Routine, history: Workout[]): RoutineWithLastPerformed => {
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
        workoutService.getHistory(30),
      ]);

      const routinesWithLastPerformed = data.map((routine) =>
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

  const handleStartWorkout = useStartWorkout();
  const theme = useTheme();

  const filteredRoutines = useMemo(() => routines.filter(r => {
    const lowerSearch = search.toLowerCase();
    const matchesSearch = r.name.toLowerCase().includes(lowerSearch);
    const matchesFilter = activeFilter === 'Todos' ||
      (activeFilter === 'Recientes' && r.lastPerformed != null) ||
      r.muscles?.some((m: string) => m.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  }), [routines, search, activeFilter]);

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
        style={{ height: 52 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          alignItems: 'center',
        }}
      >
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilter === chip;
          return (
            <Pressable key={chip} onPress={() => setActiveFilter(chip)}>
              <View
                style={{
                  minHeight: 36,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  marginRight: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: isActive ? theme.primary?.val as string : theme.borderColor?.val as string,
                  backgroundColor: isActive ? theme.primarySubtle?.val as string : theme.surfaceSecondary?.val as string,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    //fontWeight: isActive ? '700' : '500',
                    color: isActive ? theme.primary?.val as string : theme.textSecondary?.val as string,
                  }}
                >
                  {chip}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Lista de rutinas */}
      {loading ? (
        <YStack gap="$md" paddingHorizontal="$lg" paddingTop="$sm">
          <RoutineCardSkeleton />
          <RoutineCardSkeleton />
          <RoutineCardSkeleton />
        </YStack>
      ) : (
        <FlatList
          data={filteredRoutines}
          keyExtractor={(routine) => String(routine.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <YStack height={16} />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: routine, index }) => (
            <Animated.View entering={FadeInDown.delay(Math.min(index * 100, MAX_ANIMATION_DELAY_MS)).springify()}>
              <CardBase gap="$md" padding="$md">

                <XStack justifyContent="space-between" alignItems="stretch" flex={1}>
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => router.push({ pathname: '/routine/[id]' as any, params: { id: routine.id } })}
                  >
                    <YStack padding="$md" gap="$xs" flex={1}>
                      <AppText variant="label" color="textTertiary">
                        {routine.lastPerformed ? `Última vez: ${routine.lastPerformed}` : 'Aún sin datos'}
                      </AppText>
                      <AppText variant="titleMd">{routine.name}</AppText>
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

                  {/* Zona play — área táctil vertical derecha */}
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
                    >
                      <YStack width={48} height={48} alignItems="center" justifyContent="center">
                        <AppIcon icon={Play} color="primary" size={24} />
                      </YStack>
                    </Pressable>
                  </YStack>
                </XStack>

              </CardBase>
            </Animated.View>
          )}
          ListEmptyComponent={
            <YStack padding="$4xl" alignItems="center" marginTop="$xl">
              <AppText variant="bodyMd" color="textSecondary" textAlign="center">
                {routines.length === 0 ? 'Aún no tienes rutinas guardadas.' : 'No se encontraron rutinas'}
              </AppText>
              {routines.length === 0 && (
                <AppButton
                  label="Crear primera rutina"
                  onPress={() => router.push('/routine/create')}
                  marginTop="$lg"
                />
              )}
            </YStack>
          }
        />
      )}
    </Screen>
  );
}