import React, { useEffect } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { Trash2, GripVertical, Plus, Minus, Link2, Unlink } from 'lucide-react-native';
import { XStack, YStack, useTheme, View } from 'tamagui';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';
import { AppText } from '../ui/AppText';
import { AppButton } from '../ui/AppButton';
import { AppIcon } from '../ui/AppIcon';

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

// Convertimos el YStack de Tamagui en un componente animado
const AnimatedYStack = Animated.createAnimatedComponent(YStack);

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

  // Valores compartidos para Reanimated
  const scale = useSharedValue(1);
  const elevation = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.03, { damping: 15 });
      elevation.value = withTiming(10, { duration: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15 });
      elevation.value = withTiming(0, { duration: 200 });
    }
  }, [isActive, scale, elevation]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: withTiming(isActive ? 0.2 : 0, { duration: 200 }),
    zIndex: isActive ? 999 : 1,
  }));

  return (
    <YStack marginBottom={isLinkedNext ? 0 : '$lg'} width="100%">
      {isLinkedPrev && (
        <View 
          height={12} 
          width={4} 
          backgroundColor="$primary" 
          marginLeft={36} 
        />
      )}

      <AnimatedYStack
        style={animatedContainerStyle}
        borderRadius="$lg"
        borderCurve="continuous"
        padding="$md"
        borderWidth={2}
        borderColor={isSuperset ? '$primary' : '$borderColor'}
        backgroundColor="$surface"
      >
        <XStack alignItems="center" gap="$sm">
          <AppButton 
            appVariant="ghost" 
            size="sm" 
            onPressIn={drag}
            onLongPress={drag}
            width={48} 
            height={48}
            fullWidth={false}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Arrastra para reordenar ejercicio"
          >
            <AppIcon icon={GripVertical} color="textTertiary" size={20} />
          </AppButton>

          <YStack flex={1}>
            <AppText variant="subtitle" numberOfLines={1}>{exerciseName}</AppText>
            <AppText variant="bodySm" color="textSecondary">{muscleGroup}</AppText>
          </YStack>

          <AppButton 
            appVariant="ghost" 
            size="sm" 
            onPress={onRemove} 
            width={40} 
            fullWidth={false}
          >
            <AppIcon icon={Trash2} color="danger" size={20} />
          </AppButton>
        </XStack>

        <XStack marginTop="$md" gap="$md">
          <YStack flex={1} gap="$xs">
            <AppText variant="label" color="textSecondary">SERIES</AppText>
            <XStack 
              backgroundColor="$surfaceSecondary" 
              borderRadius="$md" 
              alignItems="center" 
              justifyContent="space-between"
              height={44}
              paddingHorizontal="$xs"
            >
              <AppButton 
                appVariant="ghost" 
                size="sm" 
                width={36}
                fullWidth={false}
                onPress={() => onUpdateSets(Math.max(1, sets - 1))}
              >
                <AppIcon icon={Minus} size={16} />
              </AppButton>

              <AppText variant="bodyMd" tabularNums fontWeight="$7">
                {sets}
              </AppText>

              <AppButton 
                appVariant="ghost" 
                size="sm" 
                width={36}
                fullWidth={false}
                onPress={() => onUpdateSets(sets + 1)}
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
              height={44}
              borderWidth={1}
              borderColor="$borderColor"
            >
              <RNTextInput
                style={{ 
                  flex: 1,
                  textAlign: 'center', 
                  color: theme.color?.val, 
                  fontSize: 16, 
                  fontWeight: '600',
                  fontVariant: ['tabular-nums']
                }}
                value={reps}
                onChangeText={onUpdateReps}
                placeholder="8-12"
                placeholderTextColor={theme.textTertiary?.val}
                keyboardType="default"
              />
            </XStack>
          </YStack>
        </XStack>
      </AnimatedYStack>

      {isLinkedNext ? (
        <XStack height={32} alignItems="center">
          <View width={4} height={32} backgroundColor="$primary" marginLeft={36} />
          <AppButton
            appVariant="outline"
            size="sm"
            marginLeft="$md"
            height={28}
            fullWidth={false}
            onPress={onUnlink}
            borderColor="$danger"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon icon={Unlink} color="danger" size={14} />
            <AppText variant="label" color="danger" marginLeft="$xs">UNLINK</AppText>
          </AppButton>
        </XStack>
      ) : (
        onLinkNext && (
          <XStack height={32} alignItems="center" opacity={0.8}>
             <AppButton 
              appVariant="ghost" 
              size="sm" 
              marginLeft="$xl"
              height={30}
              fullWidth={false}
              onPress={onLinkNext}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppIcon icon={Link2} color="textTertiary" size={14} />
              <AppText variant="label" color="textTertiary" marginLeft="$xs">SUPERSET</AppText>
            </AppButton>
          </XStack>
        )
      )}
    </YStack>
  );
};