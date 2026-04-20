import { XStack, YStack, useTheme } from 'tamagui';
import React, { useCallback, useEffect } from 'react';
import { FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Trophy, Calendar, Dumbbell } from 'lucide-react-native';
import { format } from 'date-fns';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { CardBase } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { useExerciseDetail } from '@/hooks/domain/useExerciseDetail';
import { getExerciseName } from '@/utils/exercise';
import type { WorkoutSetDTO } from '@shared';
import { FONT_SCALE } from '@/tamagui.config';
import { ROUTES } from '@/constants/routes';

const SCROLL_BOTTOM_INSET = 100;

const formatSetDate = (createdAt?: string | Date): string => {
  if (!createdAt) return '';
  try {
    return format(new Date(createdAt), 'dd/MM/yyyy');
  } catch (err) {
    console.error('formatSetDate error:', err);
    return String(createdAt);
  }
};

function HistorySetItem({ set }: { set: WorkoutSetDTO }) {
  const canNavigate = Boolean(set.workoutId);
  const handlePress = () => {
    if (set.workoutId) {
      router.push({ pathname: ROUTES.HISTORY_DETAIL, params: { id: set.workoutId } });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!canNavigate}
      accessibilityRole="button"
      accessibilityLabel={`Ver sesión del ${formatSetDate(set.createdAt)}: ${set.weight} kg × ${set.reps} reps`}
    >
      <CardBase padding="$md">
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$sm">
          <XStack alignItems="center" gap="$xs">
            <AppIcon icon={Calendar} size={14} color="textTertiary" />
            <AppText variant="label" color="textSecondary">
              {formatSetDate(set.createdAt)}
            </AppText>
          </XStack>
          <AppText variant="bodyMd" fontWeight="700">{set.weight} kg</AppText>
        </XStack>
        <AppText variant="bodySm" color="textSecondary">
          Set {set.setNumber}: {set.weight} kg × {set.reps} reps
        </AppText>
      </CardBase>
    </Pressable>
  );
}

export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const theme = useTheme();
  const { exercise, history = [], maxWeight, loading, loadError } = useExerciseDetail(id);

  useEffect(() => {
    if (loadError) {
      console.error('useExerciseDetail loadError:', loadError);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [loadError]);

  const renderHistoryItem = useCallback(
    ({ item }: { item: WorkoutSetDTO }) => <HistorySetItem set={item} />,
    [],
  );
  const keyExtractor = useCallback((item: WorkoutSetDTO) => String(item.id), []);

  if (loading) {
    return (
      <Screen safeAreaEdges={['top', 'bottom', 'left', 'right']}>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.primary?.val} />
        </YStack>
      </Screen>
    );
  }

  if (!exercise) {
    return (
      <Screen safeAreaEdges={['top', 'bottom', 'left', 'right']}>
        <YStack flex={1}>
          <XStack alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$sm" gap="$sm">
            <IconButton icon={<AppIcon icon={ChevronLeft} size={24} color="primary" />} onPress={() => router.back()} accessibilityLabel="Volver" />
          </XStack>
          <YStack flex={1} alignItems="center" justifyContent="center" padding="$xl">
            <AppText variant="titleSm" color="textSecondary">
              {loadError ? 'Error al cargar el ejercicio' : 'Ejercicio no encontrado'}
            </AppText>
          </YStack>
        </YStack>
      </Screen>
    );
  }

  return (
    <Screen safeAreaEdges={['top', 'bottom', 'left', 'right']}>
      <YStack flex={1}>
        <XStack alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$sm" gap="$sm">
          <IconButton icon={<AppIcon icon={ChevronLeft} size={24} color="primary" />} onPress={() => router.back()} accessibilityLabel="Volver" />
          <AppText variant="titleSm" marginLeft="$xs">Detalle de Ejercicio</AppText>
        </XStack>

        <FlatList
          data={history ?? []}
          renderItem={renderHistoryItem}
          keyExtractor={keyExtractor}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: SCROLL_BOTTOM_INSET }}
          ListHeaderComponent={
            <YStack>
              {/*
              {exercise.animationPath != null && (
                <YStack ...existing code...>
                  ...existing code...
                </YStack>
              )}
              */}

              <CardBase padding="$md" marginBottom="$xl">
                <AppText variant="titleMd">{getExerciseName(exercise)}</AppText>
                <XStack alignItems="center" marginTop="$sm" gap="$xs">
                  <AppIcon icon={Dumbbell} size={16} color="primary" />
                  <AppText variant="bodyMd" color="textSecondary" style={{ textTransform: 'capitalize' }}>
                    {exercise.primaryMuscles?.[0] ?? 'N/A'} • {exercise.equipment ?? 'N/A'}
                  </AppText>
                </XStack>
              </CardBase>

              {/*
              {exercise.anatomicalRepresentationSvg != null && (
                <>
                  ...existing code...
                </>
              )}
              */}

              <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
                <AppText variant="titleSm">Récord Personal (1RM)</AppText>
                <AppIcon icon={Trophy} size={20} color="primary" />
              </XStack>
              <CardBase alignItems="center" paddingVertical="$2xl" marginBottom="$xl">
                <AppText variant="titleLg" color="primary" fontSize={FONT_SCALE.sizes.displayLg}>
                  {history.length > 0 ? `${maxWeight} kg` : '--'}
                </AppText>
                <AppText variant="label" color="textSecondary" marginTop="$xs">
                  ESTIMADO BASADO EN ÚLTIMA SESIÓN
                </AppText>
              </CardBase>

              <AppText variant="titleSm" marginBottom="$md">Historial Reciente</AppText>
            </YStack>
          }
          ListEmptyComponent={
            <YStack padding="$3xl" alignItems="center">
              <AppText variant="bodyMd" color="textSecondary" textAlign="center">
                No hay historial registrado para este ejercicio.
              </AppText>
            </YStack>
          }
          ItemSeparatorComponent={() => <YStack height="$md" />}
        />
      </YStack>
    </Screen>
  );
}