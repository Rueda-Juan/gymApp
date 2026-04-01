import React from 'react';
import { Pressable } from 'react-native';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { X } from 'lucide-react-native';
import { XStack, useTheme } from 'tamagui';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { FONT_SCALE } from '@/tamagui.config';

interface WorkoutSessionNoteSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  value: string;
  onChangeText: (value: string) => void;
  onClose: () => void;
}

export function WorkoutSessionNoteSheet({
  sheetRef,
  value,
  onChangeText,
  onClose,
}: WorkoutSessionNoteSheetProps) {
  const theme = useTheme();

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['40%']}
      enablePanDownToClose
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backgroundStyle={{ backgroundColor: theme.surface?.val as string }}
      handleIndicatorStyle={{ backgroundColor: theme.textTertiary?.val as string }}
    >
      <BottomSheetView style={{ flex: 1, padding: 20 }}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
          <AppText variant="titleSm">Nota de sesión</AppText>
          <Pressable onPress={onClose} accessibilityLabel="Cerrar">
            <AppIcon icon={X} color="textSecondary" size={24} />
          </Pressable>
        </XStack>
        <BottomSheetTextInput
          multiline
          style={{
            color: theme.color?.val as string,
            fontSize: FONT_SCALE.sizes[3],
            textAlignVertical: 'top',
            borderWidth: 1,
            borderColor: theme.borderColor?.val as string,
            borderRadius: 12,
            padding: 12,
            minHeight: 100,
          }}
          placeholder="Cómo fue el entreno, sensaciones..."
          placeholderTextColor={theme.textTertiary?.val as string}
          value={value}
          onChangeText={onChangeText}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}