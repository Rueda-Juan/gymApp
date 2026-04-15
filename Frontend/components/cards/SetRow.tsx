import React, { useRef, useEffect, useCallback, useState } from 'react';
import { TextInput, Pressable, Keyboard, useWindowDimensions, Platform } from 'react-native';
import { XStack, YStack, View, useTheme } from 'tamagui';
import { Check, Flame, Trash2 } from 'lucide-react-native';
import { useSettings } from '@/store/useSettings';
import { useSensoryFeedback } from '@/hooks/ui/useSensoryFeedback';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { AppText } from '../ui/AppText';
import { AppIcon } from '../ui/AppIcon';
import { SetRowNumberInput } from './SetRowNumberInput';
import { SetRowRirSelector } from './SetRowRirSelector';
import { THEME_FALLBACKS } from '@/tamagui.config';
import { useSetRowAnimation } from '@/hooks/ui/useSetRowAnimation';
import { parseWeight } from '@/utils/formatters';

const DELETE_BUTTON_WIDTH = 80;
const AUTOFOCUS_DELAY_MS = 150;

export interface SetData {
  weight: number;
  reps: number;
  isCompleted: boolean;
  type: 'warmup' | 'normal' | 'failure' | 'dropset';
  rir?: number | null;
  partialReps?: boolean;
}

export interface SetRowProps {
  index: number;
  set: SetData;
  previousWeight?: number;
  onUpdate: (values: Partial<SetData>) => void;
  onToggleComplete: () => void;
  onRemove?: () => void;
  autoFocus?: boolean;
}

const AnimatedXStack = Animated.createAnimatedComponent(XStack);

export const SetRow = React.memo(function SetRow({
  index,
  set,
  previousWeight,
  onUpdate,
  onToggleComplete,
  onRemove,
  autoFocus
}: SetRowProps) {
  const theme = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [showRirSelector, setShowRirSelector] = useState(false);
  const feedback = useSensoryFeedback();

  const availablePlates = useSettings(s => s.availablePlates);
  const weightIncrement = availablePlates.length > 0 ? Math.min(...availablePlates) : 2.5;

  const weightRef = useRef<TextInput>(null);
  const repsRef = useRef<TextInput>(null);

  const anim = useSetRowAnimation({
    isCompleted: set.isCompleted,
    showRirSelector,
    screenWidth: SCREEN_WIDTH,
    onRemove,
    themeColors: {
      danger: theme.danger?.val ?? THEME_FALLBACKS.danger,
      dangerSubtle: theme.dangerSubtle?.val ?? THEME_FALLBACKS.dangerSubtle,
      surfaceSecondary: theme.surfaceSecondary?.val ?? 'transparent',
      successSubtle: theme.successSubtle?.val ?? 'transparent',
    },
  });

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => weightRef.current?.focus(), AUTOFOCUS_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  useEffect(() => {
    anim.syncRirAnim(showRirSelector);
  }, [showRirSelector, anim]);

  useEffect(() => {
    anim.syncCompletionAnim(set.isCompleted);
  }, [set.isCompleted, anim]);

  const handleToggle = useCallback(() => {
    Keyboard.dismiss();
    const isMarkingComplete = !set.isCompleted;
    const shouldShowRir = isMarkingComplete && set.rir === null && set.type === 'normal';

    if (isMarkingComplete) {
      feedback.success();
      if (shouldShowRir) setShowRirSelector(true);
    } else {
      feedback.light();
      setShowRirSelector(false);
    }

    if (isMarkingComplete) {
      anim.playCompletionPop();
    } else {
      anim.playUncompletionPress();
    }
    onToggleComplete();
  }, [set.isCompleted, set.rir, set.type, onToggleComplete, anim, feedback]);

  const completedRowStyle = set.isCompleted ? {
    backgroundColor: theme.successSubtle?.val,
    borderColor: theme.success?.val,
  } : {};

  const inputTextColor = set.isCompleted ? theme.success?.val : theme.color?.val;
  const inputBgColor = set.isCompleted ? theme.successSubtle?.val : theme.surfaceSecondary?.val;

  return (
    <YStack width="100%" borderRadius="$lg" overflow="hidden">
      {/* Delete reveal layer (behind the row) */}
      {onRemove && (
        <Animated.View
          style={[
            { position: 'absolute', right: 0, top: 0, bottom: 0, width: DELETE_BUTTON_WIDTH, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
            anim.styles.deleteButtonBg,
            anim.styles.deleteButtonOpacity,
          ]}
        >
          <Animated.View style={[{ position: 'absolute' }, anim.styles.deleteIconRest]}>
            <AppIcon icon={Trash2} color="danger" size={20} />
          </Animated.View>
          <Animated.View style={[{ position: 'absolute' }, anim.styles.deleteIconActive]}>
            <AppIcon icon={Trash2} color="background" size={20} />
          </Animated.View>
        </Animated.View>
      )}

      {/* Swipeable row */}
      <GestureDetector gesture={anim.swipeGesture}>
        <Animated.View style={anim.styles.swipeRow}>
          <Animated.View
            pointerEvents="none"
            style={[
              { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.success?.val ?? 'transparent', borderRadius: 12 },
              anim.styles.completionFlash,
            ]}
          />
          <XStack alignItems="center" height="$setRowHeight" gap="$sm" paddingHorizontal="$md" style={completedRowStyle}>
        <Pressable
          onPress={() => onUpdate({ type: set.type === 'warmup' ? 'normal' : 'warmup' })}
          style={{ width: 32, alignItems: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={set.type === 'warmup' ? `Set ${index + 1}, calentamiento. Pulsa para cambiar a normal` : `Set ${index + 1}. Pulsa para cambiar a calentamiento`}
        >
          {set.type === 'warmup' ? (
            <AppIcon icon={Flame} color="warning" size={16} />
          ) : (
            <AppText variant="bodySm" color="textSecondary" fontWeight="700">
              {index + 1}
            </AppText>
          )}
        </Pressable>

        <View flex={1} height={40} position="relative">
          <AnimatedXStack
            style={[{ flex: 1, gap: 8 }, anim.styles.inputGroup]}
            pointerEvents={showRirSelector ? 'none' : 'auto'}
          >
            <SetRowNumberInput
              inputRef={weightRef}
              flex={1.2}
              value={set.weight > 0 ? String(set.weight) : ''}
              placeholder={previousWeight && previousWeight > 0 ? String(previousWeight) : '0'}
              editable={!set.isCompleted}
              keyboardType="decimal-pad"
              textColor={inputTextColor}
              backgroundColor={inputBgColor}
              inputPaddingVertical={6}
              selectTextOnFocus={true}
              onSubmitEditing={() => repsRef.current?.focus()}
              returnKeyType="next"
              onChangeText={(value) => onUpdate({ weight: parseWeight(value) })}
              onDecrement={() => {
                if (!set.isCompleted) onUpdate({ weight: Math.max(0, set.weight - weightIncrement) });
              }}
              onIncrement={() => {
                if (!set.isCompleted) onUpdate({ weight: set.weight + weightIncrement });
              }}
            />

            <SetRowNumberInput
              inputRef={repsRef}
              flex={1}
              value={set.reps > 0 ? String(set.reps) : ''}
              placeholder="0"
              editable={!set.isCompleted}
              keyboardType="number-pad"
              textColor={inputTextColor}
              backgroundColor={inputBgColor}
              selectTextOnFocus={true}
              onSubmitEditing={() => {
                if (!set.isCompleted && set.reps > 0) {
                  handleToggle();
                }
              }}
              returnKeyType="done"
              onChangeText={(value) => onUpdate({ reps: parseInt(value, 10) || 0 })}
              onDecrement={() => {
                if (!set.isCompleted) onUpdate({ reps: Math.max(0, set.reps - 1) });
              }}
              onIncrement={() => {
                if (!set.isCompleted) onUpdate({ reps: set.reps + 1 });
              }}
            />
          </AnimatedXStack>

          <SetRowRirSelector
            value={set.rir}
            style={anim.styles.rirGroup}
            pointerEvents={showRirSelector ? 'auto' : 'none'}
            onSelect={(value) => {
              onUpdate({ rir: value });
              setShowRirSelector(false);
            }}
            onClose={() => setShowRirSelector(false)}
          />
        </View>

        {/* Partial Reps Toggle */}
        <Pressable
          onPress={() => onUpdate({ partialReps: !set.partialReps })}
          style={{ width: 28, height: 28, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: set.partialReps ? theme.warning?.val : 'transparent' }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: !!set.partialReps }}
          accessibilityLabel={`Marcar set ${index + 1} como repeticiones parciales`}
        >
          <AppText variant="label" color={set.partialReps ? 'background' : 'textTertiary'} fontWeight="700">
            P
          </AppText>
        </Pressable>

        <Animated.View style={[
          { borderRadius: 8, width: 44, height: 44 },
          anim.styles.animatedCheck,
        ]}>
          <Pressable
            onPress={handleToggle}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            accessibilityRole="checkbox"
            accessibilityLabel={`Completar set ${index + 1}`}
            accessibilityState={{ checked: set.isCompleted }}
          >
            <AppIcon
              icon={Check}
              color={set.isCompleted ? 'success' : 'textTertiary'}
              size={22}
              strokeWidth={3}
            />
          </Pressable>
        </Animated.View>

      </XStack>
        </Animated.View>
      </GestureDetector>

    </YStack>
  );
});