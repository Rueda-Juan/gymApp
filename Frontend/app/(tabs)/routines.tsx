import { XStack, YStack, ScrollView, TextInput, useTheme } from 'tamagui';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Search, Plus, Play } from 'lucide-react-native';
import { CardBase } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/AppButton';
import { useRoutines } from '@/hooks/useRoutines';
import { useWorkout } from '@/hooks/useWorkout';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { router } from 'expo-router';
import { RoutineCardSkeleton } from '@/components/feedback/skeleton-loader';
import { getExerciseName } from '@/utils/exercise';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RoutinesScreen() {
  const theme = useTheme();
  const routineService = useRoutines();
  const workoutService = useWorkout();
  const { startWorkout } = useActiveWorkout();

  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadRoutines(); }, []);

  const loadRoutines = async () => {
    try {
      const data = await routineService.getAll();
      setRoutines(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
      router.push('/(workouts)/[active]');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRoutines = routines.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Rutinas</AppText>
        <IconButton
          icon={<Plus color="#000" size={24} />}
          size={44}
          backgroundColor={theme.primary?.val}
          onPress={() => router.push('/routine/create')}
        />
      </XStack>

      <YStack paddingHorizontal="$xl" paddingBottom="$md">
        <XStack
          alignItems="center"
          gap="$sm"
          style={{
            height: 48, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12,
            backgroundColor: theme.surface?.val, borderColor: theme.borderColor?.val,
          }}
        >
          <Search color={theme.textTertiary?.val} size={20} />
          <TextInput
            style={{ flex: 1, color: theme.color?.val, fontSize: 16, fontWeight: '500', marginLeft: 8 }}
            placeholder="Buscar rutinas..."
            placeholderTextColor={theme.textTertiary?.val}
            value={search}
            onChangeText={setSearch}
          />
        </XStack>
      </YStack>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingTop: 8 }}
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
              <CardBase gap="$md">
                <XStack justifyContent="space-between" alignItems="center">
                  <AppText variant="label" color="textTertiary">
                    {routine.lastPerformed ? `ÃšLTIMA VEZ: ${routine.lastPerformed}` : 'SIN ENTRENAR AÃšN'}
                  </AppText>
                  <IconButton
                    icon={<Play color={theme.primary?.val} size={20} fill={theme.primary?.val} />}
                    backgroundColor={theme.primarySubtle?.val}
                    onPress={() => handleStartWorkout(routine)}
                  />
                </XStack>
                <TouchableOpacity onPress={() => router.push({ pathname: '/routine/[id]' as any, params: { id: routine.id } })}>
                  <YStack gap="$xs">
                    <AppText variant="subtitle">{routine.name}</AppText>
                    <AppText variant="label" color="textSecondary">
                      {routine.exercises.map((e: any) => getExerciseName(e.exercise)).join(', ')}
                    </AppText>
                  </YStack>
                  <XStack flexWrap="wrap" gap="$sm" marginTop="$sm">
                    {routine.muscles?.map((muscle: string) => (
                      <Badge key={muscle} label={muscle} variant="primary" size="sm" />
                    ))}
                  </XStack>
                </TouchableOpacity>
              </CardBase>
            </Animated.View>
          ))
        )}

        {filteredRoutines.length === 0 && !loading && (
          <YStack padding="$4xl" alignItems="center">
            <AppText variant="bodyMd" color="textSecondary">No se encontraron rutinas</AppText>
          </YStack>
        )}

        <YStack height={100} />
      </ScrollView>
    </Screen>
  );
}
