import React, { useRef, useEffect, useCallback, useState } from 'react';
import { TextInput, Pressable, Alert, Keyboard, useWindowDimensions, Platform } from 'react-native';
import { XStack, YStack, View, useTheme } from 'tamagui';
import { Check, Flame, Trash2 } from 'lucide-react-native';
import { useSettings } from '@/store/useSettings';
import { PlateCalculatorModal } from '../workout/PlateCalculatorModal';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolate,
  interpolateColor,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { WorkoutSetState } from '@/store/useActiveWorkout';
import { AppText } from '../ui/AppText';
import { AppIcon } from '../ui/AppIcon';
import { SetRowNumberInput } from './set-row-number-input';
import { SetRowRirSelector } from './set-row-rir-selector';
import { THEME_FALLBACKS } from '@/tamagui.config';

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
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [showPlateMath, setShowPlateMath] = useState(false);
  const [showRirSelector, setShowRirSelector] = useState(false);

  const availablePlates = useSettings(s => s.availablePlates);
  const weightIncrement = availablePlates.length > 0 ? Math.min(...availablePlates) : 2.5;

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
    Keyboard.dismiss();
    const isIOS = Platform.OS === 'ios';
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

  const DELETE_THRESHOLD = SCREEN_WIDTH * 0.2;
  const DELETE_BUTTON_WIDTH = 80;

  const translateX = useSharedValue(0);

  const triggerDelete = useCallback(() => {
    if (!onRemove) return;
    Alert.alert('Eliminar set', '¿Eliminar este set?', [
      { text: 'Cancelar', style: 'cancel', onPress: () => { translateX.value = withSpring(0); } },
      { text: 'Eliminar', style: 'destructive', onPress: () => onRemove() },
    ]);
  }, [onRemove, translateX]);

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -DELETE_BUTTON_WIDTH - 20);
      }
    })
    .onEnd((event) => {
      if (event.translationX < -DELETE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, () => {
          runOnJS(triggerDelete)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const swipeRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-DELETE_BUTTON_WIDTH, 0], [1, 0]),
  }));

  const deleteButtonBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translateX.value,
      [-DELETE_THRESHOLD, -DELETE_BUTTON_WIDTH * 0.3, 0],
      [
        theme.danger?.val ?? THEME_FALLBACKS.danger,
        theme.dangerSubtle?.val ?? THEME_FALLBACKS.dangerSubtle,
        theme.dangerSubtle?.val ?? THEME_FALLBACKS.dangerSubtle,
      ],
    ),
  }));

  const deleteIconRestStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-DELETE_THRESHOLD, -DELETE_BUTTON_WIDTH * 0.3], [0, 1]),
  }));

  const deleteIconActiveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-DELETE_THRESHOLD, -DELETE_BUTTON_WIDTH * 0.3], [1, 0]),
  }));

  const parseWeight = useCallback((value: string) => {
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
    <YStack width="100%" borderRadius="$lg" overflow="hidden">
      {/* Delete reveal layer (behind the row) */}
      {onRemove && (
        <Animated.View
          style={[
            { position: 'absolute', right: 0, top: 0, bottom: 0, width: DELETE_BUTTON_WIDTH, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
            deleteButtonBgStyle,
            deleteButtonOpacity,
          ]}
        >
          <Animated.View style={[{ position: 'absolute' }, deleteIconRestStyle]}>
            <AppIcon icon={Trash2} color="danger" size={20} />
          </Animated.View>
          <Animated.View style={[{ position: 'absolute' }, deleteIconActiveStyle]}>
            <AppIcon icon={Trash2} color="background" size={20} />
          </Animated.View>
        </Animated.View>
      )}

      {/* Swipeable row */}
      <GestureDetector gesture={onRemove ? swipeGesture : Gesture.Pan().enabled(false)}>
        <Animated.View style={swipeRowStyle}>
          <XStack alignItems="center" height="$setRowHeight" gap="$sm" paddingHorizontal="$md" style={isCompletedStyle}>
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
            <SetRowNumberInput
              inputRef={weightRef}
              flex={1.2}
              value={setRef.weight > 0 ? String(setRef.weight) : ''}
              placeholder={previousWeight && previousWeight > 0 ? String(previousWeight) : '0'}
              editable={!setRef.isCompleted}
              keyboardType="decimal-pad"
              textColor={inputTextColor}
              backgroundColor={inputBgColor}
              inputPaddingVertical={6}
              onChangeText={(value) => onUpdate({ weight: parseWeight(value) })}
              onDecrement={() => {
                if (!setRef.isCompleted) onUpdate({ weight: Math.max(0, setRef.weight - weightIncrement) });
              }}
              onIncrement={() => {
                if (!setRef.isCompleted) onUpdate({ weight: setRef.weight + weightIncrement });
              }}
              onLongPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowPlateMath(true);
              }}
            />

            <SetRowNumberInput
              inputRef={repsRef}
              flex={1}
              value={setRef.reps > 0 ? String(setRef.reps) : ''}
              placeholder="0"
              editable={!setRef.isCompleted}
              keyboardType="number-pad"
              textColor={inputTextColor}
              backgroundColor={inputBgColor}
              onChangeText={(value) => onUpdate({ reps: parseInt(value, 10) || 0 })}
              onDecrement={() => {
                if (!setRef.isCompleted) onUpdate({ reps: Math.max(0, setRef.reps - 1) });
              }}
              onIncrement={() => {
                if (!setRef.isCompleted) onUpdate({ reps: setRef.reps + 1 });
              }}
            />
          </AnimatedXStack>

          <SetRowRirSelector
            value={setRef.rir}
            style={rirGroupStyle}
            pointerEvents={showRirSelector ? 'auto' : 'none'}
            onSelect={(value) => {
              onUpdate({ rir: value });
              setShowRirSelector(false);
            }}
            onClose={() => setShowRirSelector(false)}
          />
        </View>

        <Animated.View style={[
          { borderRadius: 8, width: 44, height: 40 },
          animatedCheckStyle,
        ]}>
          <Pressable
            onPress={handleToggle}
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
        </Animated.View>
      </GestureDetector>

      <PlateCalculatorModal
        visible={showPlateMath}
        onClose={() => setShowPlateMath(false)}
        targetWeight={setRef.weight}
      />
    </YStack>
  );
});