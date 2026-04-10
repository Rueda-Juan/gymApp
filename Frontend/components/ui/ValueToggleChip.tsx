import React, { useCallback } from 'react';
import { ToggleChip } from './ToggleChip';

type Variant = 'subtle' | 'solid' | 'secondary';

export type ValueToggleChipProps<T extends string = string> = {
  value: T;
  label: string;
  isActive: boolean;
  onToggle: (value: T) => void;
  accessibilityLabel?: string;
  variant?: Variant;
}

function ValueToggleChipImpl<T extends string = string>({ value, label, isActive, onToggle, accessibilityLabel, variant = 'subtle' }: ValueToggleChipProps<T>) {
  const handlePress = useCallback(() => onToggle(value), [onToggle, value]);

  return (
    <ToggleChip
      label={label}
      isActive={isActive}
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel ?? label}
      variant={variant}
    />
  );
}

const Memoized = React.memo(ValueToggleChipImpl) as unknown as <T extends string = string>(props: ValueToggleChipProps<T>) => React.ReactElement;

export const ValueToggleChip = Memoized;
export default ValueToggleChip;
