import React from 'react';
import { XStack } from 'tamagui';
import { AppButton } from '@/components/ui/AppButton';

interface Props {
  isSaving: boolean;
  onSave: () => void | Promise<void>;
}

export function CreateExerciseFooter({ isSaving, onSave }: Props) {
  return (
    <XStack padding="$lg" borderTopWidth={1} borderTopColor="$borderColor">
      <AppButton
        appVariant="primary"
        label={isSaving ? 'Guardando...' : 'Guardar ejercicio'}
        onPress={onSave}
        loading={isSaving}
        fullWidth
      />
    </XStack>
  );
}

export default CreateExerciseFooter;
