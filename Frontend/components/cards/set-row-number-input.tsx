import React, { useState } from 'react';
import { TextInput, Pressable } from 'react-native';
import { FONT_SCALE } from '@/tamagui.config';
import { XStack, View } from 'tamagui';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { AppIcon } from '../ui/AppIcon';

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
  onChangeText: (value: string) => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onLongPress?: () => void;
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
  onChangeText,
  onDecrement,
  onIncrement,
  onLongPress,
}: SetRowNumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

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
      }}
      keyboardType={keyboardType}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={textColor}
      onChangeText={onChangeText}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      editable={editable}
    />
  );

  return (
    <XStack flex={flex} alignItems="center">
      <View style={{ width: 24, height: 36, justifyContent: 'center', alignItems: 'center', opacity: isFocused ? 0 : 1 }}>
        <Pressable
          onPress={onDecrement}
          disabled={isFocused || !editable}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <AppIcon icon={ChevronDown} size={14} color="textTertiary" />
        </Pressable>
      </View>

      {onLongPress ? (
        <Pressable
          onLongPress={onLongPress}
          delayLongPress={400}
          style={{ flex: 1, backgroundColor, borderRadius: 8 }}
        >
          {input}
        </Pressable>
      ) : (
        <View flex={1} style={{ backgroundColor, borderRadius: 8 }}>
          {input}
        </View>
      )}

      <View style={{ width: 24, height: 36, justifyContent: 'center', alignItems: 'center', opacity: isFocused ? 0 : 1 }}>
        <Pressable
          onPress={onIncrement}
          disabled={isFocused || !editable}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <AppIcon icon={ChevronUp} size={14} color="textTertiary" />
        </Pressable>
      </View>
    </XStack>
  );
}