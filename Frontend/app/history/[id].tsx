import { XStack, YStack, useTheme, View } from 'tamagui';
import React from 'react';
import { ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Trash2, Calendar, Link2 } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { CardBase } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { useWorkout } from '@/hooks/domain/useWorkout';
import { useWorkoutDetail } from '@/hooks/domain/useWorkoutDetail';
import { useWorkoutStats } from '@/hooks/domain/useWorkoutStats';
import { getExerciseName } from '@/utils/exercise';
import type { WorkoutSetDTO } from '@shared';

const SCROLL_BOTTOM_INSET = 100;

interface SupersetBarProps {
  firstInGroup: boolean;
  lastInGroup: boolean;
}

function SupersetBar({ firstInGroup, lastInGroup }: SupersetBarProps) {
  return (
    <View
      width={3}
      backgroundColor="$primary"
      borderTopLeftRadius={firstInGroup ? 4 : 0}
      borderTopRightRadius={firstInGroup ? 4 : 0}
      borderBottomLeftRadius={lastInGroup ? 4 : 0}
      borderBottomRightRadius={lastInGroup ? 4 : 0}
      marginRight="$sm"
    />
  );
}

function SetRow({ set, index }: { set: WorkoutSetDTO; index: number }) {
  return (
    <XStack
      key={set.id}
      justifyContent="space-between"
      paddingVertical="$sm"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      accessibilityLabel={`Set ${index + 1}: ${set.weight} kg por ${set.reps} repeticiones`}
    >
      <AppText variant="bodyMd" color="textSecondary">SET {index + 1}</AppText>
      <AppText variant="bodyMd">{set.weight} kg x {set.reps}</AppText>
    </XStack>
  );
}

function ExerciseBlock({
  exercise,
  index,
  allExercises,
}: {
  exercise: any;
  index: number;
  allExercises: any[];
}) {
  const inSuperset = exercise.supersetGroup != null;
  const firstInGroup = inSuperset && (index === 0 || allExercises[index - 1]?.supersetGroup !== exercise.supersetGroup);
  const lastInGroup = inSuperset && (index === allExercises.length - 1 || allExercises[index + 1]?.supersetGroup !== exercise.supersetGroup);

  return (
    <YStack>
      {firstInGroup && (
        <XStack alignItems="center" gap="$xs" marginBottom="$xs">
          <AppIcon icon={Link2} size={12} color="primary" />
          <AppText variant="label" color="primary" fontWeight="700">SUPERSET</AppText>
        </XStack>
      )}
      <XStack marginBottom={inSuperset && !lastInGroup ? '$sm' : '$2xl'}>
        {inSuperset && <SupersetBar firstInGroup={firstInGroup} lastInGroup={lastInGroup} />}
        <YStack
          flex={1}
          accessibilityRole="summary"
          accessibilityLabel={`Ejercicio: ${getExerciseName({ name: exercise.name ?? '', nameEs: exercise.nameEs })}`}
        >
          <XStack justifyContent="space-between" marginBottom="$md">
            <AppText variant="subtitle" color="primary">
              {getExerciseName({ name: exercise.name ?? '', nameEs: exercise.nameEs }) || 'Ejercicio'}
            </AppText>
          </XStack>
          {exercise.sets.map((set: any, setIndex: any) => (
            <SetRow key={set.id} set={set} index={setIndex} />
          ))}
        </YStack>
      </XStack>
    </YStack>
  );
}

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const workoutService = useWorkout();

  const { workout, loading, loadError } = useWorkoutDetail(id);
  const { totalVolume, totalSets, formattedDate, formattedDuration } = useWorkoutStats(workout);

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      'Eliminar Registro',
      '¿Estás seguro de que quieres eliminar este entrenamiento del historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await workoutService.deleteWorkout(id);
              router.back();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el entrenamiento');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <Screen safeAreaEdges={['top','bottom','left','right']}>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.primary?.val} />
        </YStack>
      </Screen>
    );
  }

  if (!workout) {
    return (
      <Screen safeAreaEdges={['top','bottom','left','right']}>
        <XStack alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$sm" gap="$sm">
          <IconButton icon={<AppIcon icon={ChevronLeft} size={24} color="color" />} onPress={() => router.back()} accessibilityLabel="Volver" />
        </XStack>
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$xl">
          <AppText variant="bodyMd" color="textSecondary">
            {loadError ? 'Error al cargar el entrenamiento' : 'Entrenamiento no encontrado'}
          </AppText>
          <IconButton
            icon={<AppIcon icon={ChevronLeft} size={24} color="color" />}
            onPress={() => router.back()}
            accessibilityLabel="Volver al historial"
          />
        </YStack>
      </Screen>
    );
  }

  return (
    <Screen safeAreaEdges={['top','bottom','left','right']}>
      <YStack flex={1}>
        <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$md">
          <IconButton icon={<AppIcon icon={ChevronLeft} size={24} color="color" />} onPress={() => router.back()} accessibilityLabel="Volver" />
          <AppText variant="titleSm">Entrenamiento</AppText>
          <IconButton icon={<AppIcon icon={Trash2} size={20} color="danger" />} onPress={handleDelete} accessibilityLabel="Eliminar entrenamiento" />
        </XStack>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: SCROLL_BOTTOM_INSET }}
          showsVerticalScrollIndicator={false}
        >
          <CardBase padding="$md" marginBottom="$xl">
            <XStack justifyContent="space-between" marginBottom="$lg">
              <XStack alignItems="center" gap="$xs">
                <AppIcon icon={Calendar} size={16} color="textTertiary" />
                <AppText variant="bodySm" color="textSecondary">{formattedDate}</AppText>
              </XStack>
              <AppText variant="bodySm" color="textTertiary">{formattedDuration}</AppText>
            </XStack>

            <XStack>
              <YStack flex={1}>
                <AppText variant="label" color="textTertiary">VOLUMEN</AppText>
                <AppText variant="titleSm" marginTop="$xs">{`${totalVolume} kg`}</AppText>
              </YStack>
              <YStack flex={1}>
                <AppText variant="label" color="textTertiary">SETS</AppText>
                <AppText variant="titleSm" marginTop="$xs">{totalSets}</AppText>
              </YStack>
            </XStack>
          </CardBase>

          {workout.exercises.map((ex, exIdx) => (
            <ExerciseBlock
              key={ex.id}
              exercise={ex}
              index={exIdx}
              allExercises={workout.exercises}
            />
          ))}
        </ScrollView>
      </YStack>
    </Screen>
  );
}