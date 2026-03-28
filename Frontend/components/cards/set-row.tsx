import React, { useRef, useEffect, useCallback, useState } from 'react';
import { TextInput, Pressable } from 'react-native';
import { XStack, YStack, View, useTheme, Button } from 'tamagui';
import { Check, Flame, X, Info } from 'lucide-react-native';
import { PlateCalculatorModal } from '../workout/PlateCalculatorModal';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolate,
  interpolateColor,
  withSequence
} from 'react-native-reanimated';
import { WorkoutSetState } from '@/store/useActiveWorkout';
import { AppText } from '../ui/AppText';
import { AppIcon } from '../ui/AppIcon';

export interface SetRowProps {
  index: number;
  setRef: WorkoutSetState;
  previousWeight?: number;
  onUpdate: (values: Partial<WorkoutSetState>) => void;
  onToggleComplete: () => void;
  onRemove?: () => void;
  autoFocus?: boolean;
}

const AnimatedXStack = Animated.createAnimatedComponent(XStack);

export const SetRow = React.memo(function SetRow({
  index,
  setRef,
  previousWeight,
  onUpdate,
  onToggleComplete,
  onRemove,
  autoFocus
}: SetRowProps) {
  const theme = useTheme();
  const [showPlateMath, setShowPlateMath] = useState(false);
  const [showRirSelector, setShowRirSelector] = useState(false);

  const weightRef = useRef<TextInput>(null);
  const repsRef = useRef<TextInput>(null);

  const scale = useSharedValue(1);
  const rirAnim = useSharedValue(0);
  const completionAnim = useSharedValue(setRef.isCompleted ? 1 : 0);

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => weightRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  useEffect(() => {
    rirAnim.value = withSpring(showRirSelector ? 1 : 0, { damping: 20 });
  }, [showRirSelector, rirAnim]);                    // ← add rirAnim

  useEffect(() => {
    completionAnim.value = withTiming(setRef.isCompleted ? 1 : 0, { duration: 200 });
  }, [setRef.isCompleted, completionAnim]);

  const handleToggle = useCallback(() => {
    const isIOS = process.env.EXPO_OS === 'ios';
    if (!setRef.isCompleted) {
      if (isIOS) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (setRef.rir === null && setRef.type === 'normal') {
        setShowRirSelector(true);
      }
    } else {
      if (isIOS) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setShowRirSelector(false);
    }

    scale.value = withSequence(withSpring(0.9), withSpring(1));
    onToggleComplete();
  }, [setRef.isCompleted, setRef.rir, setRef.type, onToggleComplete, scale]);

  const parseWeight = useCallback((value: string) => {
    if (!value) return 0;
    const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }, []);

  const isCompletedStyle = setRef.isCompleted ? {
    backgroundColor: theme.successSubtle?.val,
    borderColor: theme.success?.val,
  } : {};

  const inputTextColor = setRef.isCompleted ? theme.success?.val : theme.color?.val;
  const inputBgColor = setRef.isCompleted ? theme.successSubtle?.val : theme.surfaceSecondary?.val;

  const animatedCheckStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      completionAnim.value,
      [0, 1],
      [theme.surfaceSecondary?.val ?? 'transparent', theme.successSubtle?.val ?? 'transparent']
    ),
    transform: [{ scale: scale.value }],
  }));

  const rirGroupStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rirAnim.value, [0.2, 1], [0, 1]),
    transform: [{ translateX: interpolate(rirAnim.value, [0, 1], [15, 0]) }],
  }));

  const inputGroupStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rirAnim.value, [0, 0.8], [1, 0]),
    transform: [{ translateX: interpolate(rirAnim.value, [0, 1], [0, -15]) }],
  }));

  return (
    <YStack width="100%" borderRadius="$lg" overflow="hidden" style={isCompletedStyle}>
      <XStack alignItems="center" height={52} gap="$sm" paddingHorizontal="$md" style={isCompletedStyle}>
        <Pressable
          onPress={() => onUpdate({ type: setRef.type === 'warmup' ? 'normal' : 'warmup' })}
          style={{ width: 32, alignItems: 'center' }}
        >
          {setRef.type === 'warmup' ? (
            <AppIcon icon={Flame} color="warning" size={16} />
          ) : (
            <AppText variant="bodySm" color="textSecondary" fontWeight="700">
              {index + 1}
            </AppText>
          )}
        </Pressable>

        <View flex={1} height={40} position="relative">
          <AnimatedXStack
            style={[{ flex: 1, gap: 8 }, inputGroupStyle]}
            pointerEvents={showRirSelector ? 'none' : 'auto'}
          >
            <Pressable
              onLongPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowPlateMath(true);
              }}
              delayLongPress={400}
              style={{ flex: 1.2, flexDirection: 'row', backgroundColor: inputBgColor, borderRadius: 8, alignItems: 'center' }}
            >
              <TextInput
                ref={weightRef}
                style={{ flex: 1, color: inputTextColor, textAlign: 'center', fontWeight: '700', fontSize: 16 }}
                keyboardType="decimal-pad"
                value={setRef.weight > 0 ? String(setRef.weight) : ''}
                placeholder={previousWeight && previousWeight > 0 ? String(previousWeight) : '0'}
                placeholderTextColor={theme.textTertiary?.val}
                onChangeText={(v) => onUpdate({ weight: parseWeight(v) })}
                editable={!setRef.isCompleted}
              />
              <View paddingRight={8}>
                <AppIcon icon={Info} size={14} color="textTertiary" />
              </View>
            </Pressable>

            <View flex={1} style={{ backgroundColor: inputBgColor, borderRadius: 8 }}>
              <TextInput
                ref={repsRef}
                style={{ flex: 1, color: inputTextColor, textAlign: 'center', fontWeight: '700', fontSize: 16 }}
                keyboardType="number-pad"
                value={setRef.reps > 0 ? String(setRef.reps) : ''}
                placeholder="0"
                placeholderTextColor={theme.textTertiary?.val}
                onChangeText={(v) => onUpdate({ reps: parseInt(v) || 0 })}
                editable={!setRef.isCompleted}
              />
            </View>
          </AnimatedXStack>

          <AnimatedXStack
            style={[{ position: 'absolute', inset: 0, justifyContent: 'space-between', alignItems: 'center' }, rirGroupStyle]}
            pointerEvents={showRirSelector ? 'auto' : 'none'}
          >
            {[0, 1, 2, 3, 4].map((v) => (
              <Button
                key={v}
                size="$2"
                circular
                backgroundColor={setRef.rir === v ? '$primary' : '$surfaceSecondary'}
                onPress={() => {
                  onUpdate({ rir: v });
                  setShowRirSelector(false);
                }}
              >
                <AppText color={setRef.rir === v ? "background" : "color"} fontWeight="700" fontSize={12}>
                  {v}{v === 4 ? '+' : ''}
                </AppText>
              </Button>
            ))}
            <Pressable onPress={() => setShowRirSelector(false)} style={{ padding: 4 }}>
              <AppIcon icon={X} size={14} color="textTertiary" />
            </Pressable>
          </AnimatedXStack>
        </View>

        <Animated.View style={[
          { borderRadius: 8, width: 44, height: 40 } as const,
          animatedCheckStyle as any,                        // ← breaks DefaultStyle vs AnimatedStyle conflict
        ]}>
          <Pressable
            onPress={handleToggle}
            onLongPress={() => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              onRemove?.();
            }}
            delayLongPress={1000}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <AppIcon
              icon={Check}
              color={setRef.isCompleted ? 'success' : 'textTertiary'}
              size={22}
              strokeWidth={3}
            />
          </Pressable>
        </Animated.View>
      </XStack>

      <PlateCalculatorModal
        visible={showPlateMath}
        onClose={() => setShowPlateMath(false)}
        targetWeight={setRef.weight}
      />
    </YStack>
  );
});