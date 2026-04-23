import React, { useRef } from 'react';
import { PlateCalculatorSheet } from './PlateCalculatorSheet';
import { CableStackSelectorSheet } from './CableStackSelectorSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

// Example parent integration
export type LoadType = 'barbell' | 'dumbbell' | 'cable';

interface ExampleSheetIntegrationProps {
  loadType: LoadType;
  sets: any[];
  selectedSetIndex: number;
  onSelectSet: (index: number) => void;
  onClose: () => void;
}

export const ExampleSheetIntegration: React.FC<ExampleSheetIntegrationProps> = ({
  loadType,
  sets,
  selectedSetIndex,
  onSelectSet,
  onClose,
}) => {
  const barbellSheetRef = useRef<BottomSheetModal>(null);
  const cableSheetRef = useRef<BottomSheetModal>(null);

  if (loadType === 'barbell' || loadType === 'dumbbell') {
    // Example: would use engine if needed
    return (
      <PlateCalculatorSheet
        ref={barbellSheetRef}
        value={sets[selectedSetIndex]?.weight ?? 0}
        onChange={() => {}}
        sets={sets}
        selectedSetIndex={selectedSetIndex}
        onSelectSet={onSelectSet}
        barWeight={20}
        availablePlates={[25,20,15,10,5,2.5,1.25]}
        onClose={onClose}
      />
    );
  }
  if (loadType === 'cable') {
    // Example: would use engine if needed
    return (
      <CableStackSelectorSheet
        ref={cableSheetRef}
        value={0}
        onChange={() => {}}
        maxStack={20}
        unitWeight={5}
        onClose={onClose}
      />
    );
  }
  return null;
};
