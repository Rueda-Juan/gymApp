import { XStack, YStack, useTheme, View } from 'tamagui';
import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Trash2, Calendar, Link2 } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { CardBase } from '@/components/ui/card';
import { Screen } from '@/components/ui/Screen';
import { useWorkout } from '@/hooks/useWorkout';
import { getExerciseName } from '@/utils/exercise';

interface WorkoutDetailSet {
  id: string;
  weight: number;
  reps: number;
  isCompleted?: boolean;
  completed?: boolean;
}

interface WorkoutDetailExercise {
  id: string;
  name?: string;
  nameEs?: string | null;
  supersetGroup?: number | null;
  exercise?: { name: string; nameEs?: string | null };
  sets: WorkoutDetailSet[];
}

interface WorkoutDetail {
  id: string;
  routineName: string | null;
  startTime: string | null;
  durationMinutes: number | null;
  durationSeconds: number | null;
  totalVolume: number | null;
  totalSets: number | null;
  exercises: WorkoutDetailExercise[];
}

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const workoutService = useWorkout();

  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadWorkout = async () => {
      try { 
        setWorkout((await workoutService.getWorkoutById(id as string)) as unknown as WorkoutDetail | null); 
      } catch (error) { 
        console.error(error);
        setLoadError(true); 
      } finally { 
        setLoading(false); 
      }
    };
    if (id) loadWorkout();
  }, [id, workoutService]);

  const handleDelete = () => {
    if (isDeleting) return;
    Alert.alert('Eliminar Registro', '¿Estás seguro de que quieres eliminar este entrenamiento del historial?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        style: 'destructive', 
        onPress: async () => {
          setIsDeleting(true);
          try { 
            await workoutService.deleteWorkout(id as string); 
            router.back(); 
          } catch { 
            Alert.alert('Error', 'No se pudo eliminar');
            setIsDeleting(false);
          }
        }
      },
    ]);
  };

  const computedVolume = useMemo(() => {
    if (!workout) return 0;
    if (workout.totalVolume != null) return workout.totalVolume;
    return (workout.exercises ?? []).reduce((acc: number, ex) =>
      acc + (ex.sets ?? []).reduce((sAcc: number, s) =>
        sAcc + ((s.isCompleted || s.completed ? s.weight * s.reps : 0)), 0), 0);
  }, [workout]);

  const computedSets = useMemo(() => {
    if (!workout) return 0;
    if (workout.totalSets != null) return workout.totalSets;
    return (workout.exercises ?? []).reduce((acc: number, ex) => acc + (ex.sets?.length ?? 0), 0);
  }, [workout]);

  const formattedDate = useMemo(() => {
    if (!workout?.startTime) return '—';
    try { return format(parseISO(workout.startTime), 'dd/MM/yyyy HH:mm'); } catch { return workout.startTime; }
  }, [workout?.startTime]);

  if (loading) {
    return (
      <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.primary?.val as string} />
        </YStack>
      </Screen>
    );
  }

  if (!workout) {
    return (
      <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <AppText variant="bodyMd">
            {loadError ? 'Error al cargar el entrenamiento' : 'Entrenamiento no encontrado'}
          </AppText>
        </YStack>
      </Screen>
    );
  }

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$md">
        <IconButton icon={<AppIcon icon={ChevronLeft} size={24} color="color" />} onPress={() => router.back()} />
        <AppText variant="titleSm">{workout.routineName || 'Entrenamiento'}</AppText>
        <IconButton icon={<AppIcon icon={Trash2} size={20} color="danger" />} onPress={handleDelete} />
      </XStack>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <CardBase padding="$md" marginBottom="$xl">
          <XStack justifyContent="space-between" marginBottom="$lg">
            <XStack alignItems="center" gap="$xs">
              <AppIcon icon={Calendar} size={16} color="textTertiary" />
              <AppText variant="bodySm" color="textSecondary">
                {formattedDate}
              </AppText>
            </XStack>
            <AppText variant="bodySm" color="textTertiary">
              {workout.durationMinutes != null
                ? `${workout.durationMinutes} min`
                : workout.durationSeconds != null
                  ? `${Math.round(workout.durationSeconds / 60)} min`
                  : '—'}
            </AppText>
          </XStack>

          <XStack>
            <YStack flex={1}>
              <AppText variant="label" color="textTertiary">VOLUMEN</AppText>
              <AppText variant="titleSm" marginTop="$xs">
                {`${computedVolume} kg`}
              </AppText>
            </YStack>
            <YStack flex={1}>
              <AppText variant="label" color="textTertiary">SETS</AppText>
              <AppText variant="titleSm" marginTop="$xs">
                {computedSets}
              </AppText>
            </YStack>
          </XStack>
        </CardBase>

        {/* Exercises List */}
        {workout.exercises.map((ex, exIdx) => {
          const exercises = workout.exercises;
          const inSuperset = ex.supersetGroup != null;
          const firstInGroup = inSuperset && (exIdx === 0 || exercises[exIdx - 1]?.supersetGroup !== ex.supersetGroup);
          const lastInGroup = inSuperset && (exIdx === exercises.length - 1 || exercises[exIdx + 1]?.supersetGroup !== ex.supersetGroup);

          return (
            <YStack key={ex.id}>
              {firstInGroup && (
                <XStack alignItems="center" gap="$xs" marginBottom="$xs">
                  <AppIcon icon={Link2} size={12} color="primary" />
                  <AppText variant="label" color="primary" fontWeight="700">SUPERSET</AppText>
                </XStack>
              )}
              <XStack marginBottom={inSuperset && !lastInGroup ? '$sm' : '$2xl'}>
                {inSuperset && (
                  <View
                    width={3}
                    backgroundColor="$primary"
                    borderTopLeftRadius={firstInGroup ? 4 : 0}
                    borderTopRightRadius={firstInGroup ? 4 : 0}
                    borderBottomLeftRadius={lastInGroup ? 4 : 0}
                    borderBottomRightRadius={lastInGroup ? 4 : 0}
                    marginRight="$sm"
                  />
                )}
                <YStack flex={1}>
                  <XStack justifyContent="space-between" marginBottom="$md">
                    <AppText variant="subtitle" color="primary">{getExerciseName(ex.exercise ?? { name: ex.name ?? '', nameEs: ex.nameEs }) || 'Ejercicio'}</AppText>
                  </XStack>

                  {ex.sets.map((set, setIndex) => (
                    <XStack key={set.id} justifyContent="space-between" paddingVertical="$sm" borderBottomWidth={1} borderBottomColor="$borderColor">
                      <AppText variant="bodyMd" color="textSecondary">SET {setIndex + 1}</AppText>
                      <AppText variant="bodyMd">{set.weight} kg x {set.reps}</AppText>
                    </XStack>
                  ))}
                </YStack>
              </XStack>
            </YStack>
          );
        })}

      </ScrollView>
    </Screen>
  );
}