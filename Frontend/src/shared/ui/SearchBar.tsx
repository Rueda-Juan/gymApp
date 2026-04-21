import React from 'react';
import { TextInput } from 'react-native';
import { XStack, useTheme } from 'tamagui';
import { Search } from 'lucide-react-native';

import { AppIcon } from '@/shared/ui/AppIcon';
import { FONT_SCALE } from '@/tamagui.config';

const SEARCH_BAR_HEIGHT = 48;
const FALLBACK_ACCESSIBILITY_LABEL = 'Campo de búsqueda';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  inputRef?: React.RefObject<TextInput | null>;
  returnKeyType?: TextInput['props']['returnKeyType'];
}

export function SearchBar({ value, onChangeText, placeholder, inputRef, returnKeyType }: SearchBarProps) {
  const theme = useTheme();

  return (
    <XStack
      alignItems="center"
      gap="$sm"
      height={SEARCH_BAR_HEIGHT}
      borderRadius="$lg"
      borderWidth={1}
      paddingHorizontal="$md"
      backgroundColor="$surface"
      borderColor="$borderColor"
    >
      <AppIcon icon={Search} color="textTertiary" size={20} />
      <TextInput
        ref={inputRef}
        style={{ flex: 1, color: theme.color?.val, fontSize: FONT_SCALE.sizes[3] }}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary?.val}
        value={value}
        onChangeText={onChangeText}
        returnKeyType={returnKeyType}
        accessibilityLabel={placeholder ?? FALLBACK_ACCESSIBILITY_LABEL}
      />
    </XStack>
  );
}
