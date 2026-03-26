import { XStack, YStack } from 'tamagui';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@tamagui/core';

import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Trash2, Calendar } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/Screen';
import { useWorkout } from '@/hooks/useWorkout';
import { getExerciseName } from '@/utils/exercise';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const workoutService = useWorkout();

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) loadWorkout(); }, [id]);

  const loadWorkout = async () => {
    try { setWorkout(await workoutService.getById(id as string)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Registro', '¿Estás seguro de que quieres eliminar este entrenamiento del historial?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try { await workoutService.deleteWorkout(id as string); router.back(); }
        catch (e) { Alert.alert('Error', 'No se pudo eliminar'); }
      }},
    ]);
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.primary?.val} />
      </Screen>
    );
  }

  if (!workout) {
    return (
      <Screen>
        <AppText variant="bodyMd">Entrenamiento no encontrado</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <XStack justifyContent="space-between" alignItems="center" padding="$lg">
        <IconButton icon={<ChevronLeft size={24} color={theme.color?.val} />} onPress={() => router.back()} />
        <AppText variant="titleSm">{workout.routineName || 'Entrenamiento'}</AppText>
        <IconButton icon={<Trash2 size={20} color={theme.error?.val} />} onPress={handleDelete} />
      </XStack>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Summary Card */}
        <Card style={{ marginBottom: 24 }}>
          <XStack justifyContent="space-between" marginBottom="$lg">
            <XStack alignItems="center">
              <Calendar size={16} color={theme.textTertiary?.val} />
              <AppText variant="bodySm" color="textSecondary" style={{ marginLeft: 8 }}>{workout.startTime}</AppText>
            </XStack>
            <AppText variant="bodySm" color="textTertiary">{workout.durationMinutes} min</AppText>
          </XStack>

          <XStack>
            <YStack flex={1}>
              <AppText variant="label" color="textTertiary">VOLUMEN</AppText>
              <AppText variant="titleSm" style={{ marginTop: 4 }}>{workout.totalVolume} kg</AppText>
            </YStack>
            <YStack flex={1}>
              <AppText variant="label" color="textTertiary">SETS</AppText>
              <AppText variant="titleSm" style={{ marginTop: 4 }}>{workout.totalSets || 0}</AppText>
            </YStack>
          </XStack>
        </Card>

        {/* Exercises List */}
        {workout.exercises.map((ex: any, idx: number) => (
          <YStack key={idx} marginBottom="$2xl">
            <XStack justifyContent="space-between" marginBottom="$md">
              <AppText variant="subtitle" color="primary">{getExerciseName(ex.exercise)}</AppText>
            </XStack>

            {ex.sets.map((set: any, sIdx: number) => (
              <XStack key={sIdx} justifyContent="space-between" paddingVertical="$2" borderBottomWidth={0.5} borderBottomColor="$borderColor">
                <AppText variant="bodyMd" color="textSecondary">SET {sIdx + 1}</AppText>
                <AppText variant="bodyMd">{set.weight} kg x {set.reps}</AppText>
              </XStack>
            ))}
          </YStack>
        ))}

        <YStack height={100} />
      </ScrollView>
    </Screen>
  );
}
