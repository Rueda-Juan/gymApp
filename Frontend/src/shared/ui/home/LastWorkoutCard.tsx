import React from 'react';
// import { Pressable } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { PressableCard } from '@/shared/ui/PressableCard';
import { CardBase as Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { Clock, Dumbbell } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  lastWorkout: any;
  onViewAll: () => void;
  onViewLast: () => void;
}

export default function LastWorkoutCard({ lastWorkout, onViewAll, onViewLast }: Props) {
  if (!lastWorkout) return null;

  return (
    <YStack gap="$md" marginBottom="$xl" paddingHorizontal="$xl" marginTop="$xl">
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
        <AppText variant="titleSm">Último Entrenamiento</AppText>
        <YStack
          onPress={onViewAll}
          accessibilityRole="button"
          accessibilityLabel="Ver historial completo"
          cursor="pointer"
          pressStyle={{ opacity: 0.85 }}
        >
          <AppText variant="bodyMd" color="primary" fontWeight="600">Ver todo</AppText>
        </YStack>
      </XStack>

      <PressableCard onPress={onViewLast} accessibilityLabel="Ver último entrenamiento">
        <Card padding="$none">
          <XStack justifyContent="space-between" alignItems="center" padding="$md" borderBottomWidth={1} borderBottomColor="$borderColor">
            <YStack>
              <AppText variant="subtitle">Sesión de Entrenamiento</AppText>
              <AppText variant="bodySm" color="textTertiary" marginTop="$xs">
                {formatDistanceToNow(new Date(lastWorkout.date), { addSuffix: true, locale: es })}
              </AppText>
            </YStack>
            <Badge label="ENTRENADO" variant="success" />
          </XStack>
          <XStack justifyContent="space-between" padding="$md">
            <YStack gap="$xs">
              <XStack alignItems="center" gap="$xs">
                <AppIcon icon={Clock} color="textSecondary" strokeWidth={2} size={16} />
                <AppText variant="bodySm" color="textSecondary">
                  {Math.floor(lastWorkout.durationSeconds / 60)}
                </AppText>
                <AppText variant="bodySm" color="textTertiary"> min</AppText>
              </XStack>
              <XStack alignItems="center" gap="$xs">
                <AppIcon icon={Dumbbell} color="textSecondary" size={16} />
                <AppText variant="bodySm" color="textSecondary">
                  {lastWorkout.exercises.length}
                </AppText>
                <AppText variant="bodySm" color="textTertiary"> ejercicios</AppText>
              </XStack>
            </YStack>
          </XStack>
        </Card>
      </PressableCard>
    </YStack>
  );
}
