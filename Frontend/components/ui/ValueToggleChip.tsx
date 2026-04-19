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
  disabled?: boolean;
}

function ValueToggleChipImpl<T extends string = string>({ value, label, isActive, onToggle, accessibilityLabel, variant = 'subtle', disabled }: ValueToggleChipProps<T>) {
  const handlePress = useCallback(() => {
    if (!disabled) onToggle(value);
  }, [onToggle, value, disabled]);

  return (
    <ToggleChip
      label={label}
      isActive={isActive}
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel ?? label}
      variant={variant}
      disabled={disabled}
    />
  );
}

const Memoized = React.memo(ValueToggleChipImpl) as unknown as <T extends string = string>(props: ValueToggleChipProps<T>) => React.ReactElement;

export const ValueToggleChip = Memoized;
export default ValueToggleChip;
