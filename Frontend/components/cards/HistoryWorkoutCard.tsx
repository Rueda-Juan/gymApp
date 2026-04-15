import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import Animated, { FadeInDown, useAnimatedStyle, interpolateColor, type SharedValue } from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, Dumbbell, History, ChevronRight, Trash2 } from 'lucide-react-native';

import { CardBase } from '@/components/ui/Card';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { THEME_FALLBACKS } from '@/tamagui.config';
import { calculateExercisesVolume, findMaxVolumeExercise } from '@/utils/workout';
import { getExerciseName } from '@/utils/exercise';
import { ROUTES } from '@/constants/routes';

const CARD_BORDER_RADIUS = 12;
const DELETE_ACTION_WIDTH = 80;
const DELETE_INTERPOLATION_RANGE = [-80, -48, 0] as const;

const CARD_SHADOW_STYLE = {
  borderRadius: CARD_BORDER_RADIUS,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
} as const;

const DELETE_ACTION_PRESSABLE_STYLE = {
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  width: DELETE_ACTION_WIDTH,
  height: '100%' as const,
};

const DELETE_ACTION_CONTAINER_STYLE = {
  width: '100%' as const,
  height: '100%' as const,
  borderRadius: CARD_BORDER_RADIUS,
  marginLeft: 8,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

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

interface DeleteSwipeActionProps {
  dragX: SharedValue<number>;
  onPress: () => void;
}

function DeleteSwipeAction({ dragX, onPress }: DeleteSwipeActionProps) {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      dragX.value,
      DELETE_INTERPOLATION_RANGE as unknown as number[],
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
      style={DELETE_ACTION_PRESSABLE_STYLE}
      onPress={onPress}
      accessibilityLabel="Eliminar entrenamiento"
      accessibilityRole="button"
    >
      <Animated.View style={[animatedStyle, DELETE_ACTION_CONTAINER_STYLE]}>
        <AppIcon icon={Trash2} color="background" size={24} />
      </Animated.View>
    </Pressable>
  );
}

export const HistoryWorkoutCard = React.memo(function HistoryWorkoutCard({ item, index, onDelete }: HistoryWorkoutCardProps) {
  const parsedDate = item.date ? new Date(item.date) : null;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
  
  const title = isValidDate
    ? `Entrenamiento de ${format(parsedDate, 'EEEE', { locale: es })}`
    : 'Entrenamiento';
    
  const maxVolumeResult = findMaxVolumeExercise(item.exercises);
  const maxVolumeEx = maxVolumeResult?.exercise;
  const maxVolumeKg = maxVolumeResult?.volume ?? 0;
  const maxVolumeExName = maxVolumeEx?.name
    ? getExerciseName({ name: maxVolumeEx.name, nameEs: maxVolumeEx.nameEs })
    : null;

  const renderRightActions = useCallback(
    (_progress: SharedValue<number>, dragX: SharedValue<number>) => (
      <DeleteSwipeAction
        dragX={dragX}
        onPress={() => onDelete(item.id, item.name || title)}
      />
    ),
    [onDelete, item.id, item.name, title],
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={CARD_SHADOW_STYLE}
    >
      <ReanimatedSwipeable renderRightActions={renderRightActions} overshootRight={false}>
        <Pressable
          onPress={() => router.push({ pathname: ROUTES.WORKOUT_SUMMARY, params: { id: item.id } })}
          accessibilityLabel={`Ver detalle de ${item.name || title}`}
          accessibilityRole="button"
        >
          <CardBase padding="$md" gap="$sm" shadowOpacity={0} elevation={0}>
            <XStack justifyContent="space-between" alignItems="center">
              <YStack flex={1}>
                <AppText variant="bodyMd" fontWeight="700" numberOfLines={1}>{item.name || title}</AppText>
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

            {maxVolumeExName && (
              <AppText variant="label" color="textTertiary" numberOfLines={1}>
                Mayor volumen: {maxVolumeExName} — {maxVolumeKg.toLocaleString('es')} kg
              </AppText>
            )}
          </CardBase>
        </Pressable>
      </ReanimatedSwipeable>
    </Animated.View>
  );
});
