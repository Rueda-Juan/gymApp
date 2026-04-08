import React, { useState } from 'react';
import { TextInput, Pressable } from 'react-native';
import { FONT_SCALE } from '@/tamagui.config';
import { XStack, View } from 'tamagui';
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react-native';
import { AppIcon } from '../ui/AppIcon';

const CHEVRON_AREA_WIDTH = 24;
const CHEVRON_AREA_HEIGHT = 36;
const INPUT_BORDER_RADIUS = 8;
const LONG_PRESS_DELAY_MS = 400;

interface ChevronAreaProps {
  icon: LucideIcon;
  onPress: () => void;
  opacity: number;
  disabled: boolean;
  accessibilityLabel: string;
}

function ChevronArea({ icon, onPress, opacity, disabled, accessibilityLabel }: ChevronAreaProps) {
  return (
    <View style={{ width: CHEVRON_AREA_WIDTH, height: CHEVRON_AREA_HEIGHT, justifyContent: 'center', alignItems: 'center', opacity }}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <AppIcon icon={icon} size={14} color="textTertiary" />
      </Pressable>
    </View>
  );
}

interface SetRowNumberInputProps {
  inputRef?: React.RefObject<TextInput | null>;
  flex?: number;
  value: string;
  placeholder: string;
  editable: boolean;
  keyboardType: 'decimal-pad' | 'number-pad';
  textColor?: string;
  backgroundColor?: string;
  inputPaddingVertical?: number;
  selectTextOnFocus?: boolean;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onLongPress?: () => void;
  returnKeyType?: 'next' | 'done' | 'default';
}

export function SetRowNumberInput({
  inputRef,
  flex = 1,
  value,
  placeholder,
  editable,
  keyboardType,
  textColor,
  backgroundColor,
  inputPaddingVertical,
  selectTextOnFocus,
  onChangeText,
  onSubmitEditing,
  onDecrement,
  onIncrement,
  onLongPress,
  returnKeyType,
}: SetRowNumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const chevronOpacity = isFocused ? 0 : 1;

  const input = (
    <TextInput
      ref={inputRef}
      style={{
        flex: 1,
        color: textColor,
        textAlign: 'center',
        fontWeight: '700',
        fontSize: FONT_SCALE.sizes[3],
        paddingVertical: inputPaddingVertical,
        fontVariant: ['tabular-nums'],
      }}
      keyboardType={keyboardType}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={textColor}
      selectTextOnFocus={selectTextOnFocus}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      editable={editable}
      returnKeyType={returnKeyType}
    />
  );

  return (
    <XStack flex={flex} alignItems="center">
      <ChevronArea
        icon={ChevronDown}
        onPress={onDecrement}
        opacity={chevronOpacity}
        disabled={isFocused || !editable}
        accessibilityLabel="Decrementar valor"
      />

      {onLongPress ? (
        <Pressable
          onLongPress={onLongPress}
          delayLongPress={LONG_PRESS_DELAY_MS}
          style={{ flex: 1, backgroundColor, borderRadius: INPUT_BORDER_RADIUS }}
          accessibilityRole="button"
          accessibilityLabel="Mantener presionado para acción especial"
        >
          {input}
        </Pressable>
      ) : (
        <View flex={1} style={{ backgroundColor, borderRadius: INPUT_BORDER_RADIUS }}>
          {input}
        </View>
      )}

      <ChevronArea
        icon={ChevronUp}
        onPress={onIncrement}
        opacity={chevronOpacity}
        disabled={isFocused || !editable}
        accessibilityLabel="Incrementar valor"
      />
    </XStack>
  );
}