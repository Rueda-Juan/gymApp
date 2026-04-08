import React, { useState } from 'react';
import { TextInput as RNTextInput, Pressable, Platform } from 'react-native';
import { FONT_SCALE } from '@/tamagui.config';
import { Trash2, GripVertical, Plus, Minus, Link2, Unlink, ChevronDown, ChevronUp } from 'lucide-react-native';
import { XStack, YStack, useTheme, View } from 'tamagui';
import Animated, { 
  useAnimatedStyle, 
  useAnimatedReaction,
  withSpring, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';
import { AppText } from '../ui/AppText';
import { AppButton } from '../ui/AppButton';
import { AppIcon } from '../ui/AppIcon';
import { motion } from '@/constants/motion';
import { WORKOUT_LIMITS } from '@/constants/workout';

const COLLAPSED_HEADER_HEIGHT = 52;
const LINK_INDICATOR_HEIGHT = 12;
const LINK_INDICATOR_WIDTH = 4;
const LINK_INDICATOR_MARGIN_LEFT = 36;
const SETS_BUTTON_SIZE = 36;

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

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export const RoutineExerciseRow: React.FC<RoutineExerciseRowProps> = React.memo(({
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
  const [isExpanded, setIsExpanded] = useState(false);

  const repsInputStyle = React.useMemo(() => ({
    flex: 1,
    textAlign: 'center' as const,
    color: theme.color?.val,
    fontSize: FONT_SCALE.sizes[3],
    fontWeight: '600' as const,
    fontVariant: ['tabular-nums'] as const as any,
  }), [theme.color?.val]);

  const scale = useSharedValue(1);
  const elevation = useSharedValue(0);

  useAnimatedReaction(
    () => isActive,
    (active) => {
      scale.value = active ? withSpring(motion.scale.micro, { ...motion.spring.snappy }) : withSpring(1, { ...motion.spring.snappy });
      elevation.value = active ? withTiming(10, { duration: motion.duration.normal }) : withTiming(0, { duration: motion.duration.normal });
    },
    []
  );

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: withTiming(isActive ? 0.2 : 0, { duration: motion.duration.normal }),
    zIndex: isActive ? 999 : 1,
  }));

  const setSummary = `${sets}\u00d7${reps}`;

  const collapsedHeader = (
    <XStack height={COLLAPSED_HEADER_HEIGHT} paddingHorizontal="$md" gap="$md" alignItems="center">
      <Pressable
        onPressIn={drag}
        onLongPress={drag}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Arrastra para reordenar"
      >
        <AppIcon icon={GripVertical} color="textTertiary" size={20} />
      </Pressable>

      <AppText variant="bodyMd" numberOfLines={1} fontWeight="600" flex={1}>
        {exerciseName}
      </AppText>

      <AppText variant="label" color="textSecondary" tabularNums>
        {setSummary}
      </AppText>

      <AppIcon
        icon={Link2}
        color={isSuperset ? 'primary' : 'textTertiary'}
        size={16}
      />

      <AppIcon
        icon={isExpanded ? ChevronUp : ChevronDown}
        color="textTertiary"
        size={16}
      />
    </XStack>
  );

  return (
    <YStack marginBottom={isLinkedNext ? 0 : '$lg'} width="100%">
      {isLinkedPrev && (
        <View
          height={LINK_INDICATOR_HEIGHT}
          width={LINK_INDICATOR_WIDTH}
          backgroundColor="$primary"
          marginLeft={LINK_INDICATOR_MARGIN_LEFT}
        />
      )}

      <AnimatedYStack
        style={animatedContainerStyle}
        borderRadius="$lg"
        borderCurve="continuous"
        borderWidth={isSuperset ? 2 : 1}
        borderColor={isSuperset ? '$primary' : '$borderColor'}
        backgroundColor="$surface"
        overflow="hidden"
        elevation={Platform.OS === 'android' && isActive ? 8 : 0}
      >
        <Pressable
          onPress={() => setIsExpanded(prev => !prev)}
          accessibilityRole="button"
          accessibilityLabel={isExpanded ? "Colapsar detalles del ejercicio" : "Expandir detalles del ejercicio"}
        >
          {collapsedHeader}
        </Pressable>

        {isExpanded && (
          <YStack padding="$md" gap="$md" borderTopWidth={1} borderTopColor="$borderColor">
            {/* Sets + Reps controls */}
            <XStack gap="$md">
              <YStack flex={1} gap="$xs">
                <AppText variant="label" color="textSecondary">SERIES</AppText>
                <XStack
                  backgroundColor="$surfaceSecondary"
                  borderRadius="$md"
                  alignItems="center"
                  justifyContent="space-between"
                  height="$inputHeight"
                  paddingHorizontal="$xs"
                >
                  <AppButton
                    appVariant="ghost"
                    size="sm"
                    width={SETS_BUTTON_SIZE}
                    fullWidth={false}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={() => onUpdateSets(Math.max(WORKOUT_LIMITS.MIN_SETS, sets - 1))}
                  >
                    <AppIcon icon={Minus} size={16} />
                  </AppButton>
                  <AppText variant="bodyMd" tabularNums fontWeight="700">{sets}</AppText>
                  <AppButton
                    appVariant="ghost"
                    size="sm"
                    width={SETS_BUTTON_SIZE}
                    fullWidth={false}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={() => onUpdateSets(Math.min(WORKOUT_LIMITS.MAX_SETS, sets + 1))}
                  >
                    <AppIcon icon={Plus} size={16} />
                  </AppButton>
                </XStack>
              </YStack>

              <YStack flex={1} gap="$xs">
                <AppText variant="label" color="textSecondary">RANGO REPS</AppText>
                <XStack
                  backgroundColor="$surfaceSecondary"
                  borderRadius="$md"
                  height="$inputHeight"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <RNTextInput
                    style={repsInputStyle}
                    value={reps}
                    onChangeText={(text) => onUpdateReps(text.replace(/[^0-9-]/g, ''))}
                    placeholder="8-12"
                    placeholderTextColor={theme.textTertiary?.val}
                    keyboardType="default"
                  />
                </XStack>
              </YStack>
            </XStack>

            {/* Superset link row */}
            {isLinkedNext ? (
              <Pressable
                onPress={onUnlink}
                accessibilityRole="button"
                accessibilityLabel="Desenlazar del siguiente ejercicio"
              >
                <XStack alignItems="center" gap="$md" paddingVertical="$xs">
                  <AppIcon icon={Unlink} color="danger" size={18} />
                  <AppText variant="bodyMd" color="danger">Desenlazar del siguiente</AppText>
                </XStack>
              </Pressable>
            ) : onLinkNext ? (
              <Pressable
                onPress={onLinkNext}
                accessibilityRole="button"
                accessibilityLabel="Enlazar con el siguiente ejercicio"
              >
                <XStack alignItems="center" gap="$md" paddingVertical="$xs">
                  <AppIcon icon={Link2} color="primary" size={18} />
                  <AppText variant="bodyMd" color="primary">Enlazar con siguiente</AppText>
                </XStack>
              </Pressable>
            ) : null}

            {/* Delete row — textTertiary at rest (never $danger) */}
            <Pressable
              onPress={onRemove}
              accessibilityRole="button"
              accessibilityLabel="Eliminar ejercicio"
            >
              <XStack alignItems="center" gap="$md" paddingVertical="$xs">
                <AppIcon icon={Trash2} color="textTertiary" size={18} />
                <AppText variant="bodyMd" color="textTertiary">Eliminar ejercicio</AppText>
              </XStack>
            </Pressable>
          </YStack>
        )}
      </AnimatedYStack>
    </YStack>
  );
});

RoutineExerciseRow.displayName = 'RoutineExerciseRow';

