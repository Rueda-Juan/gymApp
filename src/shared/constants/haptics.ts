import * as Haptics from 'expo-haptics';

/**
 * Global vocabulary for tactical haptic feedback across the application.
 * Defines the "feel" (heavy, light, success) of interactions in the Garage Gym theme.
 */
export const HapticTokens = {
  /** Subtle click, used for scrolling or minor element touches */
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  /** Standard interaction, used for tabs and standard buttons */
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  /** Rigid, heavy clank. Used for completing sets or picking up heavy UI elements */
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  /** Positive reinforcement, used for breaking PRs or marking successful syncs */
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  /** Warning or error state, used for invalid inputs or critical alerts */
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  /** Selection changes, like moving through a picker or slider */
  selection: () => Haptics.selectionAsync(),
};
