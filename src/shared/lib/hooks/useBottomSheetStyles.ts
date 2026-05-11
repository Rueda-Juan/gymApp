import { useTheme } from 'tamagui';

type BottomSheetBackgroundToken = 'surface' | 'surfaceSecondary';

/**
 * Returns stable style objects for Gorhom BottomSheet props.
 * Eliminates the repeated `theme.X?.val as string` cast throughout the codebase.
 */
export function useBottomSheetStyles(backgroundToken: BottomSheetBackgroundToken = 'surfaceSecondary') {
  const theme = useTheme();

  const backgroundStyle = {
    backgroundColor: theme[backgroundToken]?.val ?? 'transparent',
  };

  const handleIndicatorStyle = {
    backgroundColor: theme.textTertiary?.val ?? 'transparent',
  };

  return { backgroundStyle, handleIndicatorStyle };
}
