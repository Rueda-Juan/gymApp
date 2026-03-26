import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { Trash2, GripVertical, Plus, Minus, Link2, Unlink } from 'lucide-react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { AppText } from '../ui/AppText';
import { Button as AppButton } from '../ui/AppButton';

interface RoutineExerciseRowProps {
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  onRemove: () => void;
  onUpdateSets: (sets: number) => void;
  onUpdateReps: (reps: string) => void;
  drag?: () => void;
  isActive?: boolean;
  isLinkedNext?: boolean;
  isLinkedPrev?: boolean;
  onLinkNext?: () => void;
  onUnlink?: () => void;
}

export const RoutineExerciseRow: React.FC<RoutineExerciseRowProps> = ({
  exerciseName,
  muscleGroup,
  sets,
  reps,
  onRemove,
  onUpdateSets,
  onUpdateReps,
  drag,
  isActive = false,
  isLinkedNext = false,
  isLinkedPrev = false,
  onLinkNext,
  onUnlink,
}) => {
  const theme = useTheme();
  const isSuperset = isLinkedNext || isLinkedPrev;

  return (
    <YStack mb={isLinkedNext ? '$sm' : '$xl'}>
      {isLinkedPrev && (
        <YStack position="absolute" top={-16} left={32} width={2} height={16} backgroundColor="$primary" />
      )}
      <YStack
        borderRadius="$lg"
        p="$lg"
        borderWidth={1}
        borderColor={isSuperset ? '$primary' : '$borderColor'}
        backgroundColor="$surface"
        opacity={isActive ? 0.7 : 1}
        elevation={isActive ? 10 : 2}
      >
        <XStack>
          <AppButton variant="ghost" size="sm" onPress={drag}>
            <GripVertical size={20} color={theme.textSecondary} />
          </AppButton>

          <YStack flex={1}>
            <AppText variant="subtitle">{exerciseName}</AppText>
            <AppText variant="label" color="textSecondary">{muscleGroup}</AppText>
          </YStack>

          <AppButton variant="ghost" size="sm" onPress={onRemove}>
            <Trash2 size={20} color={theme.error} />
          </AppButton>
        </XStack>

        <XStack mt="$md" justifyContent="space-between">
          <YStack flex={1} mr="$2">
            <AppText variant="label" color="textSecondary">
              SERIES
            </AppText>
            <XStack alignItems="center" height={36}>
              <AppButton variant="ghost" size="sm" onPress={() => onUpdateSets(Math.max(1, sets - 1))}>
                <Minus size={16} color={theme.color} />
              </AppButton>

              <AppText variant="subtitle" mx="$4" textAlign="center" minWidth={20}>
                {sets}
              </AppText>

              <AppButton variant="ghost" size="sm" onPress={() => onUpdateSets(sets + 1)}>
                <Plus size={16} color={theme.color} />
              </AppButton>
            </XStack>
          </YStack>

          <YStack flex={1} ml="$2">
            <AppText variant="label" color="textSecondary">
              RANGO DE REPS
            </AppText>
            <YStack height={36} borderRadius="$sm" px="$2" backgroundColor="$surfaceSecondary" borderWidth={1} borderColor="$borderColor" justifyContent="center">
              <RNTextInput
                style={{ textAlign: 'center', color: theme.color, fontSize: 16, fontWeight: '600' }}
                value={reps}
                onChangeText={onUpdateReps}
                placeholder="8-12"
                placeholderTextColor={theme.textTertiary}
                keyboardType="default"
              />
            </YStack>
          </YStack>
        </XStack>
      </YStack>

      {isLinkedNext ? (
        <YStack alignItems="center" height={24} justifyContent="center">
          <YStack position="absolute" width={2} height={24} backgroundColor="$primary" left={32} />
          <AppButton
            variant="outline"
            size="sm"
            style={{ position: 'relative', left: -80, zIndex: 2 }}
            onPress={onUnlink}
          >
            <Unlink size={14} color={theme.error} />
          </AppButton>
        </YStack>
      ) : (
        onLinkNext && (
          <YStack alignItems="center" height={16} justifyContent="center" opacity={0.3}>
            <AppButton variant="ghost" size="sm" style={{ left: -80 }} onPress={onLinkNext}>
              <Link2 size={16} color={theme.textTertiary} />
            </AppButton>
          </YStack>
        )
      )}
    </YStack>
  );
};

