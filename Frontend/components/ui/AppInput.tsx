import React, { forwardRef } from 'react';
import { Input, InputProps} from 'tamagui';

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
      fontSize={isCompact ? '$3' : '$4'}
      fontWeight='$7'
      paddingHorizontal="$sm"
      {...props}
    />
  );
});
AppInput.displayName = 'AppInput';
