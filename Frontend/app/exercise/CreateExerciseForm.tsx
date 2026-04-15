import React, { useMemo } from 'react';
import { ScrollView, YStack, XStack } from 'tamagui';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { ValueToggleChip } from '@/components/ui/ValueToggleChip';
import {
  EQUIPMENT_OPTIONS,
  EQUIPMENT_LABELS,
} from '@/constants/exercise';
import { MuscleSelector } from '@/components/workout/MuscleSelector';
import { BodyAnatomySvg } from '@/components/ui/BodyAnatomySvg';
import type { MuscleGroup, Equipment, ExerciseType, LoadType } from 'backend/shared/types';

const SCROLL_BOTTOM_INSET = 92;

interface Props {
  name: string;
  setName: (v: string) => void;
  primaryMuscles: MuscleGroup[];
  togglePrimaryMuscle: (m: MuscleGroup) => void;
  secondaryMuscles: MuscleGroup[];
  toggleSecondaryMuscle: (m: MuscleGroup) => void;
  equipment: Equipment | null;
  handleSetEquipment: (e: string) => void;
  exerciseType: ExerciseType;
  handleSetExerciseType: (t: ExerciseType) => void;
  loadType: LoadType;
  handleSetLoadType: (l: LoadType) => void;
  description: string;
  setDescription: (v: string) => void;
  isSaving?: boolean;
  svgInteractive?: boolean;
  onSvgSelectMuscle?: (muscle: string | null) => void;
}

export function CreateExerciseForm(props: Props) {
  const {
    name,
    setName,
    primaryMuscles,
    togglePrimaryMuscle,
    secondaryMuscles,
    toggleSecondaryMuscle,
    equipment,
    handleSetEquipment,
    exerciseType,
    handleSetExerciseType,
    loadType,
    handleSetLoadType,
    description,
    setDescription,
    isSaving,
    svgInteractive,
    onSvgSelectMuscle,
  } = props;

  const EXERCISE_TYPES: { value: ExerciseType; label: string }[] = [
    { value: 'compound', label: 'Compuesto' },
    { value: 'isolation', label: 'Aislamiento' },
  ];

  const LOAD_TYPES: { value: LoadType; label: string }[] = [
    { value: 'weighted', label: 'Con Peso' },
    { value: 'bodyweight', label: 'Peso Corporal' },
    { value: 'assisted', label: 'Asistido' },
    { value: 'timed', label: 'Tiempo' },
  ];

  const activeMuscles = useMemo(() => {
    return [...primaryMuscles, ...secondaryMuscles];
  }, [primaryMuscles, secondaryMuscles]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: SCROLL_BOTTOM_INSET }}>
      <YStack gap="$md">
        <YStack>
          <AppText variant="label">Nombre</AppText>
          <AppInput value={name} onChangeText={setName} placeholder="Nombre del ejercicio" />
        </YStack>

        <YStack alignItems="center" justifyContent="center" height={300} width="100%" marginVertical="$sm">
          <BodyAnatomySvg
            activeMuscles={activeMuscles}
            interactive={svgInteractive}
            onSelectMuscle={onSvgSelectMuscle}
          />
        </YStack>

        <YStack>
          <AppText variant="label">Músculos primarios</AppText>
          <MuscleSelector
            selectedMuscles={primaryMuscles}
            onToggle={togglePrimaryMuscle}
            type="primary"
          />
        </YStack>

        <YStack>
          <AppText variant="label">Músculos secundarios</AppText>
          <MuscleSelector
            selectedMuscles={secondaryMuscles}
            onToggle={toggleSecondaryMuscle}
            type="secondary"
          />
        </YStack>

        <YStack>
          <AppText variant="label">Equipo</AppText>
          <XStack flexWrap="wrap" gap="$2">
            {EQUIPMENT_OPTIONS.map((eq) => (
              <ValueToggleChip
                key={eq}
                value={eq}
                label={EQUIPMENT_LABELS[eq]}
                isActive={equipment === eq}
                onToggle={handleSetEquipment}
                variant="solid"
                accessibilityLabel={`Equipamiento: ${EQUIPMENT_LABELS[eq]}${equipment === eq ? ' (Seleccionado)' : ''}`}
              />
            ))}
          </XStack>
        </YStack>

        <YStack>
          <AppText variant="label">Tipo</AppText>
          <XStack flexWrap="wrap" gap="$2">
            {EXERCISE_TYPES.map((t) => (
              <ValueToggleChip
                key={t.value}
                value={t.value}
                label={t.label}
                isActive={exerciseType === t.value}
                onToggle={handleSetExerciseType}
                accessibilityLabel={`${t.label}${exerciseType === t.value ? ' (Seleccionado)' : ''}`}
              />
            ))}
          </XStack>
        </YStack>

        <YStack>
          <AppText variant="label">Carga</AppText>
          <XStack flexWrap="wrap" gap="$2">
            {LOAD_TYPES.map((l) => (
              <ValueToggleChip
                key={l.value}
                value={l.value}
                label={l.label}
                isActive={loadType === l.value}
                onToggle={handleSetLoadType}
                accessibilityLabel={`${l.label}${loadType === l.value ? ' (Seleccionado)' : ''}`}
              />
            ))}
          </XStack>
        </YStack>

        <YStack>
          <AppText variant="label">Descripción</AppText>
          <AppInput
            value={description}
            onChangeText={setDescription}
            placeholder="Notas, instrucciones o variantes"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100 }}
          />
        </YStack>
      </YStack>
    </ScrollView>
  );
}

export default CreateExerciseForm;
