import { XStack, YStack } from 'tamagui';
import React, { useMemo } from 'react';
import { AnimatedViewShared } from '@/shared/ui/AnimatedViewShared';
import { Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Plus, X, Trash2, Clock, Dumbbell } from 'lucide-react-native';

import { AppText } from '@/shared/ui/AppText';
import { AppInput } from '@/shared/ui/AppInput';
import { AppIcon } from '@/shared/ui/AppIcon';
import { IconButton } from '@/shared/ui/AppButton';
import { SaveButton } from '@/shared/ui';
import { Screen } from '@/shared/ui/Screen';
import { RoutineEditorList } from './RoutineEditorList';
import { BodyAnatomySvg } from '@/entities/anatomy';
import { EmptyStateIcon } from '@/shared/ui/feedback/EmptyStateIcon';
import { useRoutineEditor } from '../hooks/useRoutineEditor';
import { useSettings, SettingsState } from '@/entities/settings';
import { RoutineEditorExercise } from '@/entities/routine';
import { calculateEstimatedDurationMinutes } from '@/entities/routine';
import { ROUTES } from '@/shared/constants/routes';
import { MuscleGroup } from '@kernel';

const LIST_BOTTOM_SAFE_PADDING = 120;

function RoutineFormHeader({ title, routineId, isSaving, onSave }: Pick<RoutineFormTemplateProps, 'title' | 'routineId' | 'isSaving' | 'onSave'>) {
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
        icon={<AppIcon icon={X} size={24} color="textSecondary" />}
        onPress={() => router.back()}
        accessibilityLabel="Cerrar"
      />
      <YStack flex={1} alignItems="center" paddingHorizontal="$md">
        {routineId ? (
          <AnimatedViewShared sharedTransitionTag={`routine-title-${routineId}`}>
            <AppText variant="titleSm" numberOfLines={1}>
              {title}
            </AppText>
          </AnimatedViewShared>
        ) : (
          <AppText variant="titleSm" numberOfLines={1}>
            {title}
          </AppText>
        )}
      </YStack>
      <SaveButton
        testID="save-routine-button"
        size={44}
        onPress={onSave}
        disabled={isSaving}
        loading={isSaving}
      />
    </XStack>
  );
}

function confirmDeleteRoutine(onDelete: () => void) {
  Alert.alert(
    'Eliminar rutina',
    '¿Estás seguro? Esta acción no se puede deshacer.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: onDelete },
    ],
  );
}

function RoutineFormFooter({ onDelete, exerciseCount }: Pick<RoutineFormTemplateProps, 'onDelete'> & { exerciseCount: number }) {
  return (
    <YStack>
      <Pressable
        testID="add-exercise-to-routine-button"
        onPress={() => router.push(ROUTES.EXERCISE_BROWSER_ROUTINE)}
        accessibilityRole="button"
        accessibilityLabel="Agregar ejercicio"
      >
        <YStack
          borderWidth={1.5}
          borderColor="$borderStrong"
          borderStyle="dashed"
          borderRadius="$lg"
          padding="$lg"
          alignItems="center"
          justifyContent="center"
          gap="$sm"
          marginTop="$lg"
        >
          <AppIcon icon={Plus} size={24} color="primary" />
          <AppText variant="bodyMd" color="primary" fontWeight="600">
            Agregar ejercicio
          </AppText>
        </YStack>
      </Pressable>

      {exerciseCount === 0 && (
        <YStack padding="$3xl" alignItems="center" gap="$md">
          <EmptyStateIcon icon={Dumbbell} size={48} color="textTertiary" />
          <AppText variant="bodyMd" color="textSecondary" textAlign="center">
            Agregá ejercicios para armar tu rutina
          </AppText>
        </YStack>
      )}

      {onDelete && (
        <Pressable
          testID="delete-routine-button"
          onPress={() => confirmDeleteRoutine(onDelete)}
          accessibilityRole="button"
          accessibilityLabel="Eliminar rutina"
        >
          <XStack
            alignItems="center"
            justifyContent="center"
            marginTop="$3xl"
            padding="$lg"
            minHeight={48}
            gap="$sm"
          >
            <AppIcon icon={Trash2} size={18} color="error" />
            <AppText variant="bodyMd" color="error" fontWeight="600">
              Eliminar Rutina
            </AppText>
          </XStack>
        </Pressable>
      )}
    </YStack>
  );
}

export interface RoutineFormTemplateProps {
  title: string;
  routineId?: string;
  isSaving?: boolean;
  onSave: () => void;
  onDelete?: () => void;
}

export function RoutineFormTemplate({ 
  title, 
  routineId, 
  isSaving, 
  onSave, 
  onDelete 
}: RoutineFormTemplateProps) {

  const {
    name, notes, exercises,
    setName, setNotes,
    removeExercise, updateExercise, reorderExercises,
    linkExerciseNext, unlinkExercise,
  } = useRoutineEditor();

  const restTimerSeconds = useSettings((s: SettingsState) => s.restTimerSeconds);

  const accumulatedMuscles = useMemo(() => {
    const muscleSet = new Set<string>();
    exercises.forEach((ex: RoutineEditorExercise) => {
      if (ex.muscle && ex.muscle !== 'other') muscleSet.add(ex.muscle);
    });
    return Array.from(muscleSet) as MuscleGroup[];
  }, [exercises]);

  return (
    <Screen safeAreaEdges={['top', 'bottom', 'left', 'right']}>
      <YStack flex={1}>
        <RoutineFormHeader
          title={title}
          routineId={routineId}
          isSaving={isSaving}
          onSave={onSave}
        />

        <RoutineEditorList
          exercises={exercises}
          onReorder={reorderExercises}
          onRemove={removeExercise}
          onUpdate={updateExercise}
          onLinkNext={linkExerciseNext}
          onUnlink={unlinkExercise}
          onViewDetails={(id) => router.push(`/exercise/${id}`)}

          contentContainerStyle={{
            paddingBottom: LIST_BOTTOM_SAFE_PADDING,
          }}

          listHeaderComponent={
            <YStack marginTop="$lg">
              <YStack gap="$md" marginBottom="$lg">

                <AppText variant="label" color="textSecondary" marginBottom="$sm">
                  Nombre
                </AppText>

                <AppInput
                  testID="routine-name-input"
                  placeholder="Ej. Empuje (Push Day)"
                  value={name}
                  onChangeText={setName}
                  accessibilityLabel="Nombre de la rutina"
                />

                {exercises.length > 0 && (
                  <XStack marginTop="$md" gap="$lg" alignItems="center">
                    <XStack alignItems="center" gap="$xs">
                      <AppIcon icon={Clock} size={14} color="textTertiary" />
                      <AppText variant="label" color="textTertiary">
                        ~{calculateEstimatedDurationMinutes(exercises, restTimerSeconds)} min
                      </AppText>
                    </XStack>

                    <XStack alignItems="center" gap="$xs">
                      <AppIcon icon={Dumbbell} size={14} color="textTertiary" />
                      <AppText variant="label" color="textTertiary">
                        {exercises.length} ejercicio{exercises.length !== 1 ? 's' : ''}
                      </AppText>
                    </XStack>
                  </XStack>
                )}

                {accumulatedMuscles.length > 0 && (
                  <YStack
                    alignItems="center"
                    justifyContent="center"
                    height={200}
                    width="100%"
                    backgroundColor="$surfaceSecondary"
                    borderColor="$borderColor"
                    borderWidth={1}
                    borderRadius="$xl"
                    overflow="hidden"
                  >
                    <BodyAnatomySvg
                      primaryMuscles={accumulatedMuscles}
                    />
                  </YStack>
                )}

                <AppText variant="label" color="textSecondary" marginBottom="$sm">
                  Notas (Opcional)
                </AppText>

                <AppInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Escribe alguna nota..."
                  multiline
                  scrollEnabled
                  minHeight={80}
                  maxHeight={160}
                  textAlignVertical="top"
                  accessibilityLabel="Notas de la rutina"
                />
              </YStack>

              <AppText variant="titleSm" marginBottom="$md">
                Ejercicios
              </AppText>
            </YStack>
          }

          listFooterComponent={
            <RoutineFormFooter onDelete={onDelete} exerciseCount={exercises.length} />
          }
        />
      </YStack>
    </Screen>
  );
}

