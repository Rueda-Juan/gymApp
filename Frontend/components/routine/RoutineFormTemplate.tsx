import { XStack, YStack } from 'tamagui';
import React from 'react';
import AnimatedViewShared from '@/components/ui/AnimatedViewShared';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Plus, X, Trash2, Clock, Dumbbell } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { CardBase } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { RoutineEditorList } from '@/components/routine/RoutineEditorList';
import { useRoutineEditor } from '@/hooks/domain/useRoutineEditor';
import { useSettings } from '@/store/useSettings';
import { calculateEstimatedDurationMinutes } from '@/utils/routine';
import { ROUTES } from '@/constants/routes';
// Header extraído
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
      <AppButton
        appVariant="primary"
        size="sm"
        label={isSaving ? "Guardando..." : "Guardar"}
        fullWidth={false}
        onPress={onSave}
        disabled={isSaving}
        loading={isSaving}
        thermalBreathing
      />
    </XStack>
  );
}

// Footer extraído
function RoutineFormFooter({ onDelete }: Pick<RoutineFormTemplateProps, 'onDelete'>) {
  return (
    <YStack>
      <Pressable
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
      {onDelete && (
        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel="Eliminar rutina"
        >
          <XStack
            alignItems="center"
            justifyContent="center"
            marginTop="$3xl"
            padding="$md"
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

export function RoutineFormTemplate({ title, routineId, isSaving, onSave, onDelete }: RoutineFormTemplateProps) {
  const {
    name, notes, exercises,
    setName, setNotes,
    removeExercise, updateExercise, reorderExercises,
    linkExerciseNext, unlinkExercise,
  } = useRoutineEditor();

  const restTimerSeconds = useSettings(s => s.restTimerSeconds);

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <RoutineFormHeader title={title} routineId={routineId} isSaving={isSaving} onSave={onSave} />
      <RoutineEditorList
        exercises={exercises}
        onReorder={reorderExercises}
        onRemove={removeExercise}
        onUpdate={updateExercise}
        onLinkNext={linkExerciseNext}
        onUnlink={unlinkExercise}
        listHeaderComponent={
          <YStack marginTop="$lg">
            {/* Nombre Card */}
            <CardBase padding="$lg" marginBottom="$lg">
              <AppText variant="label" color="textSecondary" marginBottom="$sm">
                Nombre
              </AppText>
              <AppInput
                placeholder="Ej. Empuje (Push Day)"
                value={name}
                onChangeText={setName}
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
              <AppText variant="label" color="textSecondary" marginBottom="$sm">
                Notas (Opcional)
              </AppText>
              <AppInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Escribe alguna nota..."
                multiline
                scrollEnabled={true}
                minHeight={80}
                maxHeight={160}
                textAlignVertical="top"
              />
            </CardBase>
            <AppText variant="titleSm" marginBottom="$md">Ejercicios</AppText>
          </YStack>
        }
        listFooterComponent={<RoutineFormFooter onDelete={onDelete} />}
      />
    </Screen>
  );
}
