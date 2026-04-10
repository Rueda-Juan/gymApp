import React, { forwardRef } from 'react';
import { Input, InputProps} from 'tamagui';
import { FONT_SCALE } from '@/tamagui.config';

interface AppInputProps extends InputProps {
  variant?: 'default' | 'compact';
}

export const AppInput = forwardRef<React.ElementRef<typeof Input>, AppInputProps>(function AppInput({ variant = 'default', ...props }, ref) {
  const isCompact = variant === 'compact';

  return (
    <Input
      ref={ref}
      placeholderTextColor="$textTertiary"
      minHeight={isCompact ? 36 : '$inputHeight'}
      borderRadius="$sm"
      backgroundColor="$surfaceSecondary"
      color="$color"
      fontSize={isCompact ? FONT_SCALE.sizes[3] : FONT_SCALE.sizes[4]}
      fontWeight={FONT_SCALE.weights.regular}
      paddingHorizontal="$sm"
      accessibilityLabel={props.accessibilityLabel ?? props.placeholder}
      {...props}
    />
  );
});
AppInput.displayName = 'AppInput';
