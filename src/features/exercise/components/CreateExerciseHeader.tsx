import React from 'react';
import { XStack } from 'tamagui';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { IconButton, SaveButton } from '@/shared/ui';
import { X } from 'lucide-react-native';

interface Props {
  isSaving: boolean;
  onSave: () => void | Promise<void>;
  onClose: () => void;
}

export function CreateExerciseHeader({ isSaving, onSave, onClose }: Props) {
  // Usar color del theme/tokens para el icono y feedback visual accesible
  // Suponiendo que AppIcon y IconButton aceptan props de color y background
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="$lg"
      height={56}
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      <IconButton
        testID="close-header-button"
        icon={<AppIcon icon={X} size={24} color={undefined} />} // Hereda el color actual del texto
        onPress={onClose}
        accessibilityLabel="Cerrar"
        backgroundColor="$surfaceSecondary"
        borderRadius={999}
        focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
      >
        {/* Texto oculto para screen readers como fallback */}
        <AppText style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Cerrar</AppText>
      </IconButton>
      <AppText variant="titleSm">Nuevo Ejercicio</AppText>
      <SaveButton
        testID="save-exercise-button"
        size={44}
        onPress={onSave}
        disabled={isSaving}
        loading={isSaving}
      />
    </XStack>
  );
}

export default CreateExerciseHeader;

