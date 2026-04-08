import { XStack, YStack } from 'tamagui';
import React from 'react';
import Animated from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Plus, X, Trash2 } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { RoutineEditorList } from '@/components/routine/RoutineEditorList';
import { useRoutineEditor } from '@/hooks/useRoutineEditor';
import { useSettings } from '@/store/useSettings';
import { calculateEstimatedDurationMinutes } from '@/utils/routine';
import { ROUTES } from '@/constants/routes';

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
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" height={56}>
        <IconButton icon={<AppIcon icon={X} size={24} color="color" />} onPress={() => router.back()} accessibilityLabel="Cerrar" />
        <YStack flex={1} alignItems="center" paddingHorizontal="$md">
          {routineId ? (
            /* @ts-ignore - sharedTransitionTag exists at runtime but might be missing in @types/react-native-reanimated for SDK 54 */
            <Animated.View sharedTransitionTag={`routine-title-${routineId}`}>
              <AppText variant="titleSm" numberOfLines={1}>
                {title}
              </AppText>
            </Animated.View>
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

      <RoutineEditorList
        exercises={exercises}
        onReorder={reorderExercises}
        onRemove={removeExercise}
        onUpdate={updateExercise}
        onLinkNext={linkExerciseNext}
        onUnlink={unlinkExercise}
        listHeaderComponent={
          <YStack>
            <YStack marginBottom="$xl" marginTop="$md">
              <AppText variant="label" color="textSecondary" marginBottom="$xs">Nombre</AppText>
              <AppInput placeholder="Ej. Empuje (Push Day)" value={name} onChangeText={setName} />
              {exercises.length > 0 && (
                <AppText variant="label" color="textTertiary" marginTop="$xs">
                  {`~${calculateEstimatedDurationMinutes(exercises, restTimerSeconds)} min estimados · ${exercises.length} ejercicio${exercises.length !== 1 ? 's' : ''}`}
                </AppText>
              )}
            </YStack>

            <YStack marginBottom="$2xl">
              <AppText variant="label" color="textSecondary" marginBottom="$xs">Notas (Opcional)</AppText>
              <AppInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Escribe alguna nota..."
                multiline
                minHeight={80}
                maxHeight={160}
                textAlignVertical="top"
              />
            </YStack>

            <AppText variant="titleSm" marginBottom="$md">Ejercicios</AppText>
          </YStack>
        }
        listFooterComponent={
          <YStack>
            <YStack marginTop="$lg" marginBottom="$md">
              <AppButton
                appVariant="outline"
                size="md"
                label="Agregar ejercicio"
                icon={<AppIcon icon={Plus} size={18} color="primary" />}
                onPress={() => router.push(ROUTES.EXERCISE_BROWSER_ROUTINE)}
              />
            </YStack>

            {onDelete && (
              <Pressable onPress={onDelete} accessibilityRole="button" accessibilityLabel="Eliminar rutina">
                <XStack alignItems="center" justifyContent="center" marginTop="$xl" padding="$md" gap="$sm">
                  <AppIcon icon={Trash2} size={18} color="danger" />
                  <AppText variant="bodyMd" color="danger" fontWeight="600">Eliminar Rutina</AppText>
                </XStack>
              </Pressable>
            )}
          </YStack>
        }
      />
    </Screen>
  );
}
