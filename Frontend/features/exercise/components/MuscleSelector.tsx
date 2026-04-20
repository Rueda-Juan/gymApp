import React, { useMemo } from 'react';
import { XStack, YStack } from 'tamagui';
import { ValueToggleChip } from '@/components/ui/ValueToggleChip';
import { Collapsible } from '@/components/ui/Collapsible';
import { HIERARCHICAL_MUSCLES, MUSCLE_LABELS } from '@/constants/exercise';
import type { MuscleGroup } from '@shared';

interface MuscleSelectorProps {
  selectedMuscles: MuscleGroup[];
  onToggle: (muscle: MuscleGroup) => void;
  type: 'primary' | 'secondary';
}
export const MuscleSelector = React.memo(({ selectedMuscles, onToggle, type }: MuscleSelectorProps) => {
  const toggleVariant = type === 'primary' ? 'solid' : 'secondary';

  const { withSubs, withoutSubs } = useMemo(() => {
    return {
      withSubs: HIERARCHICAL_MUSCLES.filter(hm => hm.subdivisions && hm.subdivisions.length > 0),
      withoutSubs: HIERARCHICAL_MUSCLES.filter(hm => !hm.subdivisions || hm.subdivisions.length === 0),
    };
  }, []);

  return (
    <YStack gap="$3" width="100%">
      {withSubs.map((hm) => {
        const isCategoryActive = selectedMuscles.includes(hm.category as MuscleGroup);
        const anySubActive = hm.subdivisions!.some(sub => selectedMuscles.includes(sub as MuscleGroup));
        const isActiveCount = hm.subdivisions!.reduce(
          (acc, sub) => acc + (selectedMuscles.includes(sub as MuscleGroup) ? 1 : 0),
          isCategoryActive ? 1 : 0
        );

        const title = `${MUSCLE_LABELS[hm.category]}${isActiveCount > 0 ? ` (${isActiveCount})` : ''}`;

        return (
          <Collapsible key={hm.category} title={title}>
            <XStack flexWrap="wrap" gap="$2">
              <ValueToggleChip
                value={hm.category as MuscleGroup}
                label={`Todo ${MUSCLE_LABELS[hm.category]}`}
                isActive={isCategoryActive}
                onToggle={onToggle}
                variant={toggleVariant}
                // Si algún submúsculo está activo, deshabilitar el grupo principal
                disabled={anySubActive}
                accessibilityLabel={`Todo ${MUSCLE_LABELS[hm.category]}${isCategoryActive ? ' (Seleccionado)' : ''}${anySubActive ? ' (Deshabilitado)' : ''}`}
              />
              {hm.subdivisions!.map((sub) => {
                const isSubActive = selectedMuscles.includes(sub as MuscleGroup);
                // Si el grupo principal está activo, deshabilitar los submúsculos
                return (
                  <ValueToggleChip
                    key={sub}
                    value={sub as MuscleGroup}
                    label={MUSCLE_LABELS[sub]}
                    isActive={isSubActive}
                    onToggle={onToggle}
                    variant={toggleVariant}
                    disabled={isCategoryActive}
                    accessibilityLabel={`${MUSCLE_LABELS[sub]}${isSubActive ? ' (Seleccionado)' : ''}${isCategoryActive ? ' (Deshabilitado)' : ''}`}
                  />
                );
              })}
            </XStack>
          </Collapsible>
        );
      })}

      {withoutSubs.length > 0 && (
        <YStack marginTop="$1">
          <XStack flexWrap="wrap" gap="$2" paddingTop="$2">
            {withoutSubs.map((hm) => {
              const isCategoryActive = selectedMuscles.includes(hm.category as MuscleGroup);
              return (
                <ValueToggleChip
                  key={hm.category}
                  value={hm.category as MuscleGroup}
                  label={MUSCLE_LABELS[hm.category]}
                  isActive={isCategoryActive}
                  onToggle={onToggle}
                  variant={toggleVariant}
                  accessibilityLabel={`${MUSCLE_LABELS[hm.category]} ${isCategoryActive ? '(Seleccionado)' : ''}`}
                />
              );
            })}
          </XStack>
        </YStack>
      )}
    </YStack>
  );
});

MuscleSelector.displayName = 'MuscleSelector';
