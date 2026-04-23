import React, { useRef } from 'react';
import { PlateCalculatorSheet, CableStackSelectorSheet } from '@/entities/workout';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { createWeightEngine, type WeightEngine } from '@/entities/workout';

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
    const engine: WeightEngine = createWeightEngine(loadType, { barWeight: 20, availablePlates: [25,20,15,10,5,2.5,1.25] });
    const result = engine.compute({ targetWeight: sets[selectedSetIndex]?.weight ?? 0 });
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
    const engine: WeightEngine = createWeightEngine('cable', { unitWeight: 5, maxStack: 20 });
    const result = engine.compute({ selectedBlocks: 0 });
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
