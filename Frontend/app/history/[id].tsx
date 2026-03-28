import { XStack, YStack, useTheme } from 'tamagui';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Trash2, Calendar } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { CardBase } from '@/components/ui/card';
import { Screen } from '@/components/ui/Screen';
import { useWorkout } from '@/hooks/useWorkout';
import { getExerciseName } from '@/utils/exercise';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const workoutService = useWorkout();

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      try { 
        setWorkout(await workoutService.getWorkoutById(id as string)); 
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    if (id) loadWorkout();
  }, [id, workoutService]);

  const handleDelete = () => {
    Alert.alert('Eliminar Registro', '¿Estás seguro de que quieres eliminar este entrenamiento del historial?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        style: 'destructive', 
        onPress: async () => {
          try { 
            await workoutService.deleteWorkout(id as string); 
            router.back(); 
          } catch { 
            Alert.alert('Error', 'No se pudo eliminar'); 
          }
        }
      },
    ]);
  };

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
          <AppText variant="bodyMd">Entrenamiento no encontrado</AppText>
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
              <AppText variant="bodySm" color="textSecondary">{workout.startTime}</AppText>
            </XStack>
            <AppText variant="bodySm" color="textTertiary">{workout.durationMinutes} min</AppText>
          </XStack>

          <XStack>
            <YStack flex={1}>
              <AppText variant="label" color="textTertiary">VOLUMEN</AppText>
              <AppText variant="titleSm" marginTop="$xs">{workout.totalVolume} kg</AppText>
            </YStack>
            <YStack flex={1}>
              <AppText variant="label" color="textTertiary">SETS</AppText>
              <AppText variant="titleSm" marginTop="$xs">{workout.totalSets || 0}</AppText>
            </YStack>
          </XStack>
        </CardBase>

        {/* Exercises List */}
        {workout.exercises.map((ex: any, idx: number) => (
          <YStack key={idx} marginBottom="$2xl">
            <XStack justifyContent="space-between" marginBottom="$md">
              <AppText variant="subtitle" color="primary">{getExerciseName(ex.exercise)}</AppText>
            </XStack>

            {ex.sets.map((set: any, sIdx: number) => (
              <XStack key={sIdx} justifyContent="space-between" paddingVertical="$sm" borderBottomWidth={1} borderBottomColor="$borderColor">
                <AppText variant="bodyMd" color="textSecondary">SET {sIdx + 1}</AppText>
                <AppText variant="bodyMd">{set.weight} kg x {set.reps}</AppText>
              </XStack>
            ))}
          </YStack>
        ))}

      </ScrollView>
    </Screen>
  );
}