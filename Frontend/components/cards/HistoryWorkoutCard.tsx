import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import Animated, { FadeInDown, useAnimatedStyle, interpolateColor, type SharedValue } from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, Dumbbell, History, ChevronRight, Trash2 } from 'lucide-react-native';

import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { THEME_FALLBACKS } from '@/tamagui.config';
import { calculateExercisesVolume } from '@/utils/workout';
import { getExerciseName } from '@/utils/exercise';

interface WorkoutSet {
  weight: number;
  reps: number;
}

interface WorkoutExercise {
  id: string;
  name?: string;
  nameEs?: string | null;
  sets: WorkoutSet[];
}

interface WorkoutHistoryItem {
  id: string;
  name?: string;
  date: string;
  durationSeconds: number;
  exercises: WorkoutExercise[];
}

interface HistoryWorkoutCardProps {
  item: WorkoutHistoryItem;
  index: number;
  onDelete: (id: string, name: string) => void;
}

function findMaxVolumeExercise(exercises: WorkoutExercise[]): { exercise: WorkoutExercise; volume: number } | null {
  if (!exercises?.length) return null;
  let maxEx = exercises[0];
  let maxVol = 0;
  exercises.forEach(ex => {
    const vol = ex.sets?.reduce((a, s) => a + (s.weight || 0) * (s.reps || 0), 0) ?? 0;
    if (vol > maxVol) { maxVol = vol; maxEx = ex; }
  });
  return { exercise: maxEx, volume: maxVol };
}

export const HistoryWorkoutCard = React.memo(function HistoryWorkoutCard({ item, index, onDelete }: HistoryWorkoutCardProps) {
  const theme = useTheme();
  const parsedDate = item.date ? new Date(item.date) : new Date();
  const isValidDate = !isNaN(parsedDate.getTime());
  const title = isValidDate
    ? `Entrenamiento de ${format(parsedDate, 'EEEE', { locale: es })}`
    : 'Entrenamiento';
  const maxVolumeResult = findMaxVolumeExercise(item.exercises);
  const maxVolumeEx = maxVolumeResult?.exercise;
  const maxVolumeKg = maxVolumeResult?.volume ?? 0;

  const renderRightActions = useCallback(
    (_progress: SharedValue<number>, dragX: SharedValue<number>) => {
      const AnimatedDeleteAction = () => {
        const animatedStyle = useAnimatedStyle(() => {
          const bg = interpolateColor(
            dragX.value,
            [-80, -48, 0],
            [
              theme.danger?.val ?? THEME_FALLBACKS.danger,
              theme.dangerSubtle?.val ?? THEME_FALLBACKS.dangerSubtle,
              theme.dangerSubtle?.val ?? THEME_FALLBACKS.dangerSubtle,
            ],
          );
          return { backgroundColor: bg };
        });

        return (
          <Pressable
            style={{ alignItems: 'center', justifyContent: 'center', width: 80, height: '100%' }}
            onPress={() => onDelete(item.id, item.name || title)}
            accessibilityLabel="Eliminar entrenamiento"
          >
            <Animated.View
              style={[
                animatedStyle,
                {
                  width: '100%',
                  height: '100%',
                  borderRadius: 12,
                  marginLeft: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <AppIcon icon={Trash2} color="background" size={24} />
            </Animated.View>
          </Pressable>
        );
      };

      return <AnimatedDeleteAction />;
    },
    [theme, onDelete, item.id, item.name, title],
  );

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <ReanimatedSwipeable renderRightActions={renderRightActions} overshootRight={false}>
        <Pressable
          onPress={() => router.push({ pathname: '/(workouts)/summary', params: { id: item.id } } as any)}
          accessibilityLabel={`Ver detalle de ${item.name || title}`}
        >
          <CardBase padding="$md" gap="$sm">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack flex={1}>
                <AppText variant="bodyMd" fontWeight="700">{item.name || title}</AppText>
                <XStack alignItems="center" gap="$xs" marginTop="$xs">
                  <AppIcon icon={Calendar} size={12} color="textTertiary" />
                  <AppText variant="bodySm" color="textTertiary">
                    {isValidDate ? format(parsedDate, 'd MMM, yyyy', { locale: es }) : ''}
                  </AppText>
                </XStack>
              </YStack>
              <AppIcon icon={ChevronRight} size={20} color="textTertiary" />
            </XStack>

            <XStack alignItems="center" gap="$lg">
              <XStack alignItems="center" gap="$xs">
                <AppIcon icon={Clock} size={14} color="primary" />
                <AppText variant="bodySm" color="textSecondary">
                  {Math.floor(item.durationSeconds / 60)} min
                </AppText>
              </XStack>
              <XStack alignItems="center" gap="$xs">
                <AppIcon icon={Dumbbell} size={14} color="primary" />
                <AppText variant="bodySm" color="textSecondary">
                  {calculateExercisesVolume(item.exercises).toLocaleString('es')} kg
                </AppText>
              </XStack>
              <XStack alignItems="center" gap="$xs">
                <AppIcon icon={History} size={14} color="primary" />
                <AppText variant="bodySm" color="textSecondary">
                  {item.exercises.length} ej.
                </AppText>
              </XStack>
            </XStack>

            {maxVolumeEx?.name && (
              <AppText variant="label" color="textTertiary" numberOfLines={1}>
                Mayor volumen: {getExerciseName(maxVolumeEx as { name: string; nameEs?: string | null })} — {maxVolumeKg.toLocaleString('es')} kg
              </AppText>
            )}
          </CardBase>
        </Pressable>
      </ReanimatedSwipeable>
    </Animated.View>
  );
});
