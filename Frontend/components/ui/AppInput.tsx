import React, { forwardRef } from 'react';
import { Input, InputProps } from 'tamagui';

interface AppInputProps extends InputProps {
  variant?: 'default' | 'compact';
}

export const AppInput = forwardRef<any, AppInputProps>(function AppInput({ variant = 'default', ...props }, ref) {
  const theme = useTheme();
  const isCompact = variant === 'compact';

  return (
    <Input
      ref={ref}
      placeholderTextColor={theme.textTertiary}
      minHeight={isCompact ? 36 : 44}
      borderRadius="$sm"
      backgroundColor="$surfaceSecondary"
      color="$color"
      fontSize={isCompact ? 14 : 16}
      fontWeight="600"
      fontVariant={['tabular-nums']}
      paddingHorizontal="$sm"
      {...props}
    />
  );
});
