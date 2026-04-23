import { useCallback } from 'react';
import { useSettings } from '../model/useSettings';
import { HapticTokens } from '@/shared/constants/haptics';

/**
 * Entity-level hook to dispatch sensory feedback (tactile out-of-the-box).
 * It listens to `useSettings` to prevent firing feedback if the user disabled it.
 */
export function useSensoryFeedback() {
  const hapticsEnabled = useSettings((state) => state.hapticsEnabled);

  // Safe executor wrapper
  const executeFeedback = useCallback(
    (action: keyof typeof HapticTokens) => {
      if (!hapticsEnabled) return;
      HapticTokens[action]();
    },
    [hapticsEnabled]
  );

  return {
    light: () => executeFeedback('light'),
    medium: () => executeFeedback('medium'),
    heavy: () => executeFeedback('heavy'),
    success: () => executeFeedback('success'),
    error: () => executeFeedback('error'),
    selection: () => executeFeedback('selection'),
  };
}
