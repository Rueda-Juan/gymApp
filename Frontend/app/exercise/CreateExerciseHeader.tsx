import React from 'react';
import { XStack } from 'tamagui';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { X } from 'lucide-react-native';

interface Props {
  isSaving: boolean;
  onSave: () => void | Promise<void>;
  onClose: () => void;
}

export function CreateExerciseHeader({ isSaving, onSave, onClose }: Props) {
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
        icon={<AppIcon icon={X} size={24} color="color" />}
        onPress={onClose}
        accessibilityLabel="Cerrar"
      />
      <AppText variant="titleSm">Nuevo Ejercicio</AppText>
      <AppButton
        appVariant="primary"
        size="sm"
        label={isSaving ? 'Guardando...' : 'Guardar'}
        fullWidth={false}
        onPress={onSave}
        disabled={isSaving}
        loading={isSaving}
        thermalBreathing
      />
    </XStack>
  );
}

export default CreateExerciseHeader;
