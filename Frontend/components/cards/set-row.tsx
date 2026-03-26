import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Modal } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { Check, Flame, X, Trash2 } from 'lucide-react-native';
import { useSettings } from '@/store/useSettings';
import { calculatePlates } from '@/utils/plateMath';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming, interpolate, interpolateColor } from 'react-native-reanimated';
import { WorkoutSetState } from '@/store/useActiveWorkout';
import { AppText } from '../ui/AppText';

export interface SetRowProps {
  index: number;
  setRef: WorkoutSetState;
  onUpdate: (values: Partial<WorkoutSetState>) => void;
  onToggleComplete: () => void;
  onRemove?: () => void;
  isNew?: boolean;
  autoFocus?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

export function SetRow({ index, setRef, onUpdate, onToggleComplete, onRemove, isNew, autoFocus }: SetRowProps) {
  const theme = useTheme();
  const { availablePlates, defaultBarWeight } = useSettings();
  const [showPlateMath, setShowPlateMath] = React.useState(false);

  const plateCalculation = React.useMemo(() =>
    calculatePlates(setRef.weight, defaultBarWeight, availablePlates),
  [setRef.weight, defaultBarWeight, availablePlates]);

  const weightRef = useRef<TextInput>(null);
  const repsRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isNew || autoFocus) {
      setTimeout(() => weightRef.current?.focus(), 100);
    }
  }, [isNew, autoFocus]);

  const scale = useSharedValue(1);
  const bgColor = useSharedValue(setRef.isCompleted ? theme.successSubtle?.val : theme.surfaceSecondary?.val);

  const [showRirInput, setShowRirInput] = React.useState(false);
  const rirAnim = useSharedValue(0);

  useEffect(() => {
    bgColor.value = withTiming(setRef.isCompleted ? theme.successSubtle?.val : theme.surfaceSecondary?.val, { duration: 200 });
  }, [setRef.isCompleted, theme]);

  useEffect(() => {
    if (showRirInput) {
      rirAnim.value = withSpring(1, { damping: 15, stiffness: 120 });
    } else {
      rirAnim.value = withSpring(0, { damping: 15, stiffness: 120 });
    }
  }, [showRirInput]);

  const handleToggle = () => {
    if (!setRef.isCompleted) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (setRef.rir === null) {
        setShowRirInput(true);
        return;
      }
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    onToggleComplete();
  };

  const handleRirSelect = (val: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUpdate({ rir: val });
    setShowRirInput(false);
    if (!setRef.isCompleted) {
      onToggleComplete();
      scale.value = withSpring(0.9, {}, () => {
        scale.value = withSpring(1);
      });
    }
  };

  const toggleSetType = () => {
    if (setRef.isCompleted) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUpdate({ type: setRef.type === 'warmup' ? 'normal' : 'warmup' });
  };

  const animatedCheckStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
    transform: [{ scale: scale.value }],
  }));

  const inputsContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rirAnim.value, [0, 0.5], [1, 0]),
    transform: [{ translateX: interpolate(rirAnim.value, [0, 1], [0, -20]) }],
    zIndex: showRirInput ? 0 : 1,
    pointerEvents: showRirInput ? 'none' as const : 'auto' as const,
  }));

  const rirContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rirAnim.value, [0.5, 1], [0, 1]),
    transform: [{ translateX: interpolate(rirAnim.value, [0, 1], [20, 0]) }],
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: showRirInput ? 1 : 0,
    pointerEvents: showRirInput ? 'auto' as const : 'none' as const,
  }));

  const getSetTypeLabel = () => {
    switch (setRef.type) {
      case 'warmup': return 'W';
      case 'dropset': return 'D';
      case 'failure': return 'F';
      default: return String(index + 1);
    }
  };

  return (
    <Pressable
      onLongPress={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        onRemove?.();
      }}
      delayLongPress={500}
    >
      <YStack backgroundColor="$surface">
        <XStack
          alignItems="center"
          py="$2"
          gap="$2"
          height={56}
          opacity={setRef.isCompleted && !showRirInput ? 0.7 : 1}
        >
          <TouchableOpacity
            style={{ width: 32, alignItems: 'center', justifyContent: 'center' }}
            onPress={toggleSetType}
            disabled={setRef.isCompleted}
          >
            {setRef.type === 'warmup' ? (
              <Flame size={16} color={theme.gold?.val} />
            ) : (
              <AppText variant="bodySm" color="textSecondary" style={{ fontWeight: '700' }}>
                {getSetTypeLabel()}
              </AppText>
            )}
          </TouchableOpacity>

          <View style={{ alignItems: 'center', flex: 1.5 }}>
            <AppText variant="bodySm" color="textTertiary">--</AppText>
          </View>

          <View style={{ flex: 4.5, height: 40, justifyContent: 'center' }}>
            <AnimatedView
              style={[
                { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%', height: '100%' },
                inputsContainerStyle,
              ]}
            >
              <Pressable
                style={{
                  borderRadius: 8, backgroundColor: theme.surfaceSecondary?.val,
                  flex: 1.2, height: 40, justifyContent: 'center',
                }}
                onLongPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowPlateMath(true);
                }}
                delayLongPress={300}
              >
                <TextInput
                  ref={weightRef}
                  style={{
                    color: theme.color?.val, textAlign: 'center',
                    fontWeight: '600', fontSize: 16,
                    fontVariant: ['tabular-nums'],
                  }}
                  keyboardType="decimal-pad"
                  value={setRef.weight > 0 ? String(setRef.weight) : ''}
                  placeholder="0"
                  placeholderTextColor={theme.textTertiary?.val}
                  onChangeText={(val) => onUpdate({ weight: parseFloat(val) || 0 })}
                  editable={!setRef.isCompleted}
                  returnKeyType="next"
                  onSubmitEditing={() => repsRef.current?.focus()}
                  selectTextOnFocus
                />
                <View style={{ position: 'absolute', bottom: -12, alignSelf: 'center' }}>
                  <View style={{ width: 12, height: 2, backgroundColor: theme.primary?.val, borderRadius: 1, opacity: 0.3 }} />
                </View>
              </Pressable>

              <View
                style={{
                  borderRadius: 8, backgroundColor: theme.surfaceSecondary?.val,
                  flex: 1, height: 40, justifyContent: 'center',
                }}
              >
                <TextInput
                  ref={repsRef}
                  style={{
                    color: theme.color?.val, textAlign: 'center',
                    flex: 1, fontWeight: '600', fontSize: 16,
                    fontVariant: ['tabular-nums'],
                  }}
                  keyboardType="number-pad"
                  value={setRef.reps > 0 ? String(setRef.reps) : ''}
                  placeholder="0"
                  placeholderTextColor={theme.textTertiary?.val}
                  onChangeText={(val) => onUpdate({ reps: parseInt(val) || 0 })}
                  editable={!setRef.isCompleted}
                  selectTextOnFocus
                />
              </View>
            </AnimatedView>

            <AnimatedView
              style={[
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                rirContainerStyle,
              ]}
            >
              {[0, 1, 2, 3, 4].map(rirOption => (
                <TouchableOpacity
                  key={rirOption}
                  style={{
                    width: 36, height: 36, borderRadius: 18,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: setRef.rir === rirOption ? theme.primary?.val : theme.surfaceSecondary?.val,
                    borderWidth: 1,
                    borderColor: setRef.rir === rirOption ? theme.primary?.val : theme.borderColor?.val,
                  }}
                  onPress={() => handleRirSelect(rirOption)}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: setRef.rir === rirOption ? '#FFF' : theme.color?.val,
                      fontWeight: '700',
                    }}
                  >
                    {rirOption}{rirOption === 4 && '+'}
                  </Text>
                </TouchableOpacity>
              ))}
            </AnimatedView>
          </View>

          <AnimatedTouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggle}
            style={[
              { width: 44, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
              animatedCheckStyle,
            ]}
            hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
          >
            <Check
              size={22}
              color={setRef.isCompleted ? theme.success?.val : theme.textTertiary?.val}
              strokeWidth={3}
            />
          </AnimatedTouchableOpacity>
        </XStack>

        <Modal visible={showPlateMath} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: theme.overlay?.val, justifyContent: 'center', padding: 20 }}>
            <View style={{ backgroundColor: theme.surface?.val, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <AppText variant="titleMd">Plate Math</AppText>
                <TouchableOpacity onPress={() => setShowPlateMath(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <X size={24} color={theme.textTertiary?.val} />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <AppText variant="bodyMd" color="textSecondary">Barra:</AppText>
                <AppText variant="titleSm">{defaultBarWeight} kg</AppText>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <AppText variant="bodyMd" color="textSecondary">Total Deseado:</AppText>
                <AppText variant="titleSm" color="primary">{setRef.weight} kg</AppText>
              </View>

              <View style={{ height: 1, backgroundColor: theme.borderColor?.val, marginBottom: 16 }} />

              <AppText variant="label" color="textTertiary" style={{ marginBottom: 12 }}>DISCOS POR LADO</AppText>

              {plateCalculation.plates.length > 0 ? (
                plateCalculation.plates.map((p, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <AppText variant="bodyLg" style={{ fontWeight: '700' }}>{p.weight} kg</AppText>
                    <View style={{ backgroundColor: theme.surfaceSecondary?.val, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 }}>
                      <AppText variant="bodyMd" color="textSecondary" style={{ fontWeight: '600' }}>x{p.count}</AppText>
                    </View>
                  </View>
                ))
              ) : (
                <AppText variant="bodyMd" color="textSecondary" style={{ fontStyle: 'italic', textAlign: 'center', marginTop: 8 }}>
                  {setRef.weight > 0 ? 'Solo necesitas la barra' : 'Ingresa un peso válido'}
                </AppText>
              )}

              {plateCalculation.remainder !== 0 && setRef.weight > defaultBarWeight && (
                <View style={{ backgroundColor: theme.warningSubtle?.val, padding: 12, borderRadius: 8, marginTop: 16 }}>
                  <AppText variant="bodySm" color="warning" style={{ fontWeight: '600' }}>
                    Aviso: El peso exacto no es alcanzable con tus discos. Faltan {plateCalculation.remainder} kg.
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </YStack>
    </Pressable>
  );
}
