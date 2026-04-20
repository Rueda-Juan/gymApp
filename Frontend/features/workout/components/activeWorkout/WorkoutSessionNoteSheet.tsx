import React from 'react';
import { Pressable } from 'react-native';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { X } from 'lucide-react-native';
import { XStack } from 'tamagui';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { useBottomSheetStyles } from '@/hooks/ui/useBottomSheetStyles';
import { FONT_SCALE } from '@/tamagui.config';

const SHEET_PADDING = 20;
const INPUT_BORDER_RADIUS = 12;
const INPUT_PADDING = 12;
const INPUT_MIN_HEIGHT = 100;

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
  const { backgroundStyle, handleIndicatorStyle } = useBottomSheetStyles('surface');

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['40%']}
      enablePanDownToClose
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
    >
      <BottomSheetView style={{ flex: 1, padding: SHEET_PADDING }}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
          <AppText variant="titleSm">Nota de sesión</AppText>
          <Pressable onPress={onClose} accessibilityLabel="Cerrar">
            <AppIcon icon={X} color="textSecondary" size={24} />
          </Pressable>
        </XStack>
        <BottomSheetTextInput
          multiline
          accessibilityLabel="Nota de sesión"
          style={{
            fontSize: FONT_SCALE.sizes[3],
            textAlignVertical: 'top',
            borderRadius: INPUT_BORDER_RADIUS,
            padding: INPUT_PADDING,
            minHeight: INPUT_MIN_HEIGHT,
          }}
          placeholder="Cómo fue el entreno, sensaciones..."
          value={value}
          onChangeText={onChangeText}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}