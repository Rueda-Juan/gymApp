import React, { useMemo, forwardRef } from 'react';
import { View, Pressable } from 'react-native';
import { YStack, XStack, ScrollView } from 'tamagui';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { IconButton } from '@/shared/ui/AppButton';
import { X, ChevronRight } from 'lucide-react-native';
import { Collapsible } from '@/shared/ui/Collapsible';
import { ValueToggleChip } from '@/shared/ui/ValueToggleChip';
import { HIERARCHICAL_MUSCLES, MUSCLE_LABELS } from '@/shared/constants/exercise';
import type { MuscleGroup } from '@kernel/types';

interface MuscleFilterSheetProps {
  selectedMuscle: string;
  onSelect: (muscle: string) => void;
  onClose: () => void;
}

export const MuscleFilterSheet = forwardRef<BottomSheetModal, MuscleFilterSheetProps>(
  ({ selectedMuscle, onSelect, onClose }, ref) => {
    const snapPoints = useMemo(() => ['70%', '90%'], []);

    const renderBackdrop = React.useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <BottomSheetView style={{ flex: 1 }}>
          <YStack flex={1} paddingHorizontal="$lg" paddingBottom="$xl">
            {/* Header */}
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$md" paddingVertical="$sm">
              <AppText variant="titleSm">Filtrar por músculo</AppText>
              <IconButton 
                icon={<AppIcon icon={X} size={24} color="color" />} 
                onPress={onClose} 
                accessibilityLabel="Cerrar filtro de músculos"
              />
            </XStack>

            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack gap="$md">
                {/* Opción "Todos los músculos" */}
                <XStack alignSelf="flex-start">
                  <ValueToggleChip
                    value=""
                    label="Todos los músculos"
                    isActive={selectedMuscle === ''}
                    onToggle={() => {
                      onSelect('');
                      onClose();
                    }}
                    variant="solid"
                  />
                </XStack>

                {HIERARCHICAL_MUSCLES.map((hm) => {
                  const hasSubs = hm.subdivisions && hm.subdivisions.length > 0;
                  const isMainActive = selectedMuscle === hm.category;
                  const isAnySubActive = hasSubs && (hm.subdivisions as any).includes(selectedMuscle);

                  if (!hasSubs) {
                    return (
                      <YStack key={hm.category} paddingVertical="$sm" borderBottomWidth={1} borderBottomColor="$borderColor">
                        <Pressable 
                          onPress={() => {
                            onSelect(hm.category);
                            onClose();
                          }}
                          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}
                        >
                          <AppText 
                            variant="bodyMd" 
                            color={isMainActive ? 'primary' : 'color'}
                            fontWeight={isMainActive ? '700' : '400'}
                          >
                            {MUSCLE_LABELS[hm.category as keyof typeof MUSCLE_LABELS]}
                          </AppText>
                          {isMainActive && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D4621A' }} />}
                        </Pressable>
                      </YStack>
                    );
                  }

                  return (
                    <Collapsible 
                      key={hm.category} 
                      title={`${MUSCLE_LABELS[hm.category as keyof typeof MUSCLE_LABELS]}${isAnySubActive || isMainActive ? ' •' : ''}`}
                      defaultOpen={isAnySubActive}
                    >
                      <YStack gap="$sm" paddingVertical="$sm">
                        <ValueToggleChip
                          value={hm.category}
                          label={`Todo ${MUSCLE_LABELS[hm.category as keyof typeof MUSCLE_LABELS]}`}
                          isActive={isMainActive}
                          onToggle={() => {
                            onSelect(hm.category);
                            onClose();
                          }}
                          variant="solid"
                        />
                        <XStack flexWrap="wrap" gap="$2">
                          {hm.subdivisions!.map((sub) => (
                            <ValueToggleChip
                              key={sub}
                              value={sub}
                              label={MUSCLE_LABELS[sub as keyof typeof MUSCLE_LABELS]}
                              isActive={selectedMuscle === sub}
                              onToggle={() => {
                                onSelect(sub);
                                onClose();
                              }}
                              variant="secondary"
                            />
                          ))}
                        </XStack>
                      </YStack>
                    </Collapsible>
                  );
                })}
              </YStack>
            </ScrollView>
          </YStack>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

// Name the forwardRef component for developer tools and lint rules
MuscleFilterSheet.displayName = 'MuscleFilterSheet';
