import React, { useCallback, useRef } from 'react';
import config from '@/shared/ui/theme/tamagui.config';
import { useTheme, ScrollView, YStack, XStack } from 'tamagui';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMuscleSelection } from '../hooks/useMuscleSelection';
import { MuscleSelectorSheet } from './MuscleSelectorSheet';
import { AppInput } from '@/shared/ui/AppInput';
import { AppText } from '@/shared/ui/AppText';
import { ValueToggleChip } from '@/shared/ui/ValueToggleChip';
import {
  EQUIPMENT_OPTIONS,
  EQUIPMENT_LABELS,
} from '@/shared/constants/exercise';
// import { MuscleSelector } from '@/shared/ui/workout/MuscleSelector';
import { BodyAnatomySvg } from '@/entities/anatomy';
import type { MuscleGroup, Equipment, ExerciseType, LoadType } from '@kernel';
const BOTTOM_SHEET_SNAP_POINTS = ['75%'];

const SCROLL_BOTTOM_INSET = 92;

interface Props {
  name: string;
  setName: (v: string) => void;
  primaryMuscles: MuscleGroup[];
  setPrimaryMuscles: (v: MuscleGroup[]) => void;
  togglePrimaryMuscle: (m: MuscleGroup) => void;
  secondaryMuscles: MuscleGroup[];
  setSecondaryMuscles: (v: MuscleGroup[]) => void;
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
  const tokens = config.tokens;
  const theme = useTheme();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {
    muscleRole,
    setMuscleRole,
    pendingPrimary,
    pendingSecondary,
    expandedGroup,
    setExpandedGroup,
    muscleError,
    setMuscleError,
    handleToggleMuscle,
  } = useMuscleSelection(props.primaryMuscles, props.secondaryMuscles);

  const openSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  const confirmMuscles = useCallback(() => {
    if (pendingPrimary.length === 0) {
      setMuscleError('Seleccioná al menos un músculo primario');
      return;
    }
    setMuscleError(null);
    if (props.setPrimaryMuscles) props.setPrimaryMuscles(pendingPrimary);
    if (props.setSecondaryMuscles) props.setSecondaryMuscles(pendingSecondary);
    bottomSheetRef.current?.close();
  }, [pendingPrimary, pendingSecondary, props, setMuscleError]);

  const {
    name,
    setName,
    equipment,
    handleSetEquipment,
    exerciseType,
    handleSetExerciseType,
    loadType,
    handleSetLoadType,
    description,
    setDescription,
    togglePrimaryMuscle,
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


  return (
    <YStack flex={1}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: tokens.space.lg.val,
          paddingBottom: SCROLL_BOTTOM_INSET + tokens.space['2xl'].val,
        }}
      >
        <YStack gap={tokens.space.md.val}>

          <YStack marginBottom={tokens.space.lg.val}>
            <AppText variant="label">Nombre</AppText>
            <AppInput
              value={name}
              onChangeText={setName}
              placeholder="Nombre del ejercicio"
              backgroundColor={theme.surfaceSecondary?.val || theme.background?.val}
              borderColor={theme.borderColor?.val || theme.surfaceSecondary?.val || theme.background?.val}
              borderWidth={1}
              accessibilityLabel="Nombre del ejercicio"
              autoCapitalize="words"
              returnKeyType="done"
            />
          </YStack>

          <YStack
            alignItems="center"
            justifyContent="center"
            height={320}
            width="100%"
            marginTop={tokens.space.lg.val}
            marginBottom={tokens.space.xl.val}
            backgroundColor={theme.surface?.val}
            borderColor={theme.borderColor?.val}
            borderWidth={1}
            borderRadius={tokens.radius.xl.val}
            overflow="hidden"
          >
            <BodyAnatomySvg
              primaryMuscles={pendingPrimary}
              secondaryMuscles={pendingSecondary}
              onPressMuscle={togglePrimaryMuscle}
            />
          </YStack>



          {/* Botón para abrir BottomSheet de selección de músculos */}
          <YStack>
            <AppText variant="label">Músculos</AppText>
            <XStack>
              <ValueToggleChip
                value="add-muscles"
                label="Músculo +"
                isActive={false}
                onToggle={openSheet}
                variant="solid"
              />
            </XStack>
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

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={BOTTOM_SHEET_SNAP_POINTS}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        bottomInset={bottomInset}
        backgroundStyle={{ backgroundColor: theme.surface?.val || '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, borderColor: theme.borderColor?.val || '#EAE6DF', borderWidth: 1 }}
      >
        <BottomSheetView style={{ flex: 1, overflow: 'hidden' }}>
          <MuscleSelectorSheet
            muscleRole={muscleRole}
            setMuscleRole={setMuscleRole}
            pendingPrimary={pendingPrimary}
            pendingSecondary={pendingSecondary}
            expandedGroup={expandedGroup}
            setExpandedGroup={setExpandedGroup}
            muscleError={muscleError}
            handleToggleMuscle={handleToggleMuscle}
            confirmMuscles={confirmMuscles}
            closeSheet={() => bottomSheetRef.current?.close()}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </YStack>
  );
}

export default CreateExerciseForm;

