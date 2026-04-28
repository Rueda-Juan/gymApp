import React, { forwardRef, useImperativeHandle, useRef, useCallback, memo } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { PlateCalculatorSheet } from './PlateCalculatorSheet';
import { CableStackSelectorSheet } from './CableStackSelectorSheet';

export type WeightInputType = 'barbell' | 'dumbbell' | 'cable';

export interface WeightInputModalProps {
  type: WeightInputType;
  value: number;
  onChange: (value: number) => void;
  onClose: () => void;
  // Configuración mínima para los sheets
  sets?: any[]; // para barbell/dumbbell
  selectedSetIndex?: number;
  onSelectSet?: (index: number) => void;
  barWeight?: number;
  availablePlates?: number[];
  maxStack?: number; // para cable
  unitWeight?: number;
}

export interface WeightInputModalRef {
  present: () => void;
  close: () => void;
}

export const WeightInputModal = memo(
  forwardRef<WeightInputModalRef, WeightInputModalProps>(
    (
      {
        type,
        value,
        onChange,
        onClose,
        sets = [],
        selectedSetIndex = 0,
        onSelectSet,
        barWeight = 20,
        availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25],
        maxStack = 20,
        unitWeight = 5,
      },
      ref
    ) => {
      const sheetRef = useRef<BottomSheetModal>(null);

      useImperativeHandle(ref, () => ({
        present: () => sheetRef.current?.present(),
        close: () => sheetRef.current?.close(),
      }));

      const handleClose = useCallback(() => {
        onClose();
      }, [onClose]);

      const handleChange = useCallback(
        (newValue: number) => {
          if (newValue !== value) onChange(newValue);
        },
        [onChange, value]
      );

      if (type === 'barbell' || type === 'dumbbell') {
        return (
          <PlateCalculatorSheet
            ref={sheetRef}
            value={value}
            onChange={handleChange}
            barWeight={barWeight}
            availablePlates={availablePlates}
            sets={sets}
            selectedSetIndex={selectedSetIndex}
            onSelectSet={onSelectSet}
            onClose={handleClose}
          />
        );
      }
      if (type === 'cable') {
        return (
          <CableStackSelectorSheet
            ref={sheetRef}
            value={value}
            onChange={handleChange}
            maxStack={maxStack}
            unitWeight={unitWeight}
            onClose={handleClose}
          />
        );
      }
      return null;
    }
  )
);

WeightInputModal.displayName = 'WeightInputModal';
